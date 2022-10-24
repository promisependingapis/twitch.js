import { Logger } from './';
import util from 'util';

var exited = false;

const logger: Logger = new Logger({ prefix: 'SYSTEM' });
function exitHandler({ err, options, exitCode }: {err: {stack: any, message: any, name: any} | null, options?: {uncaughtException: boolean}, exitCode?: number | string}): void {
  if (!exited) {
    process.stdin.resume();
    exited = true;
    if (typeof exitCode === 'string') {
      logger.warn('Manually Finished!');
    } else {
      if (exitCode !== 123654) logger.info('Program finished, code: ' + exitCode);
      if (exitCode === 123654 && options.uncaughtException) {
        logger.fatal(util.format(typeof err === 'string' ? err : err.stack));
        exitCode = 1;
      } else if (exitCode && exitCode === 123654) {
        logger.error(util.format(typeof err === 'string' ? err : err.stack));
        logger.warn('#===========================================================#');
        logger.warn('| # AutoLogEnd prevent program exit!');
        logger.warn('| # Code that is not async or would be runned after the line that generated the error cannot run as per nodejs default behavior.');
        logger.warn('| # But promises, async code and event based functions will still be executed.');
        logger.warn('| # In order to prevent sync code to stop, use an try-catch or a promise.');
        logger.warn('#===========================================================#');
        logger.warn('If you want to manually exit, you can still use control-c in the process.');
        exited = false;
        return;
      }
    }
    process.exit(typeof exitCode === 'string' ? 0 : exitCode);
  }
}

export function activate(uncaughtException?: boolean): void {
  process.on('exit', (exitCode) => exitHandler({ exitCode, options: { uncaughtException: false }, err: null }));
  process.on('SIGINT', (error) => { exitHandler({ err: { message: error, name: null, stack: null }, options: { uncaughtException: false }, exitCode: 'SIGINT' }); });
  process.on('SIGUSR1', (error) => { exitHandler({ err: { message: error, name: null, stack: null }, options: { uncaughtException: false }, exitCode: 'SIGUSR1' }); });
  process.on('SIGUSR2', (error) => { exitHandler({ err: { message: error, name: null, stack: null }, options: { uncaughtException: false }, exitCode: 1 }); });
  process.on('uncaughtException', (error) => {
    exitHandler({
      err: { message: error.message, name: error.name, stack: error.stack },
      options: { uncaughtException: uncaughtException ?? false },
      exitCode: 123654,
    });
  });
}

export function deactivate(): void {
  process.removeListener('exit', exitHandler);
  process.removeListener('SIGINT', exitHandler);
  process.removeListener('SIGUSR1', exitHandler);
  process.removeListener('SIGUSR2', exitHandler);
  process.removeListener('uncaughtException', exitHandler);
}
