import React, { useCallback } from 'react';
import { TouchableHighlight, View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { IReduxState } from '../../../app/types';
import ColorSchemeRegistry from '../../../base/color-scheme/ColorSchemeRegistry';
import { openSheet } from '../../../base/dialog/actions';
import { IconHangup } from '../../../base/icons/svg';
import Icon from '../../../base/icons/components/Icon';

import HangupMenu from './HangupMenu';

/**
 * Button for showing the hangup menu.
 *
 * @returns {JSX.Element} - The hangup menu button.
 */
const HangupMenuButton = (): JSX.Element => {
    const dispatch = useDispatch();
    const { hangupButtonStyles } = useSelector(
        (state: IReduxState) => ColorSchemeRegistry.get(state, 'Toolbox')
    );

    const onSelect = useCallback(() => {
        dispatch(openSheet(HangupMenu));
    }, [ dispatch ]);

    return (
        <TouchableHighlight
            accessibilityLabel = 'toolbar.accessibilityLabel.hangup'
            onPress = { onSelect }
            style = { hangupButtonStyles?.style as ViewStyle }
            underlayColor = { hangupButtonStyles?.underlayColor }>
            <View style = { hangupButtonStyles?.iconBackground as ViewStyle }>
                <Icon
                    color = { hangupButtonStyles?.iconStyle?.color }
                    size = { hangupButtonStyles?.iconStyle?.fontSize }
                    src = { IconHangup } />
            </View>
        </TouchableHighlight>
    );
};

export default HangupMenuButton;
