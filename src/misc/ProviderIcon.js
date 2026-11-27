import React from 'react';
import PropTypes from 'prop-types';

/**
 * NekoProviderIcon — a small branded icon for AI providers.
 *
 * Each provider maps to a 1-letter monogram with the provider's brand colour.
 * Not a trademark-accurate logo — just a recognisable stand-in that reads
 * cleanly in a row of providers (Functions help text, Tools help text, etc.).
 *
 *   <NekoProviderIcon provider="openai" />
 *   <NekoProviderIcon provider="anthropic" size={18} />
 */

const PROVIDERS = {
  openai:     { label: 'O', color: '#10a37f' }, // green
  anthropic:  { label: 'A', color: '#cc785c' }, // warm orange
  google:     { label: 'G', color: '#4285f4' }, // blue
  gemini:     { label: 'G', color: '#4285f4' },
  azure:      { label: 'Z', color: '#0078d4' }, // azure blue
  mistral:    { label: 'M', color: '#ff7000' },
  openrouter: { label: 'R', color: '#6b7280' },
  ollama:     { label: 'L', color: '#111827' },
  claude:     { label: 'A', color: '#cc785c' },
  perplexity: { label: 'P', color: '#1fb8c4' },
};

const NekoProviderIcon = ({ provider, size = 16, style, title }) => {
  const def = PROVIDERS[provider?.toLowerCase()] || { label: '?', color: 'var(--neko-gray-60)' };
  return (
    <span
      title={title || provider}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, borderRadius: '50%',
        background: def.color, color: 'white',
        fontSize: Math.round(size * 0.6), fontWeight: 700,
        fontFamily: 'var(--neko-font-family)',
        lineHeight: 1, verticalAlign: 'middle',
        ...style,
      }}
    >{def.label}</span>
  );
};

NekoProviderIcon.propTypes = {
  provider: PropTypes.oneOf(Object.keys(PROVIDERS)),
  size: PropTypes.number,
  title: PropTypes.string,
  style: PropTypes.object,
};

const NekoProviderIconRow = ({ providers = ['openai', 'anthropic', 'google'], size = 16, gap = 4, style }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap, ...style }}>
    {providers.map((p, i) => <NekoProviderIcon key={i} provider={p} size={size} />)}
  </span>
);
NekoProviderIconRow.propTypes = {
  providers: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.number,
  gap: PropTypes.number,
  style: PropTypes.object,
};

/**
 * getNekoProviderBrand — returns { label, color } for a given provider id.
 *
 * Useful when a consumer needs the brand colour beyond the small monogram
 * icon (for card accent strips, inline dots, chips, etc.). Returns a neutral
 * fallback (? / grey) when the provider id isn't recognised — same as
 * NekoProviderIcon's rendering.
 *
 *   const { color, label } = getNekoProviderBrand('anthropic');
 */
const getNekoProviderBrand = (provider) => {
  return PROVIDERS[provider?.toLowerCase()] || { label: '?', color: 'var(--neko-gray-60)' };
};

/** Known provider ids (lowercase). */
const NEKO_PROVIDERS = Object.keys(PROVIDERS);

export {
  NekoProviderIcon,
  NekoProviderIconRow,
  getNekoProviderBrand,
  NEKO_PROVIDERS,
};
