// Previous: none
// Current: 0.0.0


import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { NekoContainer } from '../layout/Container';
import { NekoButton } from '../button/Button';
import { NekoTypo } from './Typography';

/**
 *  NekoAssistant
 *  
 * @param {array} messages: Array with a title and a message [ { title: 'Title', message: 'Message', action: () => {}, actionText: 'Action' } ]
 * @param {string} hideText: Text for the hide button
 * @param {function} onHide: Function to execute when the hide button is clicked ( Update the hide option in the plugin settings )
 * @param {bool} showMessagesCount: Show the number of messages in the assistant ( ex: 1 / 3 )
 */
const NekoAssistant = ( props ) => {

    const { messages, hide, hideText, onHide, showMessagesCount } = props;

    if ( hide ) return null;

    const [ currentMessageIndex, setCurrentMessageIndex ] = useState( 0 );

    const handleNextMessage = () => {
        if ( currentMessageIndex < messages.length - 1 ) {
            setCurrentMessageIndex( currentMessageIndex + 1 );
        }
    };

    const handlePreviousMessage = () => {
        if ( currentMessageIndex > 0 ) {
            setCurrentMessageIndex( currentMessageIndex - 1 );
        }
    };

    const isLastMessage = useMemo(() => currentMessageIndex === messages.length - 1, [ currentMessageIndex, messages ]);

    return (
        <NekoContainer

            header={ showMessagesCount && <NekoTypo variant="body2">{ `${ currentMessageIndex + 1 } / ${ messages.length }` }</NekoTypo> }

            footer={
                <>
                

                { messages[ currentMessageIndex ]?.action && <NekoButton small onClick={ messages[ currentMessageIndex ].action }> { messages[ currentMessageIndex ]?.actionText || 'Click here!' } </NekoButton> }

                <NekoButton className={'secondary'} small  onClick={ handlePreviousMessage } disabled={ currentMessageIndex === 0 }>Previous</NekoButton>
                <NekoButton className={'secondary'} small  onClick={ handleNextMessage } disabled={ currentMessageIndex === messages.length - 1 }>Next</NekoButton>

                { hideText && <NekoButton className={'danger'} small onClick={ onHide } disabled={!isLastMessage}>{ hideText }</NekoButton> }
                </>
            }
        
        >
            <NekoTypo h4>{ messages[ currentMessageIndex ].title }</NekoTypo>
            <NekoTypo>
            {messages[currentMessageIndex].message.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    <br />
                </React.Fragment>
            ))}
            </NekoTypo>
            
        </NekoContainer>
    );

}

NekoAssistant.propTypes = {
    hide: PropTypes.bool,
    hideText: PropTypes.string,
    onHide: PropTypes.func,

    messages: PropTypes.arrayOf(PropTypes.node),
    showMessagesCount: PropTypes.bool
};


export { NekoAssistant };