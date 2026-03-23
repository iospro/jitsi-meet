import { MenuView } from '@react-native-menu/menu';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { IReduxState } from '../../../app/types';
import { toggleAudioOnly } from '../../../base/audio-only/actions';
import { openDialog } from '../../../base/dialog/actions';
import {
    CAR_MODE_ENABLED,
    IOS_RECORDING_ENABLED,
    LIVE_STREAMING_ENABLED,
    OVERFLOW_MENU_ENABLED,
    RECORDING_ENABLED,
    VIDEO_SHARE_BUTTON_ENABLED
} from '../../../base/flags/constants';
import { getFeatureFlag } from '../../../base/flags/functions';
import Icon from '../../../base/icons/components/Icon';
import { IconDotsHorizontal } from '../../../base/icons/svg';
import { raiseHand } from '../../../base/participants/actions';
import {
    getLocalParticipant,
    hasRaisedHand
} from '../../../base/participants/functions';
import BaseTheme from '../../../base/ui/components/BaseTheme.native';
import {
    navigate
} from '../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef';
import { screen } from '../../../mobile/navigation/routes';
import StopLiveStreamDialog
    from '../../../recording/components/LiveStream/native/StopLiveStreamDialog';
import StopRecordingDialog
    from '../../../recording/components/Recording/native/StopRecordingDialog';
import {
    isLiveStreamingRunning,
    isRecordingRunning
} from '../../../recording/functions';
import { shouldDisplayReactionsButtons } from '../../../reactions/functions.any';
import { isSalesforceEnabled } from '../../../salesforce/functions';
import { toggleSharedVideo } from '../../../shared-video/actions';
import { isSharedVideoEnabled } from '../../../shared-video/functions';
import { isSpeakerStatsDisabled } from '../../../speaker-stats/functions';
import { iAmVisitor } from '../../../visitors/functions';
import { setWhiteboardOpen } from '../../../whiteboard/actions.any';
import { isWhiteboardButtonVisible } from '../../../whiteboard/functions';
import { customButtonPressed } from '../../actions.native';
import { getVisibleNativeButtons } from '../../functions.native';
import { useNativeToolboxButtons } from '../../hooks.native';
import { IToolboxNativeButton } from '../../types';

import styles from './styles';

/**
 * iOS-specific overflow menu button.
 * Opens a native UIMenu instead of a BottomSheet when pressed.
 * Items and their order match the existing BottomSheet overflow menu.
 */
const OverflowMenuButton = (_props: any) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // ── Feature flags ──────────────────────────────────────────────────────
    const enabled = useSelector(
        (state: IReduxState) => getFeatureFlag(state, OVERFLOW_MENU_ENABLED, true)
    );
    const carModeEnabled = useSelector(
        (state: IReduxState) => getFeatureFlag(state, CAR_MODE_ENABLED, true)
    );
    const recordingEnabled = useSelector(
        (state: IReduxState) =>
            getFeatureFlag(state, RECORDING_ENABLED, true)
            && getFeatureFlag(state, IOS_RECORDING_ENABLED, false)
    );
    const liveStreamEnabled = useSelector(
        (state: IReduxState) => getFeatureFlag(state, LIVE_STREAMING_ENABLED, true)
    );
    const sharedVideoFlagEnabled = useSelector(
        (state: IReduxState) => getFeatureFlag(state, VIDEO_SHARE_BUTTON_ENABLED, true)
    );

    // ── Toggle states ──────────────────────────────────────────────────────
    const audioOnly = useSelector(
        (state: IReduxState) => Boolean(state['features/base/audio-only'].enabled)
    );
    const localParticipant = useSelector(getLocalParticipant);
    const raisedHand = hasRaisedHand(localParticipant);
    const isRecording = useSelector(isRecordingRunning);
    const isLiveStreaming = useSelector(isLiveStreamingRunning);

    // ── Conditional visibility ─────────────────────────────────────────────
    const displayReactionsButtons = useSelector(shouldDisplayReactionsButtons);
    const isSharedVideoOn = useSelector(isSharedVideoEnabled);
    const isSpeakerStatsOff = useSelector(isSpeakerStatsDisabled);
    const isBreakoutSupported = useSelector(
        (state: IReduxState) =>
            Boolean(
                state['features/base/conference'].conference?.getBreakoutRooms()?.isSupported()
            )
    );
    const hasSalesforce = useSelector(isSalesforceEnabled);
    const showWhiteboard = useSelector(isWhiteboardButtonVisible);
    const documentUrl = useSelector(
        (state: IReduxState) => state['features/etherpad'].documentUrl
    );
    const isVisitor = useSelector(iAmVisitor);

    // ── Raise-hand visibility (mirrors OverflowMenu logic) ─────────────────
    const { clientWidth } = useSelector(
        (state: IReduxState) => state['features/base/responsive-ui']
    );
    const { customToolbarButtons } = useSelector(
        (state: IReduxState) => state['features/base/config']
    );
    const { mainToolbarButtonsThresholds, toolbarButtons } = useSelector(
        (state: IReduxState) => state['features/toolbox']
    );
    const allButtons = useNativeToolboxButtons(customToolbarButtons);
    const { mainMenuButtons, overflowMenuButtons } = getVisibleNativeButtons({
        allButtons,
        clientWidth,
        mainToolbarButtonsThresholds,
        toolbarButtons,
        iAmVisitor: isVisitor
    });
    const isRaiseHandInMainMenu = mainMenuButtons?.some(
        (item: IToolboxNativeButton) => item.key === 'raisehand'
    );
    const showRaiseHand = !displayReactionsButtons && !isRaiseHandInMainMenu;

    if (!enabled) {
        return null;
    }

    // ── Build UIMenu action list (same order as BottomSheet OverflowMenu) ──
    // `state: 'on'` renders a system checkmark next to the item.
    // `image` uses SF Symbol names (iOS 13+).
    // Sections are created with displayInline+subactions (renders a divider between groups).
    type MenuAction = {
        id: string;
        title: string;
        image?: string;
        imageColor?: string;
        state?: 'on' | 'off';
        displayInline?: boolean;
        subactions?: Array<MenuAction>;
    };

    // ── Custom overflow buttons section (shown at top if present) ──────────
    const customActions: Array<MenuAction> = [];

    overflowMenuButtons?.forEach(({ key, text }: IToolboxNativeButton) => {
        if (key === 'raisehand') {
            return;
        }
        customActions.push({
            id: `custom_${key}`,
            title: text ?? key,
            image: 'star',
            imageColor: '#FFFFFF'
        });
    });

    // ── Standard actions ───────────────────────────────────────────────────
    const standardActions: Array<MenuAction> = [];

    if (carModeEnabled) {
        standardActions.push({
            id: 'carmode',
            title: t('carmode.labels.buttonLabel'),
            image: 'car.side',
            imageColor: '#FFFFFF'
        });
    }

    standardActions.push({
        id: 'audioOnly',
        title: t('toolbar.audioOnlyOn'),
        image: 'headphones',
        imageColor: '#FFFFFF',
        state: audioOnly ? 'on' : 'off'
    });

    if (showRaiseHand) {
        standardActions.push({
            id: 'raiseHand',
            title: t('toolbar.raiseYourHand'),
            image: 'hand.raised',
            imageColor: '#FFFFFF',
            state: raisedHand ? 'on' : 'off'
        });
    }

    standardActions.push({
        id: 'security',
        title: t('toolbar.security'),
        image: 'lock.shield',
        imageColor: '#FFFFFF'
    });

    if (recordingEnabled) {
        standardActions.push({
            id: 'record',
            title: isRecording ? t('dialog.stopRecording') : t('dialog.startRecording'),
            image: 'record.circle',
            imageColor: isRecording ? '#FF3B30' : '#FFFFFF',
            state: isRecording ? 'on' : 'off'
        });
    }

    if (liveStreamEnabled) {
        standardActions.push({
            id: 'liveStream',
            title: isLiveStreaming
                ? t('dialog.stopLiveStreaming')
                : t('dialog.startLiveStreaming'),
            image: 'dot.radiowaves.left.and.right',
            imageColor: isLiveStreaming ? '#FF3B30' : '#FFFFFF',
            state: isLiveStreaming ? 'on' : 'off'
        });
    }

    if (hasSalesforce) {
        standardActions.push({
            id: 'salesforce',
            title: t('toolbar.linkToSalesforce'),
            image: 'link',
            imageColor: '#FFFFFF'
        });
    }

    if (showWhiteboard) {
        standardActions.push({
            id: 'whiteboard',
            title: t('toolbar.showWhiteboard'),
            image: 'scribble',
            imageColor: '#FFFFFF'
        });
    }

    if (isSharedVideoOn && sharedVideoFlagEnabled) {
        standardActions.push({
            id: 'sharedVideo',
            title: t('toolbar.sharedvideo'),
            image: 'play.rectangle',
            imageColor: '#FFFFFF'
        });
    }

    if (!isSpeakerStatsOff) {
        standardActions.push({
            id: 'speakerStats',
            title: t('toolbar.speakerStats'),
            image: 'chart.bar.xaxis',
            imageColor: '#FFFFFF'
        });
    }

    if (isBreakoutSupported) {
        standardActions.push({
            id: 'breakoutRooms',
            title: t('breakoutRooms.buttonLabel'),
            image: 'rectangle.split.2x2',
            imageColor: '#FFFFFF'
        });
    }

    standardActions.push({
        id: 'closedCaptions',
        title: t('toolbar.startSubtitles'),
        image: 'captions.bubble',
        imageColor: '#FFFFFF'
    });

    if (documentUrl) {
        standardActions.push({
            id: 'sharedDocument',
            title: t('toolbar.documentOpen'),
            image: 'doc.text',
            imageColor: '#FFFFFF'
        });
    }

    standardActions.push({
        id: 'settings',
        title: t('settings.buttonLabel'),
        image: 'gearshape',
        imageColor: '#FFFFFF'
    });

    // ── Assemble final list: custom section first (if any), then standard ──
    // displayInline:true renders items inline with a divider separating sections.
    const actions: Array<MenuAction> = [
        ...(customActions.length > 0
            ? [ { id: 'custom-section', title: '', displayInline: true, subactions: customActions } ]
            : []),
        { id: 'standard-section', title: '', displayInline: true, subactions: standardActions }
    ];

    // ── Action handler ─────────────────────────────────────────────────────
    const handleAction = ({ nativeEvent }: { nativeEvent: { event: string } }) => {
        const { event } = nativeEvent;

        switch (event) {
        case 'carmode':
            navigate(screen.conference.carmode);
            break;
        case 'audioOnly':
            dispatch(toggleAudioOnly());
            break;
        case 'raiseHand':
            dispatch(raiseHand(!raisedHand));
            break;
        case 'security':
            navigate(screen.conference.security);
            break;
        case 'record':
            if (isRecording) {
                dispatch(openDialog('StopRecordingDialog', StopRecordingDialog));
            } else {
                navigate(screen.conference.recording);
            }
            break;
        case 'liveStream':
            if (isLiveStreaming) {
                dispatch(openDialog('StopLiveStreamDialog', StopLiveStreamDialog));
            } else {
                navigate(screen.conference.liveStream);
            }
            break;
        case 'salesforce':
            navigate(screen.conference.salesforce);
            break;
        case 'whiteboard':
            dispatch(setWhiteboardOpen(true));
            break;
        case 'sharedVideo':
            dispatch(toggleSharedVideo());
            break;
        case 'speakerStats':
            navigate(screen.conference.speakerStats);
            break;
        case 'breakoutRooms':
            navigate(screen.conference.breakoutRooms);
            break;
        case 'closedCaptions':
            navigate(screen.conference.subtitles);
            break;
        case 'sharedDocument':
            navigate(screen.conference.sharedDocument);
            break;
        case 'settings':
            navigate(screen.settings.main);
            break;
        default:
            // Custom overflow menu buttons
            if (event.startsWith('custom_')) {
                const key = event.slice('custom_'.length);
                const btn = overflowMenuButtons?.find(
                    (b: IToolboxNativeButton) => b.key === key
                );

                if (btn) {
                    dispatch(customButtonPressed(key, btn.text));
                }
            }
            break;
        }
    };

    return (
        <MenuView
            actions = { actions }
            onPressAction = { handleAction }
            shouldOpenOnLongPress = { false }>
            <View style = { styles.toolboxButtonIconContainer as ViewStyle }>
                <Icon
                    color = { BaseTheme.palette.icon04 }
                    size = { 24 }
                    src = { IconDotsHorizontal } />
            </View>
        </MenuView>
    );
};

export default OverflowMenuButton;
