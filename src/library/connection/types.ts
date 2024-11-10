/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

export interface Connection {
    url: string;
    token: string;
    requests: Array<{ type: string; stmt: { sql: string; named_args: any[] }; identifier: string }>;
    addRequest(params: RequestParams): void;
    execute(): Promise<{ [key: string]: any }>;
}

export interface RequestParams {
    query?: string;
    args?: any[];
    identifier?: string;
}
