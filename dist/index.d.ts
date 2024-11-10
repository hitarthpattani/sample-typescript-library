/**
 * Copyright © Adobe, Inc. All rights reserved.
 */
interface RequestParams {
    query?: string;
    args?: any[];
    identifier?: string;
}
interface Request {
    type: string;
    stmt?: {
        sql: string;
        named_args: any[];
    };
    identifier?: string;
}
interface Connection$1 {
    url: string;
    token: string;
    requests: Request[];
    addRequest(params: RequestParams): void;
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
    addRequest({ query, args, identifier }: RequestParams): void;
    execute(): Promise<{
        [key: string]: any;
    }>;
}

export { Connection };
