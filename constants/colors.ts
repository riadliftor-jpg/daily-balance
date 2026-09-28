/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#17343B',
    tint: '#0D817A',
    background: '#F5F8F5',
    foreground: '#17343B',
    card: '#FFFFFF',
    cardForeground: '#17343B',
    primary: '#0D817A',
    primaryForeground: '#FFFFFF',
    secondary: '#E8F2EF',
    secondaryForeground: '#24524F',
    muted: '#EEF3F0',
    mutedForeground: '#6D7E7B',
    accent: '#F7C98B',
    accentForeground: '#63421F',
    destructive: '#D95C5C',
    destructiveForeground: '#FFFFFF',
    border: '#DCE8E2',
    input: '#D4E2DC',
    mint: '#D8EEE7',
    mintStrong: '#A8D9C8',
    navy: '#17343B',
    coral: '#EE9275',
    lavender: '#E9E1F5',
    lavenderStrong: '#8E77B7',
    amber: '#F7C98B',
    success: '#2C9A77',
  },
  radius: 22,
};

export default colors;
