// Previous: none
// Current: 0.0.0

import { createGlobalStyle } from 'styled-components';

// Base colors
const colors = {
  white: 'white',
  black: 'black',
  blue: 'hsl(204.25deg 100% 36.47%)',
  green: 'hsl(165deg 100% 34.51%)',
  red: 'hsl(22, 100%, 36%)',
  orange: 'hsl(36deg 73.28% 54.51%)',
  yellow: 'hsl(44.43deg 77.41% 53.14%)',
  purple: 'hsl(270, 38%, 59%)',
  gray: 'hsl(200deg 10.45% 60%)',
  gray30: 'hsl(200deg 10.45% 26.27%)',
  gray60: 'hsl(200deg 10.45% 60%)',
  gray98: 'hsl(0deg 0% 98%)',
};

// Global styles
const GlobalStyles = createGlobalStyle`
  :root {
    // Base colors
    --neko-blue: ${colors.blue};
    --neko-white: ${colors.white};
    --neko-black: ${colors.black};
    --neko-purple: ${colors.purple};
    --neko-orange: ${colors.orange};
    --neko-yellow: ${colors.yellow};
    --neko-green: ${colors.green};
    --neko-red: ${colors.red};
    --neko-gray: ${colors.gray};

    // Main color
    --neko-main-color: var(--neko-blue);

    // Variants
    --neko-success: var(--neko-blue);
    --neko-primary: var(--neko-main-color);
    --neko-secondary: #EBF3FF; // TODO: This needs to be updated to a proper color
    --neko-danger: var(--neko-red);

    // Base styles
    --neko-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --neko-font-size: 13px; 
    --neko-small-font-size: 12px; 
    --neko-h1-font-size: 23px;
    --neko-h2-font-size: 20px;
    --neko-h3-font-size: 18px;
    --neko-h4-font-size: 16px;
    --neko-h5-font-size: 14px;
    --neko-font-color: var(--neko-gray-30);

    // Gray shades
    --neko-gray-30: ${colors.gray30};
    --neko-gray-60: ${colors.gray60};
    --neko-gray-98: ${colors.gray98};
    --neko-wp-background-color: #f0f0f1;

    // Main color shades
    --neko-main-overlay-color: rgb(30 124 186 / 85%);
    --neko-main-color-10: hsl(206deg 100% 22.35%);
    --neko-main-color-50: hsl(206deg 61.04% 54.71%);
    --neko-main-color-80: hsl(206deg 55.93% 88.43%);
    --neko-main-color-98: hsl(200deg 100% 98.82%);

    // Neko UI
    --neko-background-color: var(--neko-wp-background-color);
    --neko-disabled-color: var(--neko-gray-60);
    --neko-main-color-alternative: var(--neko-main-color-10);
    --neko-main-color-disabled: var(--neko-main-color-50);
    --neko-input-background: var(--neko-main-color-98);
    --neko-input-border: var(--neko-main-color-80);
  }
`;

const useNekoColors = () => {
  return { colors };
};

const NekoUIProvider = ({ children }) => {
  return (
    <>
      <GlobalStyles key={`neko-ui-styles`} />
      {children}
    </>
  );
};

const NekoUI = ({ children }) => {
  return (
    <NekoUIProvider>
      {children}
    </NekoUIProvider>
  );
};

export default NekoUI;
export { useNekoColors };
