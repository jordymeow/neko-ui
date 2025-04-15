// Previous: none
// Current: 0.0.0

const { useState } = wp.element;
import React from 'react';
import PropTypes from 'prop-types';
import { NekoSpacer } from '../layout/Spacer';

const shortcodeStyle = {
  display: 'flex',
  alignItems: 'center',
  background: '#f8fcff',
  height: 26,
  color: '#779bb8',
  margin: 0,
  padding: '0px 10px',
  fontSize: 13,
  textAlign: 'center',
  border: '2px solid rgb(210 228 243)',
  borderRadius: 8,
  fontFamily: 'system-ui',
  cursor: 'pointer',
  whiteSpace: 'pre',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flex: '1 1 auto',
};

function buildShortcodeString(prefix, params) {
  const paramStr = Object.entries(params)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  return `[${prefix}${paramStr ? ' ' + paramStr : ''}]`;
}


function highlightQuotes(shortcode, color) {
  const parts = shortcode.split(/(".*?")/);

  return parts.map((part, idx) => {
    if (/^".*"$/.test(part)) {
      return (
        <span key={idx} style={{ color: `var(--neko-${color})` }}>
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
  } = props;

  const [copyMessage, setCopyMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const rawShortcode = buildShortcodeString(prefix, params);

  const onClickShortcode = async () => {
    if (!navigator.clipboard) {
      alert('Clipboard is not enabled (only works with https).');
      return;
    }

    await navigator.clipboard.writeText(rawShortcode);
    setCopyMessage(`Copied ${name} to clipboard!`);
    setIsCopied(true);
    setTimeout(() => {
      setCopyMessage('');
      if (isCopied) {
        setIsCopied(false);
      }
    }, 1000);
  };

  const highlightedShortcode = highlightQuotes(rawShortcode, color);

  return (
    <>
      <NekoSpacer />
      <pre onClick={onClickShortcode} style={shortcodeStyle}>
        {copyMessage
          ? copyMessage
          : highlightedShortcode
        }
      </pre>
      <NekoSpacer />
    </>
  );
};

NekoShortcode.propTypes = {
  prefix: PropTypes.string,
  name: PropTypes.string,
  params: PropTypes.object,
  color: PropTypes.string,
};

export { NekoShortcode };