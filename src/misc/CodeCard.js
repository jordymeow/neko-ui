import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

/**
 * NekoCodeCard — a small card showing a code snippet with a title and an
 * optional description. The code block itself uses the brand indigo→purple
 * gradient that the PHP API / REST API doc blocks use.
 *
 *   <NekoCodeCard title="Text Query" description="Get AI-generated text…"
 *     code={`global $mwai;\n$result = $mwai->simpleTextQuery(...)`} />
 */

const Card = Styled.div`
  padding: 15px;
  border: 1px solid var(--neko-border-color, #ddd);
  border-radius: 8px;
  background: #f8f8f8;
`;

const Title = Styled.div`
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
`;

const Pre = Styled.pre`
  margin: 0;
  padding: 12px;
  font-size: 11px;
  line-height: 1.5;
  color: white;
  background: linear-gradient(
    135deg,
    var(--neko-code-card-start, #667eea) 0%,
    var(--neko-code-card-end, #764ba2) 100%
  );
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: pre;
`;

const Description = Styled.p`
  margin: 10px 0 0 0;
  font-size: var(--neko-small-font-size, 12px);
  color: var(--neko-gray-60);
  line-height: 14px;
`;

const NekoCodeCard = ({ title, code, description, style, className }) => (
  <Card style={style} className={className}>
    {title && <Title>{title}</Title>}
    <Pre>{code}</Pre>
    {description && <Description>{description}</Description>}
  </Card>
);

NekoCodeCard.propTypes = {
  title: PropTypes.node,
  code: PropTypes.string.isRequired,
  description: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

export { NekoCodeCard };
