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

/**
 * Copyright © Adobe, Inc. All rights reserved.
 */
declare class Action {
    /**
     * @param name
     * @param requiredParams
     * @param requiredHeaders
     * @param action
     * @returns {(function(*): Promise<any>)|*}
     */
    static init(name?: string, requiredParams?: string[], requiredHeaders?: string[], action?: (params: {
        [key: string]: any;
    }) => Promise<any>): (params: {
        [key: string]: any;
    }) => Promise<any>;
}

/**
 * Copyright © Adobe, Inc. All rights reserved.
 */
declare class ActionResponse {
    logger: any;
    constructor(logger: any);
    /**
     * Returns a success response object, this method should be called on the handlers actions
     *
     * @param response a descriptive message of the result
     *        e.g. 'missing xyz parameter'
     * @returns the response object, ready to be returned from the action main's function.
     */
    success(response: object | string): {
        statusCode: number;
        body: object | string;
    };
    /**
     * Returns an error response object, this method should be called on the handlers actions
     *
     * @param statusCode the status code.
     *        e.g. 400
     * @param error a descriptive message of the result
     *        e.g. 'missing xyz parameter'
     * @returns the response object, ready to be returned from the action main's function.
     */
    error(statusCode: number, error: string): {
        error: {
            statusCode: number;
            body: {
                error: string;
            };
        };
    };
}

/**
 * Copyright © Adobe, Inc. All rights reserved.
 */
declare class ActionValidator {
    /**
     * Returns the list of missing keys given an object and its required keys.
     * A parameter is missing if its value is undefined or ''.
     * A value of 0 or null is not considered as missing.
     *
     * @param obj object to check.
     * @param required list of required keys.
     *        Each element can be multi-level deep using a '.' separator e.g. 'myRequiredObj.myRequiredKey'
     *
     * @returns array
     * @private
     */
    static getMissingKeys(obj: {
        [key: string]: any;
    }, required: string[]): string[];
    /**
     * Returns the list of missing keys given an object and its required keys.
     * A parameter is missing if its value is undefined or ''.
     * A value of 0 or null is not considered as missing.
     *
     * @param params action input parameters.
     * @param requiredHeaders list of required input headers.
     * @param requiredParams list of required input parameters.
     *        Each element can be multi-level deep using a '.' separator e.g. 'myRequiredObj.myRequiredKey'.
     *
     * @returns string|null if the return value is not null, then it holds an error message describing the missing inputs.
     *
     */
    static checkMissingRequestInputs(params: {
        [key: string]: any;
    }, requiredParams?: string[], requiredHeaders?: string[]): string | null;
}

/**
 * Copyright © Adobe, Inc. All rights reserved.
 */
declare enum HttpStatus {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500
}

export { Action, ActionResponse, ActionValidator, Connection, Database, HttpStatus };
