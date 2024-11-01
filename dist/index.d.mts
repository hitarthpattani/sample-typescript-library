/**
 * Copyright © Adobe, Inc. All rights reserved.
 */
interface Attribute {
    name: string;
    type: string;
}
interface Model {
    name: string;
    attributes: Record<string, Attribute>;
}
interface Options {
    attributes?: string[];
    where?: string;
}
interface ExecuteResult {
    rows: any[];
}

/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

declare class Database {
    private connection;
    constructor(url: string, token: string);
    define(name: string, attributes: Record<string, Attribute>): void;
    createTable(model: Model): Promise<void>;
    select(model: Model, options?: Options): Promise<any[]>;
    insert(model: Model, data: Record<string, any>): Promise<void>;
    update(model: Model, data: Record<string, any>, options?: Options): Promise<void>;
    delete(model: Model, options?: Options): Promise<void>;
    execute(query: {
        sql: string;
        args: any[];
    }): Promise<ExecuteResult>;
}

export { Database };
