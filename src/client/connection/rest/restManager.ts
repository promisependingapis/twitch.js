import { IHTTPOptions } from '../../../interfaces/';
import * as methodTypes from './methods';
import { Client } from '../../client';

/**
 * @private
 */
export class RestManager {
  private options!: IHTTPOptions;
  private methods: any = {};
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * @private
   */
  public async loadAllMethods(): Promise<void> {
    this.options = this.client.getOptions().http!;

    return new Promise(async (resolve) => {
      for (const [methodType, methodClasses] of Object.entries(methodTypes)) {
        for (const [methodName, MethodClass] of Object.entries(methodClasses)) {
          const fullMethodName = `${methodType}${methodName[0].toUpperCase()}${methodName.slice(1)}`;
          const newMethod = new (MethodClass as any)(this.options);
          this.methods[fullMethodName] = { method: newMethod, execute: newMethod.execute.bind(newMethod) };
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
