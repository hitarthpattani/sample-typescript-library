/**
 * Copyright © Adobe, Inc. All rights reserved.
 */
interface Request {
    type: string;
    stmt: {
        sql: string;
        named_args: any[];
    };
    identifier: string;
}
interface Connection$1 {
    url: string;
    token: string;
    requests: Request[];
    addRequest(query: string, args: any[], identifier: string): void;
    execute(): Promise<{
        [key: string]: any;
    }>;
}

/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

declare class Connection implements Connection$1 {
    url: string;
    token: string;
    requests: Request[];
    constructor(url?: string, token?: string);
    addRequest(query?: string, args?: any[], identifier?: string): void;
    execute(): Promise<{
        [key: string]: any;
    }>;
}

/**
 * Copyright © Adobe, Inc. All rights reserved.
 */
interface Model {
    name: string;
    attributes: {
        [key: string]: {
            name: string;
            type: string;
            properties?: string[];
        };
    };
    createTable: (identifier?: string) => void;
    insert: (data?: {
        [key: string]: any;
    }, identifier?: string) => void;
    update: (data?: {
        [key: string]: any;
    }, where?: any, identifier?: string) => void;
    select: (attributes?: string[], where?: any, orderBy?: {
        field: string;
        direction: string;
    }[], identifier?: string) => void;
    delete: (where?: any, identifier?: string) => void;
}

/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

declare class Database {
    connection: Connection$1;
    constructor(connection: Connection$1);
    define(name: string, attributes?: {
        [key: string]: {
            name: string;
            type: string;
            properties?: string[];
        };
    }): void;
    createTable(model: Model, identifier?: string): void;
    select(model: Model, attributes?: string[], where?: any, orderBy?: {
        field: string;
        direction: string;
    }[], identifier?: string): void;
    insert(model: Model, data?: {
        [key: string]: any;
    }, identifier?: string): void;
    update(model: Model, data?: {
        [key: string]: any;
    }, where?: any, identifier?: string): void;
    delete(model: Model, where?: any, identifier?: string): void;
    execute(): Promise<{
        [key: string]: any;
    }>;
}

export { Connection, Database };
