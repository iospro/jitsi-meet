import { withStyles } from '@mui/styles';
import React from 'react';
import { WithTranslation } from 'react-i18next';

import AbstractDialogTab, {
    IProps as AbstractDialogTabProps
} from '../../../base/dialog/components/web/AbstractDialogTab';
import { translate } from '../../../base/i18n/functions';
import VirtualBackgrounds from '../../../virtual-background/components/VirtualBackgrounds';

/**
 * The type of the React {@code Component} props of {@link VirtualBackgroundTab}.
 */
export interface IProps extends AbstractDialogTabProps, WithTranslation {

    /**
     * Returns the jitsi track that will have background effect applied.
     */
    _jitsiTrack: Object;

    /**
     * CSS classes object.
     */
    classes: any;

    /**
     * Virtual background options.
     */
    options: any;

    /**
     * The selected thumbnail identifier.
     */
    selectedThumbnail: string;
}

const styles = () => {
    return {
        container: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column' as const
        }
    };
};

/**
 * React {@code Component} for modifying language and moderator settings.
 *
 * @augments Component
 */
class VirtualBackgroundTab extends AbstractDialogTab<IProps, any> {
    /**
     * Initializes a new {@code ModeratorTab} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps) {
        super(props);

        // Bind event handler so it is only bound once for every instance.
        this._onOptionsChanged = this._onOptionsChanged.bind(this);
    }

    /**
     * Callback invoked to select if follow-me mode
     * should be activated.
     *
     * @param {Object} options - The new background options.
     *
     * @returns {void}
     */
    _onOptionsChanged(options: any) {
        super._onChange({ options });
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            classes,
            options,
            selectedThumbnail,
            _jitsiTrack
        } = this.props;

        return (
            <div
                className = { classes.container }
                id = 'virtual-background-dialog'
                key = 'virtual-background'>
                <VirtualBackgrounds
                    _jitsiTrack = { _jitsiTrack }
                    onOptionsChange = { this._onOptionsChanged }
                    options = { options }
                    selectedThumbnail = { selectedThumbnail } />
            </div>
        );
    }
}

export default withStyles(styles)(translate(VirtualBackgroundTab));
