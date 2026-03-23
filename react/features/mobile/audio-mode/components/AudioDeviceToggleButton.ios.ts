import { MenuView } from '@react-native-menu/menu';
import React from 'react';
import { NativeModules } from 'react-native';
import { connect } from 'react-redux';

import { IReduxState } from '../../../app/types';
import { translate } from '../../../base/i18n/functions';
import { IconVolumeUp } from '../../../base/icons/svg';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';

import { IRawDevice } from './AudioRoutePickerDialog';

const { AudioMode } = NativeModules;

/**
 * Maps each device type to its i18n translation key.
 */
const DEVICE_TEXT_MAP: Record<string, string> = {
    BLUETOOTH: 'audioDevices.bluetooth',
    CAR: 'audioDevices.car',
    EARPIECE: 'audioDevices.phone',
    HEADPHONES: 'audioDevices.headphones',
    SPEAKER: 'audioDevices.speaker'
};

/**
 * SF Symbols for each device type (iOS 13+).
 */
const DEVICE_ICON_MAP: Record<string, string | undefined> = {
    BLUETOOTH: 'wave.3.right',
    CAR: 'car',
    EARPIECE: 'phone',
    HEADPHONES: 'headphones',
    SPEAKER: 'speaker.wave.3'
};

interface IProps extends AbstractButtonProps {

    /**
     * Available audio devices from Redux state.
     */
    _devices: Array<IRawDevice>;
}

/**
 * iOS-specific version of AudioDeviceToggleButton.
 * Shows a native UIMenu instead of an ActionSheet or bottom sheet.
 * The currently selected device is highlighted with a native system checkmark.
 */
class AudioDeviceToggleButton extends AbstractButton<IProps> {
    override accessibilityLabel = 'toolbar.accessibilityLabel.audioRoute';
    override icon = IconVolumeUp;
    override label = 'toolbar.accessibilityLabel.audioRoute';

    /**
     * Renders the button wrapped in a native UIMenu.
     * Uses React.createElement to avoid JSX syntax in a .ts file.
     *
     * @returns {React.ReactNode}
     */
    override render() {
        const { _devices: rawDevices, t } = this.props;

        const devices = (rawDevices ?? []).filter(d => DEVICE_TEXT_MAP[d.type]);

        const actions = devices.map(device => {
            let title: string;

            // iOS provides descriptive names for Bluetooth/Car — use them.
            if ((device.type === 'BLUETOOTH' || device.type === 'CAR') && device.name) {
                title = device.name;
            } else {
                title = t(DEVICE_TEXT_MAP[device.type]);
            }

            return {
                id: device.uid || device.type,
                title,
                image: DEVICE_ICON_MAP[device.type],
                imageColor: '#FFFFFF',

                // `state: 'on'` renders the native system checkmark next to the item.
                state: device.selected ? 'on' as const : 'off' as const
            };
        });

        const handlePressAction = (
                { nativeEvent }: { nativeEvent: { event: string } }
        ) => {
            const device = devices.find(d => (d.uid || d.type) === nativeEvent.event);

            if (device) {
                AudioMode.setAudioDevice(device.uid || device.type);
            }
        };

        // Wrap the AbstractButton UI in MenuView.
        // shouldOpenOnLongPress=false means the menu opens on a single tap;
        // the inner button's onPress is not invoked by MenuView.
        return React.createElement(
            MenuView,
            {
                actions,
                onPressAction: handlePressAction,
                shouldOpenOnLongPress: false
            },
            super.render()
        );
    }
}

function _mapStateToProps(state: IReduxState) {
    return {
        _devices: state['features/mobile/audio-mode'].devices
    };
}

export default translate(connect(_mapStateToProps)(AudioDeviceToggleButton));
