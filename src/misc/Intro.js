import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoContainer } from '../layout/Container';

/**
 * NekoIntro — the little paragraph that explains what a page is.
 *
 * Standardizes the readable body text + brand-green external links (with a
 * trailing ↗) that we use across Dashboard/Settings tops in every plugin.
 *
 * Usage:
 *   <NekoIntro>
 *     This is a <b>representation</b> of ...
 *     See the <a href="..." target="_blank">NekoUI docs</a>.
 *   </NekoIntro>
 *
 * External links (`target="_blank"`) automatically get the ↗ arrow + green
 * accent. Internal links stay default.
 */
const IntroContainer = Styled.div`
  font-family: var(--neko-font-family);
  font-size: 14px;
  line-height: 1.4;
  color: var(--neko-gray-40);

  p {
    margin: 0;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  a[target="_blank"] {
    color: var(--neko-green);
    font-weight: 500;
    text-decoration: underline;
    text-decoration-color: color-mix(in oklab, var(--neko-green) 45%, transparent);
    text-decoration-thickness: 1.5px;
    text-underline-offset: 2px;
    transition: color 0.2s var(--neko-ease-out), text-decoration-color 0.2s var(--neko-ease-out);
  }

  a[target="_blank"]:hover {
    color: color-mix(in oklab, var(--neko-green) 80%, black);
    text-decoration-color: currentColor;
  }

  a[target="_blank"]::after {
    content: ' ↗';
    font-variant-position: super;
  }
`;

const StyledNekoIntro = (props) => {
  const { children, framed = true, style, ...rest } = props;

  const body = (
    <IntroContainer className="neko-intro-body" style={!framed ? style : undefined} {...(!framed ? rest : {})}>
      {children}
    </IntroContainer>
  );

  if (!framed) return body;

  return (
    <NekoContainer contentStyle={{ padding: '22px 26px' }} style={style} {...rest}>
      {body}
    </NekoContainer>
  );
};

const NekoIntro = (props) => <StyledNekoIntro {...props} />;

NekoIntro.propTypes = {
  children: PropTypes.node,
  framed: PropTypes.bool,
  style: PropTypes.object,
};

export { NekoIntro };
