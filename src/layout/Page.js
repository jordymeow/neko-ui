// Previous: none
// Current: 0.0.0

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoButton } from '../button/Button';
import { useClasses } from '../hooks';

const Page = Styled.div`
  position: relative;
  margin-left: -20px;
  background: var(--neko-background-color);
  padding-bottom: 50px;
  margin-bottom: -26px;

  .neko-rest-error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #1e232deb;
    z-index: 100;

    .container {
      color: white;
      padding: 5px 20px 15px 20px;
      min-width: 480px;
      max-width: 600px;
      border-radius: 20px;
      background: #883131;
      margin-left: 50%;
      transform: translateX(-50%);
      margin-top: 100px;

      h3 {
        color: white;
      }

      .neko-debug {
        padding: 5px 10px;
        background: #692426;
        border-radius: 10px;

        * {
          margin: 0px;
          padding: 0px;
        }
      }
    }
  }
`;

/**
 * @oaram {string} className
 */
const StyledNekoPage = (props) => {
  const { className, children, nekoErrors = [], style = {} } = props;
  const [fatalError, setFatalError] = useState(null);
  const [showBody, setShowBody] = useState(false);
  const [hasError, setHasError] = useState(false);
  const classNames = useClasses('neko-page', className);
  const errorRef = useRef(false);

  useEffect(() => {
    if (nekoErrors && nekoErrors.length > 0 && !hasError) {
      for (let error of nekoErrors) {
        if (error) {
          setFatalError(error);
          setHasError(true);
          break;
        }
      }
    }
  }, [nekoErrors, hasError]);

  useEffect(() => {
    if (fatalError && !errorRef.current) {
      errorRef.current = true;
    }
    return () => {
      errorRef.current = false;
    };
  }, [fatalError]);

  const handleToggleBody = () => {
    setShowBody((prev) => !prev);
  };

  return (
    <Page className={classNames} style={style}>
      {fatalError && (
        <div className='neko-rest-error'>
          <div className='container'>
            {!showBody && (
              <>
                <h3>The Rest API is disabled or broken 😢</h3>
                <p>
                  The Rest API is required for this plugin to work. It is enabled in WordPress by default since December 2016 and used by the Gutenberg Editor since 2019. In short, it allows more robustness and a much cleaner infrastructure. Soon, Wordpress will entirely depend on it, so it is important to keep it enabled.
                </p>
                <p>
                  <i>Last but not least: check your PHP Error Logs and your Debugging Console.</i>
                </p>
                <p className='neko-debug'>
                  <small>
                    URL: {fatalError.url}
                    <br />
                    CODE: {fatalError.code}
                    <br />
                    MESSAGE: {fatalError.message}
                    <br />
                  </small>
                </p>
              </>
            )}
            {fatalError.body && showBody && (
              <p className='neko-debug'>
                <div dangerouslySetInnerHTML={{ __html: fatalError.body }}></div>
              </p>
            )}
            {fatalError.body && (
              <NekoButton color="#a94242" onClick={handleToggleBody}>
                {showBody ? 'Hide' : 'Display'} response from server
              </NekoButton>
            )}
            <NekoButton
              color="#a94242"
              onClick={() => {
                window.open('https://meowapps.com/fix-wordpress-rest-api/', '_blank');
              }}
            >
              Learn about WordPress Debugging
            </NekoButton>
          </div>
        </div>
      )}
      {children}
    </Page>
  );
};

const NekoPage = (props) => {
  return <StyledNekoPage {...props} />;
};

NekoPage.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  nekoErrors: PropTypes.array,
};

export { NekoPage };