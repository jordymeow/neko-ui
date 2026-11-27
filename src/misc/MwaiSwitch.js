import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NekoTooltip } from './Tooltip';
import { NekoIcon } from './Icon';

// The "AI Engine" status shown in a block header: a label with a small switch at its end.
// ON = AI Engine is active, a download icon = not installed (opens the plugin installer),
// OFF = installed but deactivated (opens the Plugins page). Each state says what is true and
// links to the next step: ON opens AI Engine's dashboard (Jordy, 2026-11-09).
const StyledSwitch = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  box-sizing: border-box;
  padding: 0 3px 0 10px;
  border-radius: 999px;
  font-family: var(--neko-font-family);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  color: var(--neko-gray-30);
  background: var(--neko-gray-98);
  border: 1px solid var(--neko-gray-90);
  text-decoration: none;
  transition: background-color 0.15s ease, transform 0.15s ease;

  .neko-mwai-switch-state {
    display: inline-flex;
    align-items: center;
    height: 18px;
    padding: 0 8px;
    border-radius: 999px;
    font-size: 10px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &.get .neko-mwai-switch-state { padding: 0 6px; }

  &.on .neko-mwai-switch-state { background: var(--neko-green); color: white; }
  &.get .neko-mwai-switch-state { background: var(--neko-main-color); color: white; }
  &.off .neko-mwai-switch-state { background: var(--neko-gray-90); color: var(--neko-gray-40); }

  /* On a coloured block header (NekoBlock.primary), the chip turns to glass. */
  .neko-block.primary & {
    color: white;
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.25);
  }
  .neko-block.primary &.get .neko-mwai-switch-state { background: white; color: var(--neko-main-color); }
  .neko-block.primary &.off .neko-mwai-switch-state { background: rgba(255, 255, 255, 0.3); color: white; }

  &.link {
    cursor: pointer;
    user-select: none;
    &:hover { transform: translateY(-1px); }
  }
  &.link:focus-visible {
    outline: 2px solid var(--neko-main-color);
    outline-offset: 2px;
  }
`;

const ModelList = styled.div`
  display: grid;
  gap: 4px;
  font-size: 12px;
  line-height: 1.3;

  min-width: 300px;
  div { display: grid; grid-template-columns: 84px 1fr; }
  span { opacity: 0.6; }
  b { font-weight: 500; }
  em { font-style: normal; opacity: 0.6; }
`;

const Hint = styled.span`
  display: block;
  width: 170px;
  line-height: 1.4;
`;

// A little air between the switch and its hover card (the tooltip itself sits 5px away).
const Gap = styled.span`
  display: inline-block;
  padding-left: 6px;
`;

const NekoMwaiSwitch = ({
  enabled = false,
  installed,
  tooltip = '',
  getUrl = 'plugin-install.php?s=ai-engine&tab=search&type=term',
  activateUrl = 'plugins.php',
  dashboardUrl = 'admin.php?page=mwai_settings',
  label = 'AI Engine',
}) => {
  // Common prints window.meowAIEngine on our admin pages, so plugins don't need to pass it.
  const status = (typeof window !== 'undefined' && window.meowAIEngine) || {};
  const isInstalled = installed ?? !!status.installed;
  // Plugins pass "enabled" as active AND with an AI key. Active without a key is its own case: it must
  // not send people to the Plugins page (AI Engine is already active there), but to AI Engine's settings.
  const state = enabled ? 'on' : (status.active ? 'setup' : (isInstalled ? 'off' : 'get'));
  const href = { on: dashboardUrl, setup: dashboardUrl, off: activateUrl, get: getUrl }[state];
  const text = { on: 'On', setup: 'Off', off: 'Off' }[state];
  const chip = (
    <StyledSwitch as="a" href={href} className={`neko-mwai-switch ${state === 'setup' ? 'off' : state} link`}>
      {label}
      <span className="neko-mwai-switch-state">
        {state === 'get' ? <NekoIcon icon="download" raw width={12} height={12} strokeWidth={2.5} /> : text}
      </span>
    </StyledSwitch>
  );
  // On: the default models AI Engine will use (printed by common). Otherwise one short line saying what
  // the click does. The plugins' own messages are ignored: they were generic or, on some sites, a stored
  // provider list glued together.
  const models = status.models || [];
  let hover = {
    setup: 'Add an AI key in AI Engine to use the AI features.',
    off: 'Activate AI Engine to use the AI features.',
    get: 'Install AI Engine to use the AI features.',
  }[state] || tooltip;
  // A fixed width (two short lines): near the screen edge the tooltip would otherwise squeeze it.
  if (typeof hover === 'string' && hover) {
    hover = <Hint>{hover}</Hint>;
  }
  if (state === 'on' && models.length) {
    hover = (
      <ModelList>
        {models.map(m => (
          <div key={m.role}><span>{m.role}</span><b>{m.model}{m.env ? <em> · {m.env}</em> : null}</b></div>
        ))}
      </ModelList>
    );
  }
  // The switch sits at the right end of a header, near the screen edge: the hover opens to its left.
  return hover ? <NekoTooltip text={hover} position="left" maxWidth={400}><Gap>{chip}</Gap></NekoTooltip> : chip;
};

NekoMwaiSwitch.propTypes = {
  enabled: PropTypes.bool,
  installed: PropTypes.bool,
  tooltip: PropTypes.string,
  getUrl: PropTypes.string,
  activateUrl: PropTypes.string,
  dashboardUrl: PropTypes.string,
  label: PropTypes.string,
};

export { NekoMwaiSwitch };
