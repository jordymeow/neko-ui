import React from 'react';
import { NekoError } from './errors';

const nekoCircularReplacer = (ignoreCircular) => {
  let cache = [];
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        if (!ignoreCircular) {
          console.warn('Circular reference found.', { 
            key, value,
            cache, cacheIndex: cache.indexOf(value),
          });
          throw new Error('Circular reference found. Cancelled.');
        }
        return;
      }
      cache.push(value);
    }
    return value;
  };
};

function nekoStringify(obj, space = null, ignoreCircular = true) {
  return JSON.stringify(obj, nekoCircularReplacer(ignoreCircular), space);
}

function chunkArrayInGroups(arr, size) {
  let result = [];
  for (let i = 0; i < arr.length; i += size)
    result.push(arr.slice(i, i + size));
  return result;
}

const consolidateJsonResult = (json) => {
  if (!json.data) {
    return json;
  }
  if (Array.isArray(json.data) && json.data.length > 0 && json.data[0].meta) {
    for (let x of json.data) {
      try { x.meta = JSON.parse(x.meta); }
      catch (err) { console.error('[JsonFetcher]', 'Could not decode meta.', x.meta); }
    }
  }
  else if (!Array.isArray(json.data) && json.data.meta) {
    try { json.data.meta = JSON.parse(json.data.meta); }
    catch (err) { console.error('[JsonFetcher]', 'Could not decode meta.', json.data.meta); }
  }
  return json;
}

// A reply that isn't JSON is usually a page sent by something else (a firewall,
// a PHP warning, a host error page). Name the culprit so users don't blame the plugin.
const stripTags = (html) => html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/[ \t]+/g, ' ');
const truncate = (text, max) => text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text;

const CLOUDFLARE_HINT = "Cloudflare's security check blocked this request. Allow /wp-json/ for logged-in users in Cloudflare (Security → WAF).";

const describeBrokenReply = (body, rawBody) => {
  const text = typeof body === 'string' ? body : '';
  const status = rawBody?.status;
  const isHtml = /<(!doctype|html|head|body)\b/i.test(text);
  const cfRay = rawBody?.headers?.get?.('cf-ray');
  if (/Just a moment|cf-chl|challenge-platform/i.test(text)) {
    return CLOUDFLARE_HINT;
  }
  const php = stripTags(text).match(/(?:^|\n)\s*(?:PHP )?(?:Fatal error|Parse error|Warning|Notice|Deprecated):[^\n]*/);
  if (php) {
    return `PHP printed something before the reply: ${truncate(php[0].trim().replace(/\s+/g, ' '), 160)}`;
  }
  // Every Cloudflare reply has a cf-ray, so only a 403 HTML page counts as its challenge.
  if (cfRay && isHtml && status === 403) {
    return CLOUDFLARE_HINT;
  }
  if (isHtml) {
    const title = text.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
    const cleanTitle = title ? truncate(stripTags(title).trim(), 100) : '';
    return `The server sent a web page instead (HTTP ${status || '?'}${cleanTitle ? `: ${cleanTitle}` : ''}).`;
  }
  if (status >= 400) {
    return `The server answered with HTTP ${status}.`;
  }
  return null;
};

const jsonFetcher = async (url, options = {}) => {
  let body = null;
  let json = {};
  let nekoError = null;
  let rawBody = null;

  try {
    options = options ? options : {};
    options.headers = options.headers ? options.headers : {};
    options.headers['Pragma'] = 'no-cache';
    options.headers['Cache-Control'] = 'no-cache';
    rawBody = await fetch(`${url}`, options);
    body = await rawBody.text();
    json = JSON.parse(body);
    if (!json.success) {
      let code = json.success === false ? 'NOT-SUCCESS' : 'N/A';
      let message = json.message ? json.message : 'Unknown error. Check your Console Logs.';
      if (json.code === 'rest_no_route') {
        message = "The API can't be accessed. Are you sure the WP REST API is enabled? Check this article: https://meowapps.com/fix-wordpress-rest-api/.";
        code = 'NO-ROUTE';
      }
      else if (json.code === 'internal_server_error') {
        message = "Server error. Please check your PHP Error Logs.";
        code = 'SERVER-ERROR';
      }
      nekoError = new NekoError(message, code, url, body ? body : rawBody);
    }
  }
  catch (error) {
    console.error('[nekoFetch]', error);
    let code = 'BROKEN-REPLY';
    let message = "The reply sent by the server is broken.";
    if (error.name === 'AbortError') {
      code = "USER-ABORTED";
      message = "The request was aborted by the user.";
    }
    else if (rawBody && rawBody.status) {
      if (rawBody.status === 408) {
        code = "REQUEST-TIMEOUT";
        message = "The request generated a timeout.";
      }
    }
    if (code === 'BROKEN-REPLY') {
      const hint = describeBrokenReply(body, rawBody);
      if (hint) {
        message = `${message} ${hint}`;
      }
    }
    nekoError = new NekoError(message, code, url, body ? body : rawBody, error);
  }
  if (nekoError) {
    // console.error('[NekoError] JsonFetcher', nekoError.url, { code: nekoError.code, 
    //   error: nekoError.error, body: nekoError.body });
    json.success = false;
    json.message = nekoError.message;
    json.error = nekoError;
  }
  return consolidateJsonResult(json);
}

// NekoFetch (new in 2023)
// Replace getFetch and postFetch with similar arguments
const nekoFetch = async (url, config = {}) => {
  const { json = null, method = 'GET', signal, file, nonce, bearerToken } = config;
  if (method === 'GET' && json) {
    throw new Error(`NekoFetch: GET method does not support json argument (${url}).`);
  }
  let formData = file ? new FormData() : null;
  if (file) {
    formData.append('file', file);
    for (const [key, value] of Object.entries(json)) {
      formData.append(key, value);
    }
  }
  const headers = {};
  if (nonce) {
    headers['X-WP-Nonce'] = nonce;
  }
  if (bearerToken) {
    headers['Authorization'] = `Bearer ${bearerToken}`;
  }
  if (!formData) {
    headers['Content-Type'] = 'application/json';
  }
  const options = { 
    method: method,
    headers: headers,
    body: formData ? formData : (json ? nekoStringify(json) : null),
    signal: signal
  };

  let res = null;
  try {
    res = await jsonFetcher(url, options);
    if (!res.success) {
      const err = new Error(res?.message ?? "Unknown error.");
      err.code = res?.error?.code;
      err.body = res?.error?.body;
      err.url = url;
      throw err;
    }
    return res;
  }
  catch (err) {
    throw err;
  }
}

const getFetch = async (url, json, signal, nonce) => {
  const nonceHeader = nonce ? { 'X-WP-Nonce': nonce } : {};
  return jsonFetcher(url, { 
    method: 'GET', 
    headers: { 'Content-Type': 'application/json', ...nonceHeader },
    signal: signal
  });
}

const postFetch = async (url, config = {}) => {
  // If Dev Mode, we will output a warning in the console that nekoFetch should be used instead.
  if (process.env.NODE_ENV === 'development') {
    console.warn('NekoUI: postFetch is deprecated. Please use nekoFetch instead (it uses the same arguments, but it performs a GET by default).');
  }
  const { json = {}, signal, file, nonce, bearerToken } = config;
  let formData = file ? new FormData() : null;
  if (file) {
    formData.append('file', file);
    for (const [key, value] of Object.entries(json)) {
      formData.append(key, value);
    }
  }

  const headers = nonce ? { 'X-WP-Nonce': nonce } : {};
  if (bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  }
  if (!formData) {
    headers['Content-Type'] = 'application/json';
  }

  return jsonFetcher(url, { 
    method: 'POST',
    headers: headers,
    body: formData ? formData: nekoStringify(json) ,
    signal: signal
  });
}

const buildUrlWithParams = (apiUrl, params) => {
  const isPlainPermalink = apiUrl.includes('index.php?rest_route');
  const urlParams = new URLSearchParams(params);
  const finalUrl = apiUrl + (isPlainPermalink ? '&' : '?') + urlParams.toString();
  return finalUrl;
}

const formatBytes = (bytes, decimals = 2) => {
  //if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = bytes > 0 ? Math.floor(Math.log(bytes) / Math.log(k)) : 0;
  if ( sizes[i] === 'Bytes' ) {
    i = 1;
  }
  bytes = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  var str = bytes.toFixed(Math.max(dm, (bytes.toString().split('.')[1] || []).length));
  return str + ' ' + sizes[i];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const toHTML = (html) => {
  return <span style={{ display: 'inline' }} dangerouslySetInnerHTML={{ __html: html }}></span>
}

const embedVars = (str, ...args) => {
  let embedString = str;
  for (let i = 0; i < args.length; i++) {
    embedString = embedString.replace(`{${i}}`, args[i]);
  }
  return embedString;
}

class NekoErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: error };
  }

  render() {
    if (this.state.hasError) {
      let errorString = '';
      if (typeof this.state.hasError === 'string') {
        errorString = this.state.hasError;
      }
      else if (this.state.hasError.message) {
        errorString = this.state.hasError.message;
      }
      else if (this.state.hasError.toString) {
        errorString = this.state.hasError.toString();
      }
      else {
        errorString = nekoStringify(this.state.hasError);
      }
      return <>
        <div style={{ background: 'var(--neko-red)', color: 'white', margin: 15, padding: 15, borderRadius: 15 }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            ⚠️ <b>Error</b><br />Sorry, an error occured! Don't worry, I will fix this, so simply let me know about it.
            <br />Here is some information about it:<br /><br />
            {errorString}
          </pre>
        </div>
      </>;
    }
    return this.props.children; 
  }
}

function dateTimeFormat(value, options = { locale: 'ja-JP', date: { year: 'numeric', month: '2-digit', day: '2-digit' }, time: { hour: '2-digit', minute: '2-digit', second: '2-digit' }, tableStyling: false }) {
  if (!value) return '';
  if (typeof value === 'string') {
    value = new Date(value);
  }

  const time = new Date( value );
  const date = time.toLocaleDateString(options.locale, options.date);
  const hour = time.toLocaleTimeString(options.locale, options.time);

  if( !options.tableStyling ) {
    return { date, hour };
  }

  return (
        <div style={{ padding: '12px 16px', borderRadius: '8px', margin: '8px 0' }}>
            <div style={{ display: 'flex',
                          justifyContent: 'space-between',
                          color: '#777',
                          fontSize: '0.65rem',
                          marginBottom: '6px' 
                }}>
                <span>📅 Date</span>
                <span>⏰ Time</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
                <span>{date}</span>
                <span>{hour}</span>
            </div>
        </div>
    );
  
}

export { getFetch, postFetch, jsonFetcher, chunkArrayInGroups, nekoStringify, dateTimeFormat,
  buildUrlWithParams, formatBytes, sleep, nekoFetch, toHTML, embedVars, NekoErrorBoundary };
