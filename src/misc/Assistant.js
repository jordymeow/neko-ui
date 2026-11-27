
import { useState } from 'react';
import PropTypes from 'prop-types';

import { NekoContainer } from '../layout/Container';
import { NekoButton } from '../button/Button';
import { NekoTypo } from './Typography';

/**
 *  NekoAssistant
 *
 * @param {array} messages: Array with a title and a message [ { title: 'Title or JSX', message: 'Message or JSX', action: () => {}, actionText: 'Action' } ]
 * @param {string} hideText: Text for the hide button
 * @param {function} onHide: Function to execute when the hide button is clicked ( Update the hide option in the plugin settings )
 * @param {bool} showMessagesCount: Show the number of messages in the assistant ( ex: 1 / 3 )
 */
const NekoAssistant = ( props ) => {

    const { messages, hide, hideText, onHide, showMessagesCount } = props;

    // Hooks must run before the early return: toggling `hide` used to crash React.
    const [ currentMessageIndex, setCurrentMessageIndex ] = useState( 0 );

    const handleNextMessage = () => {
        if ( currentMessageIndex < messages.length - 1 ) {
            setCurrentMessageIndex( currentMessageIndex + 1 );
        } else {
            setCurrentMessageIndex( 0 );
        }
    };

    const handlePreviousMessage = () => {
        if ( currentMessageIndex > 0 ) {
            setCurrentMessageIndex( currentMessageIndex - 1 );
        }
    };

    const isLastMessage = currentMessageIndex === messages.length - 1;

    if ( hide ) return null;

    return (
        <NekoContainer
            className="neko-assistant"
            header={ showMessagesCount && <NekoTypo variant="body2">{ `${ currentMessageIndex + 1 } / ${ messages.length }` }</NekoTypo> }

            footer={
                <>
                

                { messages[ currentMessageIndex ]?.action && <NekoButton small onClick={ messages[ currentMessageIndex ].action }> { messages[ currentMessageIndex ]?.actionText || 'Click here!' } </NekoButton> }

                <NekoButton className={'secondary'} small  onClick={ handlePreviousMessage } disabled={ currentMessageIndex === 0 }>Previous</NekoButton>
                <NekoButton className={'secondary'} small  onClick={ handleNextMessage }>{ isLastMessage ? 'Restart' : 'Next' }</NekoButton>

                { hideText && <NekoButton className={'danger'} small onClick={ onHide } disabled={!isLastMessage}>{ hideText }</NekoButton> }
                </>
            }
        
        >
            <NekoTypo h4>{ messages[ currentMessageIndex ].title }</NekoTypo>
            <NekoTypo>
                { messages[ currentMessageIndex ].message }
            </NekoTypo>

        </NekoContainer>
    );

}

NekoAssistant.propTypes = {
    hide: PropTypes.bool,
    hideText: PropTypes.string,
    onHide: PropTypes.func,

    messages: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node,
        message: PropTypes.node,
        action: PropTypes.func,
        actionText: PropTypes.string
    })),
    showMessagesCount: PropTypes.bool
};


export { NekoAssistant };