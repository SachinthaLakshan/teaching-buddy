import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/lib/typescript/types'; // Import Theme type

// Define custom colors, extending Paper's color types for type safety if needed
// For this example, we'll rely on Paper's existing color keys and add a few custom ones.
// If you add truly custom color names not in Paper's default theme structure,
// you'd need to augment the Theme['colors'] interface.

export const appTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, // Start with defaults to ensure all keys are present
    primary: '#5D9C9C',          // Muted Teal
    onPrimary: '#FFFFFF',
    primaryContainer: '#D4E9E9', // Light version of primary
    onPrimaryContainer: '#2F4F4F', // Dark Slate Gray - for text on primaryContainer

    secondary: '#8CBDB9',        // Lighter, softer Teal/Blue-Green
    onSecondary: '#FFFFFF',     // White text on secondary
    secondaryContainer: '#DAE8E7',// Light version of secondary
    onSecondaryContainer: '#2F4F4F', // Dark Slate Gray - for text on secondaryContainer

    tertiary: '#B2D8D8',         // Very light Teal/Blue
    onTertiary: '#343434',      // Dark text on tertiary
    tertiaryContainer: '#E0F0F0', // Even lighter for tertiary container
    onTertiaryContainer: '#2F4F4F',// Dark Slate Gray

    background: '#F7F7F7',       // Very light warm gray / off-white
    onBackground: '#343434',     // Dark gray text on background

    surface: '#FFFFFF',          // White for cards, dialogs etc.
    onSurface: '#343434',        // Dark gray text on surface
    surfaceVariant: '#EEF2F2',   // Slightly off-white/light gray variant for surfaces
    onSurfaceVariant: '#4A4A4A', // Slightly lighter dark gray for text on surfaceVariant

    outline: '#A0A0A0',          // Soft gray for outlines
    outlineVariant: '#C0C0C0',   // Lighter gray for less prominent outlines

    error: '#B00020',            // Standard error, can be muted if desired e.g., #D32F2F
    onError: '#FFFFFF',
    errorContainer: '#F9DEDC',
    onErrorContainer: '#410E0B',

    // Custom semantic colors (optional, ensure your components know how to use them or augment Theme)
    success: '#4CAF50', // Keep standard green for success
    warning: '#FFC107', // Keep standard amber for warning

    text: '#343434', // Default text color, ensure this is set if not using onBackground/onSurface explicitly everywhere

    // Specific MD3 roles if needed, many are derived or alias to above.
    // elevation: DefaultTheme.colors.elevation, // Keep default elevation colors or customize
  },
  fonts: { // Casting to any to avoid deep type mismatches if not perfectly aligning with MD3 types.
            // For precise font theming, ensure all MD3 font variants are correctly typed.
    ...DefaultTheme.fonts as any,
    // Example: Overriding a specific font variant if needed
    // bodyLarge: {
    //   ...DefaultTheme.fonts.bodyLarge,
    //   fontFamily: 'YourCustomFont-Regular', // if you load custom fonts
    // },
  },
  roundness: 8, // Global roundness for components like Button, Card
};

// If you are using custom fonts and want to integrate them more deeply
// into Paper's font configuration (which is quite detailed for MD3),
// you might need a more elaborate setup like:
/*
const fontConfig = {
  customVariant: {
    fontFamily: 'System', // Default
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  // ... other variants based on MD3 types
};

export const appThemeWithCustomFonts: Theme = {
  ...appTheme,
  fonts: configureFonts({config: fontConfig, isV3: true}), // configureFonts is from react-native-paper
};
*/

// Note: Expo's default template might include a constants/Colors.ts.
// It's advisable to consolidate styling decisions: either use that for base colors
// fed into this Paper theme, or primarily rely on this Paper theme throughout the app.
// For this project, we'll primarily use this Paper theme.
