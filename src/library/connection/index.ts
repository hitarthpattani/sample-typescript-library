/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import fetch from 'node-fetch';
import { Request, Connection as IConnection, Result, ExecuteResponse } from './types';

class Connection implements IConnection {
    url: string;
    token: string;
    requests: Request[];

    constructor(url: string = '', token: string = '') {
        this.url = `${url}/v2/pipeline`;
        this.token = token;
        this.requests = [];
    }

    addRequest(query: string = '', args: any[] = [], identifier: string = ''): void {
        const request: Request = {
            type: "execute",
            stmt: {
                sql: query,
                named_args: args
            },
            identifier
        };
        this.requests.push(request);
    }

    async execute(): Promise<Record<string, any>> {
        if (this.requests.length === 0) {
            throw new Error("No requests to execute");
        }

        this.requests.push({ type: "close" });

        console.log(JSON.stringify(this.requests));

        try {
            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requests: this.requests }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: unknown = await response.json();

            console.log(JSON.stringify(result));

            const responses: Record<string, any> = {};

            this.requests.forEach((req, index) => {
                if (req.type === "execute") {
                    const res: ExecuteResponse = result.results[index];

                    if (res.type === "error") {
                        responses[req.identifier] = {
                            query: req.stmt?.sql,
                            error: res.error,
                        };
                    } else if (res.response?.type === "execute") {
                        responses[req.identifier] = {
                            query: req.stmt?.sql,
                            result: res.response.result,
                        };
                    }
                }
            });

            this.requests = [];

            return responses;
        } catch (err) {
            console.error("Execution error:", err);
            throw err;
        }
    }
}

export default Connection;
