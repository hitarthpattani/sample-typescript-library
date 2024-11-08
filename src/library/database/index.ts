/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import Connection from '../connection';
import { Attribute } from "./model/types";
import Model from './model'

class Database {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    define(name: string, attributes: Record<string, Attribute> = {}): void {
        (this as any)[name.toLowerCase()] = new Model(name, attributes, this.connection);
    }

    async execute(): Promise<any> {
        try {
            const result = await this.connection.execute();
            console.log("Execution result:", JSON.stringify(result));
            return result;
        } catch (err) {
            console.error("Execution error:", err);
            throw err;
        }
    }
}

export default Database;
