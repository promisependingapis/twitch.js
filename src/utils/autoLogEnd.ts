import { Logger } from './';

var exited = false;

const logger: Logger = new Logger({ prefix: 'SYSTEM' });
function exitHandler(options: any, exitCode: string | number): void {
  if (!exited) {
    process.stdin.resume();
    exited = true;
    if (typeof exitCode === 'string') {
      logger.warn('Manually Finished!');
    } else {
      if ((exitCode || exitCode === 0) && !options.uncaughtException) logger.info('Program finished, code: ' + exitCode);
      if ((exitCode || exitCode === 0) && options.uncaughtException) logger.fatal(exitCode);
    }
    process.exit(typeof exitCode === 'string' ? 0 : exitCode);
  }
}

export function activate(uncaughtException?: boolean): void {
  process.on('exit', exitHandler.bind(null, {}));
  process.on('SIGINT', exitHandler.bind(null, {}));
  process.on('SIGUSR1', exitHandler.bind(null, {}));
  process.on('SIGUSR2', exitHandler.bind(null, {}));
  process.on('uncaughtException', exitHandler.bind(null, { uncaughtException: uncaughtException ?? false }));
}
