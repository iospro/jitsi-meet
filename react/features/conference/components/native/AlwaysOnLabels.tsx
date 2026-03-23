import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { JitsiRecordingConstants } from '../../../base/lib-jitsi-meet';
import { showNotification } from '../../../notifications/actions';
import { NOTIFICATION_TIMEOUT_TYPE } from '../../../notifications/constants';
import { openHighlightDialog } from '../../../recording/actions.native';
import HighlightButton from '../../../recording/components/Recording/native/HighlightButton';
import RecordingLabel from '../../../recording/components/native/RecordingLabel';
import { isLiveStreamingRunning } from '../../../recording/functions';
import { isTranscribing } from '../../../transcribing/functions';
import VisitorsCountLabel from '../../../visitors/components/native/VisitorsCountLabel';

import RaisedHandsCountLabel from './RaisedHandsCountLabel';
import {
    LABEL_ID_RAISED_HANDS_COUNT,
    LABEL_ID_VISITORS_COUNT,
    LabelHitSlop
} from './constants';

interface IProps {

    /**
     * Creates a function to be invoked when the onPress of the touchables are
     * triggered.
     */
    createOnPress: Function;
}

const AlwaysOnLabels = ({ createOnPress }: IProps) => {
    const dispatch = useDispatch();
    const isStreaming = useSelector(isLiveStreamingRunning);
    const isTranscribingActive = useSelector(isTranscribing);
    const openHighlightDialogCallback = useCallback(() =>
        dispatch(openHighlightDialog()), [ dispatch ]);

    // Show a bottom notification instead of the top expanded-label banner.
    const onRecordingLabelPress = useCallback(() => {
        dispatch(showNotification(
            isTranscribingActive
                ? {
                    titleKey: 'recording.expandedOn',
                    descriptionKey: 'transcribing.expandedLabel',
                    uid: 'recording-status-info'
                }
                : {
                    descriptionKey: 'recording.expandedOn',
                    uid: 'recording-status-info'
                },
            NOTIFICATION_TIMEOUT_TYPE.MEDIUM
        ));
    }, [ dispatch, isTranscribingActive ]);

    const onStreamingLabelPress = useCallback(() => {
        dispatch(showNotification(
            {
                descriptionKey: 'liveStreaming.expandedOn',
                uid: 'streaming-status-info'
            },
            NOTIFICATION_TIMEOUT_TYPE.MEDIUM
        ));
    }, [ dispatch ]);

    return (<>
        <TouchableOpacity
            hitSlop = { LabelHitSlop }
            onPress = { onRecordingLabelPress } >
            <RecordingLabel mode = { JitsiRecordingConstants.mode.FILE } />
        </TouchableOpacity>
        {
            isStreaming
            && <TouchableOpacity
                hitSlop = { LabelHitSlop }
                onPress = { onStreamingLabelPress } >
                <RecordingLabel mode = { JitsiRecordingConstants.mode.STREAM } />
            </TouchableOpacity>
        }
        <TouchableOpacity
            hitSlop = { LabelHitSlop }
            onPress = { openHighlightDialogCallback }>
            <HighlightButton />
        </TouchableOpacity>
        <TouchableOpacity
            hitSlop = { LabelHitSlop }
            onPress = { createOnPress(LABEL_ID_RAISED_HANDS_COUNT) } >
            <RaisedHandsCountLabel />
        </TouchableOpacity>
        <TouchableOpacity
            hitSlop = { LabelHitSlop }
            onPress = { createOnPress(LABEL_ID_VISITORS_COUNT) } >
            <VisitorsCountLabel />
        </TouchableOpacity>
    </>);
};

export default AlwaysOnLabels;
