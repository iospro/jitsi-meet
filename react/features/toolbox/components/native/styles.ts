import { Platform } from 'react-native';

import ColorSchemeRegistry from '../../../base/color-scheme/ColorSchemeRegistry';
import BaseTheme from '../../../base/ui/components/BaseTheme.native';

const BUTTON_SIZE = 48;

// Smaller circular hangup button to keep it visually compact in the toolbar.
const HANGUP_BUTTON_SIZE = 40;

const _isIOS = Platform.OS === 'ios';

// Toolbox, toolbar:

/**
 * The style of toolbar buttons.
 */
const toolbarButton = {
    borderRadius: BaseTheme.shape.borderRadius,
    borderWidth: 0,
    flex: 0,
    flexDirection: 'row',
    height: BUTTON_SIZE,
    justifyContent: 'center',
    marginHorizontal: 6,
    marginVertical: 6,
    width: BUTTON_SIZE
};

/**
 * The icon style of the toolbar buttons.
 */
const toolbarButtonIcon = {
    alignSelf: 'center',
    color: BaseTheme.palette.icon04,
    fontSize: 24
};


/**
 * The icon style of toolbar buttons which display white icons.
 */
const whiteToolbarButtonIcon = {
    ...toolbarButtonIcon,
    color: BaseTheme.palette.icon01
};

/**
 * The style of reaction buttons.
 */
const reactionButton = {
    ...toolbarButton,
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginTop: 0,
    marginHorizontal: 0
};

const gifButton = {
    ...reactionButton,
    backgroundColor: '#000'
};

/**
 * The style of the emoji on the reaction buttons.
 */
const reactionEmoji = {
    fontSize: 20,
    color: BaseTheme.palette.icon01
};

const reactionMenu = {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BaseTheme.palette.ui01
};

/**
 * The Toolbox and toolbar related styles.
 */
const styles = {

    sheetGestureRecognizer: {
        alignItems: 'stretch',
        flexDirection: 'column'
    },

    /**
     * The style of the toolbar.
     * On iOS the background is transparent so the toolboxContainer provides
     * the visual surface (glass on iOS 26, semi-transparent on older iOS).
     */
    toolbox: {
        alignItems: 'center',
        backgroundColor: _isIOS ? 'transparent' : BaseTheme.palette.uiBackground,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    /**
     * The style of the root/top-level container of {@link Toolbox}.
     *
     * - iOS: semi-transparent capsule backdrop with safe-area-aware padding.
     * - Android: unchanged solid background.
     */
    toolboxContainer: {
        backgroundColor: _isIOS ? 'rgba(128, 128, 128, 0.5)' : BaseTheme.palette.uiBackground,
        borderRadius: _isIOS ? 28 : 0,
        flexDirection: 'column',
        maxWidth: 580,
        marginHorizontal: _isIOS ? BaseTheme.spacing[2] : 'auto',
        marginBottom: _isIOS ? BaseTheme.spacing[2] : 0,
        marginVertical: BaseTheme.spacing[0],
        paddingHorizontal: BaseTheme.spacing[2],
        width: _isIOS ? undefined : '100%'
    },

    toolboxButtonIconContainer: {
        alignItems: 'center',
        borderRadius: BaseTheme.shape.borderRadius,
        height: BaseTheme.spacing[7],
        justifyContent: 'center',
        width: BaseTheme.spacing[7]
    }
};

export default styles;

/**
 * Color schemed styles for the @{Toolbox} component.
 */
ColorSchemeRegistry.register('Toolbox', {
    /**
     * Styles for buttons in the toolbar.
     */
    buttonStyles: {
        iconStyle: toolbarButtonIcon,
        style: toolbarButton
    },

    buttonStylesBorderless: {
        iconStyle: whiteToolbarButtonIcon,
        style: {
            ...toolbarButton,
            backgroundColor: 'transparent'
        },
        underlayColor: 'transparent'
    },

    backgroundToggle: {
        backgroundColor: BaseTheme.palette.ui04
    },

    hangupMenuContainer: {
        marginHorizontal: BaseTheme.spacing[2],
        marginVertical: BaseTheme.spacing[2]
    },

    hangupButton: {
        flex: 1,
        marginHorizontal: BaseTheme.spacing[2],
        marginVertical: BaseTheme.spacing[2]
    },

    hangupButtonStyles: {
        iconStyle: whiteToolbarButtonIcon,
        style: {
            ...toolbarButton,
            backgroundColor: BaseTheme.palette.actionDanger,
            borderRadius: HANGUP_BUTTON_SIZE / 2,
            height: HANGUP_BUTTON_SIZE,
            width: HANGUP_BUTTON_SIZE
        },
        underlayColor: BaseTheme.palette.ui04
    },

    reactionDialog: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent'
    },

    overflowReactionMenu: {
        ...reactionMenu,
        padding: BaseTheme.spacing[3]
    },

    reactionMenu: {
        ...reactionMenu,
        paddingHorizontal: BaseTheme.spacing[3],
        borderRadius: 3,
        width: 360
    },

    reactionRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    reactionButton: {
        gifButton,
        style: reactionButton,
        underlayColor: BaseTheme.palette.ui04,
        emoji: reactionEmoji
    },

    emojiAnimation: {
        color: BaseTheme.palette.icon01,
        position: 'absolute',
        zIndex: 1001,
        elevation: 2,
        fontSize: 20,
        left: '50%',
        top: '100%'
    },

    /**
     * Styles for toggled buttons in the toolbar.
     */
    toggledButtonStyles: {
        iconStyle: whiteToolbarButtonIcon,
        style: {
            ...toolbarButton
        },
        underlayColor: 'transparent'
    }
});
