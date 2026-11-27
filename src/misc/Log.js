
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { NekoBlock } from '../layout/Block';
import { NekoButton } from '../button/Button';

const logStyle = {
    marginTop: 10,
    background: 'rgb(0, 72, 88)',
    padding: 10,
    color: 'rgb(58, 212, 58)',
    maxHeight: 400,
    minHeight: 200,
    display: 'block',
    fontFamily: 'monospace',
    fontSize: 12,
    whiteSpace: 'pre',
    overflowX: 'auto',
    borderRadius: 10,
    textWrap: 'balance',
};


const NekoLog = ({ refreshQuery, clearQuery, onRefresh = null, onClear = null, i18n, refreshOnMount = true, scrollToBottom = false, blockMaxWidth = 800 }) => {
    const logRef = useRef(null);

    const [ content, setContent ] = useState('');
    const [ busy, setBusy ] = useState(false);

    const refresh = async () => {
        setBusy(true);

        const logs = await refreshQuery();
        if( onRefresh ) {onRefresh(logs);}
        

        setContent(logs);
        setBusy(false);
      };
    
      const clear = async () => {
        setBusy(true);

        const res = await clearQuery();
        if( onClear ) {onClear(res);}

        setContent('');
        setBusy(false);
      };

    useEffect(() => {
        if (refreshOnMount) {
            refresh();
        }
    }, []);

    useEffect(() => {
        if (scrollToBottom && logRef.current) {
            logRef.current.scrollTo(0, logRef.current.scrollHeight);
        }
    }, [content]);

    return (
        <NekoBlock title={i18n.COMMON.LOGS} busy={busy} className="primary neko-log" style={{ maxWidth: blockMaxWidth }}>
            <NekoButton onClick={() => refresh()}>{i18n.COMMON.REFRESH_LOGS}</NekoButton>
            <NekoButton className="danger" onClick={() => clear()}>{i18n.COMMON.CLEAR_LOGS}</NekoButton>
            <div style={logStyle} ref={logRef}>
                {content}
            </div>
        </NekoBlock>
    );
}

NekoLog.propTypes = {
    refreshQuery: PropTypes.func,
    clearQuery: PropTypes.func,
    onRefresh: PropTypes.func,
    onClear: PropTypes.func,
    i18n: PropTypes.object,
    refreshOnMount: PropTypes.bool,
    scrollToBottom: PropTypes.bool,
    blockMaxWidth: PropTypes.number,
}

export { NekoLog };