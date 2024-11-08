/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import fetch from 'node-fetch';
import { IConnection, IRequest, IFetchResult } from './types';

class Connection implements IConnection {
    url: string;
    token: string;
    requests: IRequest[];

    constructor(url: string = '', token: string = '') {
        this.url = `${url}/v2/pipeline`;
        this.token = token;
        this.requests = [];
    }

    addRequest(query: string = '', args: any[] = [], identifier: string = ''): void {
        this.requests.push({ type: 'execute', stmt: { sql: query, named_args: args }, identifier });
    }

    async execute(): Promise<{ [key: string]: any }> {
        if (this.requests.length === 0) {
            throw new Error('No requests to execute');
        }

        this.requests.push({ type: 'close' });

        console.log(JSON.stringify(this.requests));

        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requests: this.requests }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json() as IFetchResult;

            console.log(JSON.stringify(result));

            const responses: { [key: string]: any } = {};

            this.requests.forEach((req, index) => {
                if (req.type === 'execute') {
                    const res = result.results[index];

                    if (res.response.type === 'error') {
                        responses[req.identifier!] = {
                            query: req.stmt!.sql,
                            error: res.response.error,
                        };
                    } else if (res.response.type === 'execute') {
                        responses[req.identifier!] = {
                            query: req.stmt!.sql,
                            result: res.response.result,
                        };
                    }
                }
            });

            this.requests = [];

            return responses;
        } catch (err) {
            console.error('Execution error:', err);
            throw err;
        }
    }
}

export default Connection;

