/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import { createClient } from "@libsql/client";
import { Connection as IConnection, Query, ExecuteResult } from './types';

class Connection implements IConnection {
    private client: any;

    constructor(url: string, token: string) {
        this.client = createClient({
            url: url,
            authToken: token
        });
    }

    async execute(query: Query): Promise<ExecuteResult> {
        return await this.client.execute(query);
    }
}

export default Connection;

