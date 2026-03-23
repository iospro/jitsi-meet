import BaseTheme from '../../../base/ui/components/BaseTheme.native';

const contentColumn = {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: BaseTheme.spacing[2]
};

const notification = {
    backgroundColor: 'rgba(17, 17, 17, 0.8)',
    borderRadius: 26,
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: BaseTheme.spacing[1],
    maxWidth: 416,
    minHeight: 52,
    overflow: 'hidden',
    width: '100%'
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

    contentContainer: {
        paddingHorizontal: BaseTheme.spacing[2]
    },

    contentText: {
        color: '#FFFFFF',
        paddingLeft: BaseTheme.spacing[4],
        paddingTop: BaseTheme.spacing[1]
    },

    contentTextDescription: {
        color: '#FFFFFF',
        paddingLeft: BaseTheme.spacing[4],
        paddingTop: BaseTheme.spacing[2]
    },

    contentTextTitleDescription: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        paddingLeft: BaseTheme.spacing[4],
        paddingTop: BaseTheme.spacing[2]
    },

    contentTextTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        paddingLeft: BaseTheme.spacing[4],
        paddingTop: BaseTheme.spacing[3]
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
        ...notification,
        paddingBottom: BaseTheme.spacing[2]
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
        left: BaseTheme.spacing[2],
        position: 'absolute',
        top: 0
    },

    btn: {
        paddingLeft: BaseTheme.spacing[3]
    },

    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: BaseTheme.spacing[3],
        paddingTop: BaseTheme.spacing[1]
    },

    withToolbox: {
        alignItems: 'center',
        bottom: 64,
        position: 'absolute',
        width: '100%'
    },

    withToolboxTileView: {
        alignItems: 'center',
        bottom: 64,
        position: 'absolute',
        width: '100%'
    },

    withoutToolbox: {
        alignItems: 'center',
        bottom: 0,
        position: 'absolute',
        width: '100%'
    },

    withoutToolboxTileView: {
        alignItems: 'center',
        bottom: 0,
        position: 'absolute',
        width: '100%'
    }
};
