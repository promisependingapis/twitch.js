import { IHTTPOptions } from '../../../interfaces/';
import { Client } from '../../client';
import path from 'path';
import fs from 'fs';

/**
 * @private
 */
export class RestManager {
  private options!: IHTTPOptions;
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
    this.options = this.client.getOptions().http!;
    return await this.loadMethodsFolder(this.methodsPath);
  }

  private async loadMethodsFolder(methodsPath: string): Promise<void> {
    const folders = fs.readdirSync(methodsPath);
    for await (const folder of folders) {
      await this.loadMethods(path.resolve(this.methodsPath, folder), folder);
    }
  }

  private async loadMethods(methodsPath: string, methodType: string): Promise<void> {
    return new Promise(async (resolve) => {
      const methods = fs.readdirSync(methodsPath);
      for (const method of methods) {
        if ((method.endsWith('.ts') || method.endsWith('.js')) && !method.includes('.d.ts')) {
          const methodFileName = method.replace(/(\.js)|(\.ts)/g, '');
          const methodName = methodType + methodFileName[0].toLocaleUpperCase() + methodFileName.slice(1);
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const loadedMethod = require(path.resolve(methodsPath, method));
          const newMethod = new loadedMethod.default(this.options);
          this.methods[methodName] = { method: newMethod, execute: newMethod.execute.bind(newMethod) };
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
