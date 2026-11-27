import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from '../hooks';

const headingStyles = `
  font-family: var(--neko-font-family);
  font-weight: normal;
  line-height: normal;
  margin-top: 0;
  margin-bottom: 16px;
  padding: 0;
`;

const NekoH1 = Styled.h1`
  ${headingStyles}
  font-size: var(--neko-h1-font-size);
`;

const NekoH2 = Styled.h2`
  ${headingStyles}
  font-size: var(--neko-h2-font-size);
`;

const NekoH3 = Styled.h3`
  ${headingStyles}
  font-size: var(--neko-h3-font-size);
`;

const NekoH4 = Styled.h4`
  ${headingStyles}
  font-size: var(--neko-h4-font-size);
`;

const NekoH5 = Styled.h5`
  ${headingStyles}
  font-size: var(--neko-h5-font-size);
`;

const NekoH6 = Styled.h6`
  ${headingStyles}
  font-size: var(--neko-h6-font-size);
`;

const NekoP = Styled.p`
  font-family: var(--neko-font-family);
  font-size: var(--neko-font-size);
  line-height: normal;
  margin: 16px 0 24px;
  padding: 0;
`;

const NekoSpan = Styled.span`
  font-family: var(--neko-font-family);
  font-size: var(--neko-font-size);
  line-height: normal;
  margin: 0;
  padding: 0;
`;

const NekoLabel = Styled.label`
  font-family: var(--neko-font-family);
  font-size: var(--neko-font-size);
  line-height: normal;
  margin: 0;
  padding: 0;
`;

/**
 * @param {string} (variant) Tag Name
 */
const StyledNekoTypo = props => {
  const { children = null, style = {}, className = '', bold = false, h1, h2, h3, h4, h5, h6, p, span, label, ...rest } = props;
  const boldStyle = bold ? { fontWeight: 'bold' } : {};
  const classNames = useClasses('neko-typo', className, { 'neko-typo-h1': h1 }, { 'neko-typo-h2': h2 }, { 'neko-typo-h3': h3 }, { 'neko-typo-h4': h4 }, { 'neko-typo-h5': h5 }, { 'neko-typo-h6': h6 }, { 'neko-typo-p': p }, { 'neko-typo-label': label });

  if (h1) {
    return <NekoH1 style={{ ...boldStyle, ...style }} className={classNames} {...rest}>{children}</NekoH1>;
  } else if (h2) {
    return <NekoH2 style={{ ...boldStyle, ...style }} className={classNames} {...rest}>{children}</NekoH2>;
  } else if (h3) {
    return <NekoH3 style={{ ...boldStyle, ...style }} className={classNames} {...rest}>{children}</NekoH3>;
  } else if (h4) {
    return <NekoH4 style={{ ...boldStyle, ...style }} className={classNames} {...rest}>{children}</NekoH4>;
  } else if (h5) {
    return <NekoH5 style={{ ...boldStyle, ...style }} className={classNames} {...rest}>{children}</NekoH5>;
  } else if (h6) {
    return <NekoH6 style={{ ...boldStyle, ...style }} className={classNames} {...rest}>{children}</NekoH6>;
  } else if (p) {
    return <NekoP style={{ ...boldStyle, ...style }} className={classNames} {...rest}>{children}</NekoP>;
  } else if (label) {
    return <NekoLabel style={{ ...boldStyle, ...style }} className={classNames} {...rest}>{children}</NekoLabel>;
  } else {
    return <NekoSpan style={{ ...boldStyle, ...style }} className={classNames} {...rest}>{children}</NekoSpan>;
  }
};

const NekoTypo = (props) => {
  return (<StyledNekoTypo {...props} />);
}

NekoTypo.propTypes = {
  h1: PropTypes.any,
  h2: PropTypes.any,
  h3: PropTypes.any,
  h4: PropTypes.any,
  h5: PropTypes.any,
  h6: PropTypes.any,
  p: PropTypes.any,
  span: PropTypes.any,
  label: PropTypes.any,
  bold: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node
};

export { NekoTypo };
