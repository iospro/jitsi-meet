import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IReduxState } from '../../../app/types';
import ColorSchemeRegistry from '../../../base/color-scheme/ColorSchemeRegistry';
import { openSheet } from '../../../base/dialog/actions';
import { IconHangup } from '../../../base/icons/svg';
import IconButton from '../../../base/ui/components/native/IconButton';
import { BUTTON_TYPES } from '../../../base/ui/constants.native';

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

    const iconSize = hangupButtonStyles?.iconStyle?.fontSize ?? 24;

    return (
        <IconButton
            accessibilityLabel = 'toolbar.accessibilityLabel.hangup'
            onPress = { onSelect }
            size = { iconSize }
            src = { IconHangup }
            style = { hangupButtonStyles?.style }
            type = { BUTTON_TYPES.DESTRUCTIVE } />
    );
};

export default HangupMenuButton;
