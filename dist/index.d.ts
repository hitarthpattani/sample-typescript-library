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
interface Connection {
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
    constructor(connection: Connection);
    define(name: string, attributes: Record<string, Attribute>): void;
    createTable(model: Model): Promise<void>;
    select(model: Model, options?: Options): Promise<any[]>;
    insert(model: Model, data: Record<string, any>): Promise<void>;
    update(model: Model, data: Record<string, any>, options?: Options): Promise<void>;
    delete(model: Model, options?: Options): Promise<void>;
}

export { Database };
