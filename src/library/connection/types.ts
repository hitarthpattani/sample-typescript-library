/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

export interface Request {
    type: string;
    stmt?: {
        sql: string;
        named_args: any[];
    };
    identifier?: string;
}

export interface ExecuteResponse {
    type: string;
    response?: {
        type: string;
        result: any;
    };
    error?: string;
}

export interface Result {
    results: ExecuteResponse[];
}

export interface Connection {
    url: string;
    token: string;
    requests: Request[];
    addRequest(query: string, args: any[], identifier: string): void;
    execute(): Promise<Record<string, any>>;
}

