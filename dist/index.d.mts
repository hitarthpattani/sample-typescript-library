/**
 * Copyright © Adobe, Inc. All rights reserved.
 */
interface ExecuteResult {
    rows: any[];
}
interface Query {
    sql: string;
    args?: any[];
}
interface Connection$1 {
    execute(query: Query): Promise<ExecuteResult>;
}

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

/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

declare class Database {
    private connection;
    constructor(connection: Connection$1);
    define(name: string, attributes: Record<string, Attribute>): Model;
    createTable(model: Model): Promise<void>;
    select(model: Model, options?: Options): Promise<any[]>;
    insert(model: Model, data: Record<string, any>): Promise<void>;
    update(model: Model, data: Record<string, any>, options?: Options): Promise<void>;
    delete(model: Model, options?: Options): Promise<void>;
}

/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

declare class Connection implements Connection$1 {
    private client;
    constructor(url: string, token: string);
    execute(query: Query): Promise<ExecuteResult>;
}

export { Connection, Database };
