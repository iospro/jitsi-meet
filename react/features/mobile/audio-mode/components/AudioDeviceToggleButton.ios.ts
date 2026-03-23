import { ActionSheetIOS, NativeModules } from 'react-native';
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

interface IProps extends AbstractButtonProps {

    /**
     * Available audio devices from Redux state.
     */
    _devices: Array<IRawDevice>;
}

/**
 * iOS-specific version of AudioDeviceToggleButton.
 * Shows a native ActionSheetIOS instead of a custom bottom sheet.
 */
class AudioDeviceToggleButton extends AbstractButton<IProps> {
    override accessibilityLabel = 'toolbar.accessibilityLabel.audioRoute';
    override icon = IconVolumeUp;
    override label = 'toolbar.accessibilityLabel.audioRoute';

    /**
     * Handles clicking / pressing the button.
     * Shows a native iOS action sheet to select an audio device.
     *
     * @private
     * @returns {void}
     */
    override _handleClick() {
        const { _devices: rawDevices, t } = this.props;

        // Trigger a device list refresh before showing the picker.
        AudioMode.updateDeviceList?.();

        const devices = (rawDevices ?? []).filter(d => DEVICE_TEXT_MAP[d.type]);

        const options = devices.map(device => {
            // iOS provides descriptive names for Bluetooth/Car — use them.
            if ((device.type === 'BLUETOOTH' || device.type === 'CAR') && device.name) {
                return device.name;
            }

            return t(DEVICE_TEXT_MAP[device.type]);
        });

        // Add a "Cancel" option at the end (iOS convention).
        const cancelButtonIndex = options.length;

        options.push(t('dialog.cancel'));

        ActionSheetIOS.showActionSheetWithOptions(
            { options, cancelButtonIndex },
            buttonIndex => {
                if (buttonIndex === cancelButtonIndex) {
                    return;
                }

                const device = devices[buttonIndex];

                if (device) {
                    AudioMode.setAudioDevice(device.uid || device.type);
                }
            }
        );
    }
}

function _mapStateToProps(state: IReduxState) {
    return {
        _devices: state['features/mobile/audio-mode'].devices
    };
}

export default translate(connect(_mapStateToProps)(AudioDeviceToggleButton));
