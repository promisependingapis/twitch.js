import { IClientOptions } from '../interfaces/';
import { Logger, autoLogEnd } from './';
import merge from 'lodash.merge';

/**
 * @private
 */
export default function logOptions(defaultOptions: IClientOptions, options: IClientOptions): Promise<[IClientOptions, Logger]> {
  return new Promise((resolve) => {
    const newOptions = merge(defaultOptions, options);

    if (newOptions.debug) {
      newOptions.loggerOptions.debug = true;
    }

    if (newOptions.prefix) {
      newOptions.loggerOptions.prefix = newOptions.prefix;
    }

    if (newOptions.disableFatalCrash) {
      newOptions.loggerOptions.disableFatalCrash = true;
    }

    const logger = new Logger(newOptions.loggerOptions);

    logger.debug('Debug Mode Enabled!');

    if (newOptions.autoLogEndEnabled) {
      autoLogEnd.activate(newOptions.autoLogEndUncaughtException ?? false);
      logger.debug('Auto Log End™ enabled');
      if (newOptions.autoLogEndUncaughtException) {
        logger.debug('Auto Log End™ will log uncaught exceptions');
      }
    }

    if (newOptions.connectedChannels.length > 0) {
      logger.error('`ConnectedChannels` has been set, but it is a private parameter! Use the `Channels` property instead!');
      logger.warn('Changing the `ConnectedChannels` property values to the `Channels` automatically!');
      newOptions.channels = [...newOptions.channels, ...newOptions.connectedChannels];
      newOptions.connectedChannels = [];
    }

    if (newOptions.fetchAllChatters) {
      logger.debug('Fetching all chatters is enabled!');
    }

    if (newOptions.messageCacheLifetime > 0) {
      logger.debug('Message cache lifetime is set to ' + newOptions.messageCacheLifetime + ' seconds');
    }

    if (newOptions.messageCacheMaxSize > 0) {
      logger.debug('Message cache max size is set to ' + newOptions.messageCacheMaxSize);
    }

    if (newOptions.messageSweepInterval > 0) {
      logger.debug('Message sweep interval is set to ' + newOptions.messageSweepInterval + ' seconds');
    }

    if (newOptions.retryInterval > 0) {
      logger.debug('Retry interval is set to ' + newOptions.retryInterval + ' seconds');
    }

    if (newOptions.retryLimit > 0) {
      logger.debug('Retry limit is set to ' + newOptions.retryLimit);
    }

    if (newOptions.sync) {
      logger.debug('Synchronization is enabled!');
    }

    if (newOptions.syncInterval > 0) {
      logger.debug('Synchronization interval is set to ' + newOptions.syncInterval + ' seconds');
    }

    if (newOptions.ws.host) {
      logger.debug('WebSocket host is set to ' + newOptions.ws.host);
    }

    if (newOptions.ws.port) {
      logger.debug('WebSocket port is set to ' + newOptions.ws.port);
    }

    if (newOptions.ws.type) {
      logger.debug('WebSocket type is set to ' + newOptions.ws.type);
    }

    if (newOptions.http.host) {
      logger.debug('HTTP host is set to ' + newOptions.http.host);
    }

    if (newOptions.http.hostID) {
      logger.debug('HTTP host ID is set to ' + newOptions.http.hostID);
    }

    if (newOptions.http.headers) {
      logger.debug('HTTP headers are set to ' + JSON.stringify(newOptions.http.headers));
    }

    if (newOptions.channels.length > 0) {
      logger.debug('Channels are set to ["' + newOptions.channels.join('", "') + '"]');
    }

    logger.debug('Client options set!');
    resolve([newOptions, logger]);
  });
}
