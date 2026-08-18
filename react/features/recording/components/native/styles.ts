import { createStyleSheet } from '../../../base/styles/functions.native';
import BaseTheme from '../../../base/ui/components/BaseTheme';

// Must match LABEL_SIZE from base/label/components/native/styles.ts
const INDICATOR_SIZE = 28;

/**
 * The styles of the React {@code Components} of the feature recording.
 */
export default createStyleSheet({

    /**
     * Style for the recording indicator.
     * Plain object (not StyleSheet) so combineStyles properly overrides
     * labelContainer — gives a perfect circle with no dark backdrop.
     */
    indicatorStyle: {
        width: INDICATOR_SIZE,
        height: INDICATOR_SIZE,
        marginRight: 8,
        marginLeft: 0,
        marginBottom: 0,
        backgroundColor: BaseTheme.palette.iconError,
        borderRadius: INDICATOR_SIZE / 2,
        paddingHorizontal: 0,
        alignItems: 'center' as const,
        justifyContent: 'center' as const
    },

    /**
     * Style for the transcription indicator.
     */
    transcribingIndicatorStyle: {
        width: INDICATOR_SIZE,
        height: INDICATOR_SIZE,
        marginRight: 8,
        marginLeft: 0,
        marginBottom: 0,
        backgroundColor: BaseTheme.palette.transcriptionIndicator,
        borderRadius: INDICATOR_SIZE / 2,
        paddingHorizontal: 0,
        alignItems: 'center' as const,
        justifyContent: 'center' as const
    }
});
