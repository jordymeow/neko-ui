import { createGlobalStyle } from 'styled-components';

/* Brand palette — blue & green from the Meow cat logo.
   Blue is the primary; green is a precious accent (success/check/LED). */
const colors = {
  white: 'hsl(0 0% 100%)',
  black: 'hsl(0 0% 0%)',

  /* Primary — cat-logo royal blue. Everything blue-tinted in the UI
     derives from this: --neko-main-color, focus rings, hovers, title
     accents, and pills. Changing this value re-skins the whole app. */
  blue: 'hsl(217 80% 42%)',
  blue10: 'hsl(217 85% 22%)',
  blue50: 'hsl(217 75% 58%)',
  blue80: 'hsl(217 60% 88%)',
  blue95: 'hsl(217 80% 96%)',

  /* Accent — cat-logo green (eye) */
  green: 'hsl(155 75% 42%)',
  green90: 'hsl(155 60% 92%)',

  /* Supporting */
  cyan: 'hsl(188 85% 46%)',
  red: 'hsl(358 76% 54%)',
  red90: 'hsl(358 85% 96%)',
  orange: 'hsl(28 92% 52%)',
  yellow: 'hsl(45 92% 54%)',
  purple: 'hsl(262 72% 62%)',

  /* Slate-tinted neutrals — just cool enough to feel premium, still WP-admin friendly */
  gray30: 'hsl(220 18% 20%)',   /* ink text */
  gray40: 'hsl(220 12% 34%)',
  gray50: 'hsl(220 10% 48%)',   /* muted text */
  gray60: 'hsl(220 12% 62%)',
  gray70: 'hsl(220 14% 76%)',
  gray80: 'hsl(220 16% 86%)',   /* strong border */
  gray90: 'hsl(220 20% 92%)',   /* subtle border */
  gray95: 'hsl(220 24% 96%)',   /* muted surface */
  gray98: 'hsl(220 30% 98%)',   /* warm off-white */
};

/* Global styles */
const GlobalStyles = createGlobalStyle`
  :root {
    /* Base colors */
    --neko-blue: ${colors.blue};
    --neko-white: ${colors.white};
    --neko-black: ${colors.black};
    --neko-purple: ${colors.purple};
    --neko-orange: ${colors.orange};
    --neko-yellow: ${colors.yellow};
    --neko-green: ${colors.green};
    --neko-cyan: ${colors.cyan};
    --neko-red: ${colors.red};

    /* Gray scale */
    --neko-gray-30: ${colors.gray30};
    --neko-gray-40: ${colors.gray40};
    --neko-gray-50: ${colors.gray50};
    --neko-gray-60: ${colors.gray60};
    --neko-gray-70: ${colors.gray70};
    --neko-gray-80: ${colors.gray80};
    --neko-gray-90: ${colors.gray90};
    --neko-gray-95: ${colors.gray95};
    --neko-gray-98: ${colors.gray98};

    /* Main color (primary = cat blue) */
    --neko-main-color: var(--neko-blue);
    --neko-main-color-10: ${colors.blue10};
    --neko-main-color-50: ${colors.blue50};
    --neko-main-color-80: ${colors.blue80};
    --neko-main-color-95: ${colors.blue95};
    --neko-main-color-98: hsl(217 50% 99%);
    --neko-main-overlay-color: rgb(30 86 220 / 85%);

    /* Variants */
    --neko-success: var(--neko-green);
    --neko-primary: var(--neko-main-color);
    --neko-secondary: ${colors.blue95};
    --neko-danger: var(--neko-red);
    --neko-warning: var(--neko-orange);
    --neko-lighten-green: ${colors.green90};
    --neko-lighten-red: ${colors.red90};

    /* Accent (checkbox/switch confirmation = cat green) */
    --neko-accent-color: var(--neko-green);
    --neko-accent-color-90: ${colors.green90};

    /* Typography — WordPress admin system stack by default so plugins feel
       native inside wp-admin. Stories that want the Inter variable can
       override --neko-font-family locally. */
    --neko-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --neko-font-mono: 'JetBrains Mono', 'SF Mono', 'Menlo', monospace;
    --neko-font-size: 13px;
    --neko-small-font-size: 12px;
    --neko-h1-font-size: 24px;
    --neko-h2-font-size: 20px;
    --neko-h3-font-size: 17px;
    --neko-h4-font-size: 15px;
    --neko-h5-font-size: 14px;
    --neko-h6-font-size: 13px;
    --neko-font-color: var(--neko-gray-30);

    /* Motion tokens */
    --neko-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --neko-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --neko-duration-fast: 140ms;
    --neko-duration-base: 220ms;
    --neko-duration-slow: 360ms;

    /* Form control baseline — every input, select, button, checkbox, and the
       line-height on Settings titles reads from this token. Change it here,
       all controls re-align together. */
    --neko-control-height: 30px;
    --neko-control-height-small: 24px;
    --neko-control-height-large: 44px;

    /* Surface title — the "white title above a white card" spec that
       NekoBlock.primary and NekoTabs inversed share. Define once so they
       stay visually identical when placed side-by-side. */
    --neko-surface-title-font-size: 18px;
    --neko-surface-title-font-weight: 600;
    --neko-surface-title-line-height: 1.25;
    --neko-surface-title-letter-spacing: 0;
    --neko-surface-title-padding-bottom: 8px;
    --neko-surface-section-gap: 16px;

    /* Radii & Shadows — refined multi-layer shadows */
    --neko-radius-sm: 8px;
    --neko-radius-md: 12px;
    --neko-radius-lg: 16px;
    --neko-shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
    --neko-shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
    --neko-shadow-md: 0 6px 16px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.05);
    --neko-shadow-lg: 0 20px 40px rgba(15, 23, 42, 0.12), 0 6px 14px rgba(15, 23, 42, 0.07);
    --neko-focus-ring: 0 0 0 3px color-mix(in oklab, var(--neko-main-color) 24%, transparent);

    /* Neko UI */
    --neko-wp-background-color: #f0f0f1;
    --neko-background-color: var(--neko-wp-background-color);
    --neko-disabled-color: var(--neko-gray-60);
    --neko-main-color-alternative: var(--neko-main-color-10);
    --neko-main-color-disabled: var(--neko-main-color-50);
    --neko-input-background: var(--neko-white);
    --neko-input-border: var(--neko-gray-90);
  }

  /* Base reset/typography and focus treatments */
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  body {
    font-family: var(--neko-font-family);
    color: var(--neko-font-color);
    background-color: var(--neko-background-color);
  }
  :focus-visible { outline: none; box-shadow: var(--neko-focus-ring); }

  /* Brand-tinted text selection */
  ::selection {
    background: color-mix(in oklab, var(--neko-main-color) 24%, transparent);
    color: var(--neko-font-color);
  }

  /* Tabular nums helper — for tables, counters, metrics */
  .neko-numeric, .neko-tabular {
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum' 1;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
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
