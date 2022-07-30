export function waitForToken(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    var tokenTimeout = null;
    if (this.tokenVerified) {
      this.logger.debug('Login method has already been called continuing on without waiting...');
      resolve();
    } else {
      this.logger.debug('Login method has not been called yet, waiting...');
      const tokenVerifier = setInterval(async () => {
        if (this.token !== null) {
          this.logger.debug('Login method has been called continuing on...');
          clearInterval(tokenVerifier);
          if (tokenTimeout) {
            clearTimeout(tokenTimeout);
          }
          resolve();
        }
      }, this.options.loginWaitInterval);
      if (typeof this.options.loginWaitTimeout === 'number' && this.options.loginWaitTimeout > 0) {
        tokenTimeout = setTimeout(() => {
          this.logger.error('Too long without token!');
          clearInterval(tokenVerifier);
          reject('Too long without token!');
        }, this.options.loginWaitTimeout);
      }
    }
  });
}

export function waitForTwitchConnection(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    var readyTimeout = null;
    if (this.isReady) {
      this.logger.debug('Twitch has already responded, continuing on without waiting...');
      resolve();
    } else {
      this.logger.debug('Twitch still hasn\'t responded, waiting...');
      const connectionVerifier = setInterval(async () => {
        if (this.isReady) {
          this.logger.debug('Twitch has responded, continuing on...');
          clearInterval(connectionVerifier);
          if (readyTimeout) {
            clearTimeout(readyTimeout);
          }
          resolve();
        }
      }, 500);
      if (typeof this.options.connectionWaitTimeout === 'number' && this.options.connectionWaitTimeout > 0) {
        readyTimeout = setTimeout(() => {
          this.logger.error('Too long without a response from Twitch!');
          clearInterval(connectionVerifier);
          reject('Too long without a response from Twitch!');
        }, this.options.connectionWaitTimeout);
      }
    }
  });
}
