// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoLogo } from './Logo';
import { NekoIcon } from './Icon';
import contentSave from '@iconify/icons-mdi/content-save';

const HeaderBase = Styled.div`
  position: relative;
  color: white;
  font-family: var(--neko-font-family);
  font-size: var(--neko-font-size);
  display: flex;
  height: 60px;
  overflow: hidden;
  align-items: center;
  padding: 15px 32px;
  background-color: var(--neko-main-color);
  display: flex;

  .neko-header-logo-container {
    width: 40px;
    height: 40px;
    padding: 10px;
    margin-right: 15px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .neko-header-title-container {
    flex-direction: column;
    display: flex;

    .neko-header-title {
      color: white;
      font-family: var(--neko-font-family);
      font-size: 23px;
      line-height: normal;
      margin: 0;
    }

    .neko-header-subtitle {
      color: white;
      font-family: var(--neko-font-family);
      line-height: normal;
      font-size: var(--neko-font-size);
    }
  }

  .neko-header-extra-content {
    flex: 1;
    margin: 0 20px;
  }
`;

const StyledNekoHeader = props => {

  const { title = 'NekoUI', subtitle = '♥️ By Meow Apps', children, saving = false } = props;

  return (
    <HeaderBase className='neko-header'>
      <div className='neko-header-logo-container'>
        <NekoLogo />
      </div>
      <div className="neko-header-title-container">
        <h1 className="neko-header-title">{title}</h1>
        <small className="neko-header-subtitle"><a target='_blank' href='https://meowapps.com' 
          style={{ color: 'white', textDecoration: 'none' }}>{subtitle}</a></small>
      </div>
      <div className="neko-header-extra-content">{children}</div>
      {saving && <NekoIcon icon={contentSave} width="36" height="36" />}
    </HeaderBase>
  );
};

const NekoHeader = (props) => {
  return (<StyledNekoHeader {...props} />);
}

NekoHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  saving: PropTypes.bool
};

export { NekoHeader };
