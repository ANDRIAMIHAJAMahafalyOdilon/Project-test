declare module "mongodb-memory-server" {
  export class MongoMemoryServer {
    static create(): Promise<MongoMemoryServer>;
    getUri(): Promise<string>;
    stop(): Promise<void>;
  }
}
