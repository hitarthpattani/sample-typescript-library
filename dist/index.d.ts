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
declare class AttributeValidator {
    static validOperators: string[];
    static validLogics: string[];
    static validDirections: string[];
    static validateData(model: {
        attributes: {
            [key: string]: {
                name: string;
            };
        };
        name: string;
    }, data: {
        [key: string]: any;
    }): void;
    static validateWhere(model: {
        attributes: {
            [key: string]: {
                name: string;
            };
        };
        name: string;
    }, where: any): void;
    static validateOrderBy(model: {
        attributes: {
            [key: string]: {
                name: string;
            };
        };
        name: string;
    }, orderBy: {
        field: string;
        direction: string;
    }[]): void;
}

/**
 * Copyright © Adobe, Inc. All rights reserved.
 */
declare class OrderByFormatter {
    static format(orderBy: {
        field: string;
        direction: string;
    }[]): string;
}

export { AttributeValidator, Connection, OrderByFormatter };
