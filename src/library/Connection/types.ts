/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

export interface ExecuteResult {
    rows: any[];
}

export interface Query {
    sql: string;
    args?: any[];
}

export interface Connection {
    execute(query: Query): Promise<ExecuteResult>;
}
