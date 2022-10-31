import { IHTTPOptions } from '../../../interfaces/';
import { Client } from '../../client';
import path from 'path';
import fs from 'fs';

/**
 * @private
 */
export class RestManager {
  private options: IHTTPOptions;
  private methodsPath: string;
  private methods: any = {};
  private client: Client;

  constructor(client: Client) {
    this.client = client;
    this.methodsPath = path.resolve(__dirname, 'methods');
  }

  /**
   * @private
   */
  public async loadAllMethods(): Promise<void> {
    this.options = this.client.getOptions().http;
    return this.loadMethodsFolder(this.methodsPath);
  }

  private async loadMethodsFolder(methodsPath: string): Promise<void> {
    this.client.getLogger().debug('Loading Rest Methods...');
    const folders = fs.readdirSync(methodsPath);
    for (const folder of folders) {
      this.client.getLogger().debug('Loading Rest Methods folder: ' + folder + '...');
      // eslint-disable-next-line no-await-in-loop
      await this.loadMethods(path.resolve(this.methodsPath, folder), folder);
      this.client.getLogger().debug('Loaded Rest Methods folder: ' + folder);
    }
    this.client.getLogger().debug('Loaded ' + Object.keys(this.methods).length + ' Rest Methods!');
  }

  private async loadMethods(methodsPath: string, methodType: string): Promise<void> {
    return new Promise(async (resolve) => {
      const methods = fs.readdirSync(methodsPath);
      for (const method of methods) {
        if ((method.endsWith('.ts') || method.endsWith('.js')) && !method.includes('.d.ts')) {
          this.client.getLogger().debug(`Loading Rest Method: ${method} ...`);
          const methodFileName = method.replace(/(\.js)|(\.ts)/g, '');
          const methodName = methodType + methodFileName[0].toLocaleUpperCase() + methodFileName.slice(1);
          const loadedMethod = require(path.resolve(methodsPath, method));
          const newMethod = new loadedMethod.default(this.options);
          this.methods[methodName] = { method: newMethod, execute: newMethod.execute.bind(newMethod) };
          this.client.getLogger().debug(`Loaded Rest Method: ${methodName}!`);
        }
      }
      resolve();
    });
  }

  public get(method: string, ...params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!method.startsWith('get')) {
        method = 'get' + method[0].toLocaleUpperCase() + method.slice(1);
      }

      if (!this.methods[method]) {
        reject(new Error(`Method Get ${method} not found!`));
      }

      if (!params) params = [];

      this.methods[method].execute(params).then(resolve).catch(reject);
    });
  }

  public post(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!method.startsWith('post')) {
        method = 'post' + method[0].toLocaleUpperCase() + method.slice(1);
      }

      if (!this.methods[method]) {
        reject(new Error(`Method Post ${method} not found!`));
      }

      if (!params) params = [];

      this.methods[method].execute(params).then(resolve).catch(reject);
    });
  }

  public put(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!method.startsWith('put')) {
        method = 'put' + method[0].toLocaleUpperCase() + method.slice(1);
      }

      if (!this.methods[method]) {
        reject(new Error(`Method Put ${method} not found!`));
      }

      if (!params) params = [];

      this.methods[method].execute(params).then(resolve).catch(reject);
    });
  }

  public delete(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!method.startsWith('delete')) {
        method = 'delete' + method[0].toLocaleUpperCase() + method.slice(1);
      }

      if (!this.methods[method]) {
        reject(new Error(`Method Delete ${method} not found!`));
      }

      if (!params) params = [];

      this.methods[method].execute(params).then(resolve).catch(reject);
    });
  }
}
