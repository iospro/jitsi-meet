import BaseTheme from '../../../base/ui/components/BaseTheme.native';

const contentColumn = {
    flex: 1,
    flexDirection: 'column',
    marginLeft: BaseTheme.spacing[3],
    marginRight: BaseTheme.spacing[2]
};

const notification = {
    backgroundColor: 'rgba(32, 32, 32, 0.95)',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 29,
    display: 'flex',
    flexDirection: 'row',
    marginVertical: BaseTheme.spacing[1],
    minHeight: 52,
    overflow: 'hidden',
    paddingLeft: 20,
    paddingRight: 0,
    paddingVertical: 4
};

/**
 * The styles of the React {@code Components} of the feature notifications.
 */
export default {

    /**
     * The content (left) column of the notification.
     */
    interactiveContentColumn: {
        ...contentColumn,
        justifyContent: 'center'
    },

    contentColumn: {
        ...contentColumn,
        justifyContent: 'center'
    },

    /**
     * Test style of the notification.
     */

    contentContainer: {},

    contentText: {
        color: '#FFFFFF',
        paddingTop: BaseTheme.spacing[1]
    },

    contentTextDescription: {
        color: '#FFFFFF'
    },

    contentTextTitleDescription: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },

    contentTextTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },

    /**
     * Dismiss icon style.
     */
    dismissIcon: {
        color: '#FFFFFF',
        fontSize: 20
    },

    notification: {
        ...notification
    },

    notificationWithDescription: {
        ...notification
    },

    /**
     * Wrapper for the message.
     */
    notificationContent: {
        alignItems: 'center',
        flexDirection: 'row'
    },

    participantName: {
        color: '#FFFFFF',
        overflow: 'hidden'
    },

    iconContainer: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        left: BaseTheme.spacing[3],
        position: 'absolute',
        top: 0
    },

    btn: {
        paddingLeft: BaseTheme.spacing[3]
    },

    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: BaseTheme.spacing[1]
    },

    withToolbox: {
        alignItems: 'center',
        position: 'absolute'
    },

    withToolboxTileView: {
        alignItems: 'center',
        position: 'absolute'
    },

    withoutToolbox: {
        alignItems: 'center',
        position: 'absolute'
    },

    withoutToolboxTileView: {
        alignItems: 'center',
        position: 'absolute'
    }
};
