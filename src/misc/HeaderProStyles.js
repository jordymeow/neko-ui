import Styled from 'styled-components';

/* ───────── A. Inverted ribbon — solid white with colored text ───────── */

const ribbonStyles = `
  padding: 5px 24px;
  border-radius: 0 0 10px 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  line-height: 1;
  height: 18px;
  min-width: 140px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: letter-spacing 0.25s ease, color 0.25s ease;
`;

export const ProBadge = Styled.span`
  ${ribbonStyles}
  background: white;
  color: var(--neko-orange);
`;

export const FreeBadge = Styled.a`
  ${ribbonStyles}
  background: white;
  color: var(--neko-main-color);
  cursor: pointer;

  &:hover {
    color: var(--neko-orange);
    letter-spacing: 0.14em;
  }
`;

/* ───────── B. Minimal supertext — no bg, just letter-spaced text ───────── */

const minimalStyles = `
  padding: 4px 10px 6px 10px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  line-height: 1;
  color: rgba(255, 255, 255, 0.58);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: relative;
  transition: color 0.25s ease, letter-spacing 0.25s ease;

  /* A tiny dot before the label, a subtle signature mark */
  &::before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: currentColor;
  }
`;

export const ProBadgeMinimal = Styled.span`
  ${minimalStyles}
  color: rgba(255, 220, 150, 0.9);
`;

export const FreeBadgeMinimal = Styled.a`
  ${minimalStyles}
  cursor: pointer;

  &:hover {
    color: white;
    letter-spacing: 0.24em;
  }
`;
