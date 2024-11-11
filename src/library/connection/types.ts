/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

export interface Request {
    type: string;
    stmt: { sql: string; named_args: any[] };
    identifier: string;
}

export interface Connection {
    url: string;
    token: string;
    requests: Request[];
    addRequest(query: string, args: any[], identifier: string): void;
    execute(): Promise<{ [key: string]: any }>;
}
