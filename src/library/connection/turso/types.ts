/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import { Connection as BaseConnection } from '../types';

export interface Request {
    type: string;
    stmt: { sql: string; named_args: any[] };
    identifier: string;
}

export interface Connection extends BaseConnection {
    url: string;
    token: string;
    requests: Request[];
}
