/**
 * Copyright © Adobe, Inc. All rights reserved.
 */
interface Connection$1 {
    url: string;
    token: string;
    requests: Array<{
        type: string;
        stmt: {
            sql: string;
            named_args: any[];
        };
        identifier: string;
    }>;
    addRequest(params: RequestParams): void;
    execute(): Promise<{
        [key: string]: any;
    }>;
}
interface RequestParams {
    query?: string;
    args?: any[];
    identifier?: string;
}

/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

declare class Connection implements Connection$1 {
    url: string;
    token: string;
    requests: Array<{
        type: string;
        stmt: {
            sql: string;
            named_args: any[];
        };
        identifier: string;
    }>;
    constructor(url?: string, token?: string);
    addRequest({ query, args, identifier }: RequestParams): void;
    execute(): Promise<{
        [key: string]: any;
    }>;
}

export { Connection };
