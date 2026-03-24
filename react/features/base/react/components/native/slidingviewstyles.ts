import { StyleSheet } from 'react-native';

import { OVERLAY_Z_INDEX } from '../../constants';

export default {
    /**
     * The topmost container of the side bar.
     */
    sliderViewContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: OVERLAY_Z_INDEX
    },

    /**
     * The container of the actual content of the side menu.
     */
    sliderViewContent: {
        position: 'absolute'
    },

    /**
     * The tap-to-dismiss area behind the bottom sheet.
     * Background is transparent — the sheet panel provides its own visual separation.
     */
    sliderViewShadow: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent'
    }
};
