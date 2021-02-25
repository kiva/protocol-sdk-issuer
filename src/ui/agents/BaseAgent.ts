import {IBaseAgent} from "../interfaces/AgentInterfaces";

export default class BaseAgent implements IBaseAgent {

    async baseFunction(request: Promise<any>, callback: (data: any) => any, error?: string): Promise<any> {
        try {
            const connection: any = await request;

            return Promise.resolve(callback(connection));
        } catch (e) {
            const msg: string = error || e.message;
            return Promise.reject(msg);
        }
    }

    async establish(request: Promise<any>, callback: (data: any) => any, error?: string): Promise<any> {
        return this.baseFunction(request, callback, error);
    }

    async check(request: Promise<any>, callback: (data: any) => any, error?: string): Promise<any> {
        return this.baseFunction(request, callback, error);
    }

    async offer(request: Promise<any>, callback: (data: any) => any, error?: string): Promise<any> {
        return this.baseFunction(request, callback, error);
    }

    async issue(request: Promise<any>, callback: (data: any) => any, error?: string): Promise<any> {
        return this.baseFunction(request, callback, error);
    }
}
