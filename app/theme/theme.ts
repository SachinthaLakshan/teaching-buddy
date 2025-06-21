import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/lib/typescript/types'; // Import Theme type

// Define custom colors, extending Paper's color types for type safety if needed
// For this example, we'll rely on Paper's existing color keys and add a few custom ones.
// If you add truly custom color names not in Paper's default theme structure,
// you'd need to augment the Theme['colors'] interface.

export const appTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200EE', // A vibrant purple
    // accent: '#03DAC6',   // MD3 uses 'secondary' and 'tertiary' more than 'accent'
    secondary: '#03DAC6', // Teal accent, can be used as secondary
    tertiary: '#018786',  // A darker teal, can be used as tertiary
    background: '#F6F6F6', // Light grey background
    surface: '#FFFFFF', // White surface for cards, dialogs
    text: '#000000', // Ensure text is defined, though DefaultTheme has it
    onPrimary: '#FFFFFF',
    onSecondary: '#000000', // Text on secondary color
    onTertiary: '#FFFFFF',
    onBackground: '#000000',
    onSurface: '#000000',
    error: '#B00020',
    // Custom semantic colors (optional, ensure your components know how to use them or augment Theme)
    success: '#4CAF50',
    warning: '#FFC107',
    // variants
    primaryContainer: '#EADDFF', // Light primary for containers
    secondaryContainer: '#CCF8F2', // Light secondary for containers
    tertiaryContainer: '#Bdedea',
    surfaceVariant: '#ECECEC', // Slightly different surface
    outline: '#79747E',
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
