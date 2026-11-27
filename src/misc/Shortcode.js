import React, { useState } from 'react';
import PropTypes from 'prop-types';

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  flex: '1 1 auto',
};

const shortcodeStyleBase = {
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  color: '#64748b',
  margin: 0,
  fontSize: 13,
  fontWeight: 500,
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
  overflow: 'hidden',
  flex: '1 1 auto',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.2s ease',
  letterSpacing: '0',
};

const shortcodeStyleSingle = {
  ...shortcodeStyleBase,
  display: 'flex',
  alignItems: 'center',
  height: 36,
  padding: '0 15px 0 35px',
  whiteSpace: 'pre',
  textOverflow: 'ellipsis',
};

const shortcodeStyleMulti = {
  ...shortcodeStyleBase,
  display: 'block',
  minHeight: 36,
  padding: '8px 15px 8px 35px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  lineHeight: 1.45,
  /* Slight text indent on wrapped lines so they don't sit under the copy icon. */
  textIndent: 0,
};

const copyButtonStyle = {
  position: 'absolute',
  left: 5,
  top: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  background: 'transparent',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  color: '#94a3b8',
  transition: 'all 0.15s ease',
  zIndex: 1,
};

const CopyIcon = ({ copied }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transition: 'all 0.15s ease' }}
  >
    {copied ? (
      <polyline points="20 6 9 17 4 12" />
    ) : (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    )}
  </svg>
);

function buildShortcodeString(prefix, params, multiline = false) {
  const entries = Object.entries(params);
  if (!entries.length) return `[${prefix}]`;
  const parts = entries.map(([key, value]) => `${key}="${value}"`);
  if (multiline) {
    return `[${prefix}\n  ${parts.join('\n  ')}\n]`;
  }
  return `[${prefix} ${parts.join(' ')}]`;
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    return true;
  } catch {
    return false;
  } finally {
    document.body.removeChild(textArea);
  }
}

function highlightQuotes(shortcode, color) {
  const parts = shortcode.split(/(".*?")/);

  return parts.map((part, idx) => {
    if (/^".*"$/.test(part)) {
      return (
        <span key={idx} style={{ color: `var(--neko-${color})`, fontWeight: 600 }}>
          {part}
        </span>
      );
    }

    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

const NekoShortcode = (props) => {
  const {
    prefix = 'code-engine',
    name = 'shortcode',
    params = { id: 1 },
    color = 'green',
    multiline = false,
  } = props;

  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const rawShortcode = buildShortcodeString(prefix, params, multiline);
  const copyPayload = buildShortcodeString(prefix, params, false);

  const onClickCopy = async (e) => {
    e.stopPropagation();
    
    let success = false;
    
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(copyPayload);
        success = true;
      } catch {
        success = fallbackCopyToClipboard(copyPayload);
      }
    } else {
      success = fallbackCopyToClipboard(copyPayload);
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const highlightedShortcode = highlightQuotes(rawShortcode, color);

  return (
    <div
      className="neko-shortcode"
      style={containerStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onClickCopy}
        style={{
          ...copyButtonStyle,
          background: hovered ? '#f1f5f9' : 'transparent',
          color: copied ? '#22c55e' : hovered ? '#475569' : '#94a3b8',
        }}
        title={copied ? `Copied ${name}!` : `Copy ${name}`}
        type="button"
      >
        <CopyIcon copied={copied} />
      </button>

      <pre
        style={{
          ...(multiline ? shortcodeStyleMulti : shortcodeStyleSingle),
          borderColor: hovered ? '#cbd5e1' : '#e2e8f0',
          background: hovered
            ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        }}
      >
        {highlightedShortcode}
      </pre>
      
    </div>
  );
};

NekoShortcode.propTypes = {
  prefix: PropTypes.string,
  name: PropTypes.string,
  params: PropTypes.object,
  color: PropTypes.string,
  multiline: PropTypes.bool,
};

export { NekoShortcode };