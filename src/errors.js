class NekoError {

  constructor(message, code = '', url = null, body = null, debug = {} ) {
    this.url = url;
    this.message = message;
    this.code = code;
    this.body = body;
    this.debug = debug;
    this.cancelledByUser = code === 'USER-ABORTED';
  }
}

export { NekoError };