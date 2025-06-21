import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200EE', // A vibrant purple
    accent: '#03DAC6',   // A teal accent
    background: '#F6F6F6', // Light grey background
    surface: '#FFFFFF', // White surface for cards, dialogs
    text: '#000000',
    placeholder: '#A0A0A0',
    error: '#B00020',
    // Custom colors
    primaryVariant: '#3700B3',
    secondary: '#018786', // A darker teal
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#000000',
    onSurface: '#000000',
    disabled: 'rgba(0, 0, 0, 0.26)',
    // You can add more custom colors here
    success: '#4CAF50',
    warning: '#FFC107',
  },
  fonts: {
    ...DefaultTheme.fonts,
    // You can customize fonts here if needed, e.g.:
    // regular: {
    //   fontFamily: 'System', // Replace with your custom font if you add one
    //   fontWeight: 'normal',
    // },
    // medium: {
    //   fontFamily: 'System',
    //   fontWeight: '500', // react-native-paper uses '500' for medium
    // },
    // light: {
    //   fontFamily: 'System',
    //   fontWeight: 'light',
    // },
    // thin: {
    //   fontFamily: 'System',
    //   fontWeight: '100', // react-native-paper uses '100' for thin
    // },
  },
  roundness: 8, // Adjust global roundness for components like Button, Card
};

// Example of how to configure fonts if you were using custom fonts
// const configureFonts = (fontConfig) => {
//   const newFontConfig = { ...fontConfig };
//   // Iterate over font variants and update fontFamily
//   // This is a simplified example. MD3 types have more structure.
//   Object.keys(newFontConfig).forEach(key => {
//     if (newFontConfig[key] && typeof newFontConfig[key] === 'object' && newFontConfig[key].fontFamily) {
//       newFontConfig[key].fontFamily = 'YourCustomFont-Regular'; // Replace with actual font name
//     }
//   });
//   return newFontConfig;
// };

// export const themeWithCustomFonts = {
//   ...theme,
//   fonts: configureFonts(DefaultTheme.fonts),
// };
