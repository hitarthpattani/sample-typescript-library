/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import { Connection, ExecuteResult } from '../Connection/types';
import { Model, Options, Attribute } from './types';

class Database {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    define(name: string, attributes: Record<string, Attribute>): void {
        (this as any)[name] = {
            name: name,
            attributes: attributes,
        };
    }

    async createTable(model: Model): Promise<void> {
        const columns = Object.entries(model.attributes)
            .map(([_, attr]) => `${attr.name} ${attr.type}`)
            .join(', ');
        const query = `CREATE TABLE ${model.name} (${columns})`;
        await this.connection.execute({ sql: query, args: [] });
    }

    async select(model: Model, options: Options = {}): Promise<any[]> {
        const attributes = options.attributes || Object.keys(model.attributes).map(key => model.attributes[key].name);
        const where = options.where ? `WHERE ${options.where}` : '';
        const query = `SELECT ${attributes.join(', ')} FROM ${model.name} ${where}`;
        const result: ExecuteResult = await this.connection.execute({ sql: query, args: [] });
        return result.rows;
    }

    async insert(model: Model, data: Record<string, any>): Promise<void> {
        const attributes = Object.keys(data);
        const values = attributes.map(attribute => '?').join(', ');
        const query = `INSERT INTO ${model.name} (${attributes.join(', ')}) VALUES (${values})`;
        await this.connection.execute({ sql: query, args: Object.values(data) });
    }

    async update(model: Model, data: Record<string, any>, options: Options = {}): Promise<void> {
        const attributes = Object.keys(data);
        const values = attributes.map(attribute => `${attribute} = ?`).join(', ');
        const where = options.where ? `WHERE ${options.where}` : '';
        const query = `UPDATE ${model.name} SET ${values} ${where}`;
        await this.connection.execute({ sql: query, args: Object.values(data) });
    }

    async delete(model: Model, options: Options = {}): Promise<void> {
        const where = options.where ? `WHERE ${options.where}` : '';
        const query = `DELETE FROM ${model.name} ${where}`;
        await this.connection.execute({ sql: query, args: [] });
    }
}

export default Database;
