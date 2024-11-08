/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

export interface IRequest {
    type: string;
    stmt?: {
        sql: string;
        named_args: any[];
    };
    identifier?: string;
}

export interface IConnection {
    url: string;
    token: string;
    requests: IRequest[];

    addRequest(query: string, args: any[], identifier: string): void;
    execute(): Promise<{ [key: string]: any }>;
}

export interface IFetchResult {
    results: Array<{
        type: string;
        response: {
            type: string;
            result?: any;
            error?: string;
        };
    }>;
}
