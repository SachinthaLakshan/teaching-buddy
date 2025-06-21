import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/lib/typescript/types'; // Import Theme type

// Define custom colors, extending Paper's color types for type safety if needed
// For this example, we'll rely on Paper's existing color keys and add a few custom ones.
// If you add truly custom color names not in Paper's default theme structure,
// you'd need to augment the Theme['colors'] interface.

export const appTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,     // Start with defaults
    primary: '#FFA07A',          // Soft Pink
    onPrimary: '#4A4A4A',        // Deep Taupe (good contrast on soft pink)
    primaryContainer: '#F9E2E7', // Pale Rose (using Highlight for primary container)
    onPrimaryContainer: '#4A4A4A',// Deep Taupe

    secondary: '#D6A4A4',        // Dusty Rose (Accent)
    onSecondary: '#FFFFFF',       // White (good contrast on dusty rose)
    secondaryContainer: '#F5E3E3',// Lighter Dusty Rose
    onSecondaryContainer: '#4A4A4A',// Deep Taupe

    tertiary: '#F9E2E7',         // Pale Rose (Highlight, also using for tertiary)
    onTertiary: '#4A4A4A',       // Deep Taupe
    tertiaryContainer: '#FFF6F8', // Very Pale Rose/Blush
    onTertiaryContainer: '#4A4A4A',// Deep Taupe

    background: '#FFF1F0',       // Blush White
    onBackground: '#4A4A4A',     // Deep Taupe

    surface: '#FFF7F6',          // Slightly warmer white for surfaces (cards, dialogs)
    onSurface: '#4A4A4A',        // Deep Taupe
    surfaceVariant: '#F9E2E7',   // Pale Rose (can be used for variants)
    onSurfaceVariant: '#4A4A4A', // Deep Taupe

    outline: '#D6A4A4',          // Dusty Rose (using Accent for outlines for a soft look)
    outlineVariant: '#EBC7C7',   // Lighter Dusty Rose

    error: '#B00020',            // Standard error red
    onError: '#FFFFFF',
    errorContainer: '#F9DEDC',   // Light red for error container background
    onErrorContainer: '#410E0B', // Dark red for text on error container

    text: '#4A4A4A',             // Default text color (Deep Taupe)

    // MD3 elevation colors can be kept as default or customized if needed
    // elevation: {
    //   ...DefaultTheme.colors.elevation,
    //   level1: '#FFF7F6', // Example: matching surface
    //   level2: '#F9E2E7', // Example: matching highlight/surfaceVariant
    //   level3: '#F5D9DE', // Example: slightly darker
    // },

    // Custom semantic colors (optional)
    success: '#6B8E23', // Olive Drab (more muted green)
    warning: '#FFA500', // Orange (standard warning)
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
