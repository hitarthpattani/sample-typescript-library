/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import WhereConditionFormatter from './where-condition-formatter';
import OrderByFormatter from './order-by-formatter';
import AttributeValidator from './attribute-validator';
import { Connection } from '../connection/types';
import { Model } from './types'

class Database {
    connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    define(name: string, attributes: { [key: string]: { name: string; type: string; properties?: string[] } } = {}): void {
        const model: Model = {
            name: name,
            attributes: attributes,
            createTable: (identifier = '') => this.createTable(model, identifier),
            insert: (data = {}, identifier = '') => this.insert(model, data, identifier),
            update: (data = {}, where = {}, identifier = '') => this.update(model, data, where, identifier),
            select: (attributes = [], where = {}, orderBy = [], identifier = '') => this.select(model, attributes, where, orderBy, identifier),
            delete: (where = {}, identifier = '') => this.delete(model, where, identifier),
        };
        (this as any)[name.toLowerCase()] = model;
    }

    createTable(model: Model, identifier: string = ''): void {
        const columns = Object.entries(model.attributes)
            .map(([_, attr]) => {
                let columnDef = `${attr.name} ${attr.type}`;
                if (Array.isArray(attr.properties)) {
                    columnDef += ' ' + attr.properties.join(' ');
                }
                return columnDef;
            })
            .join(', ');

        const query = `CREATE TABLE IF NOT EXISTS ${model.name} (${columns})`;

        this.connection.addRequest(query, [], identifier);
    }

    select(model: Model, attributes: string[] = [], where: any = {}, orderBy: { field: string; direction: string }[] = [], identifier: string = ''): void {
        const modelAttributes = Object.keys(model.attributes).map(key => model.attributes[key].name);
        const selectedAttributes = attributes.length > 0 ? attributes : modelAttributes;

        selectedAttributes.forEach(attr => {
            if (!modelAttributes.includes(attr)) {
                throw new Error(`Attribute "${attr}" is not defined in model "${model.name}"`);
            }
        });

        AttributeValidator.validateWhere(model, where);
        AttributeValidator.validateOrderBy(model, orderBy);

        const whereClause = WhereConditionFormatter.format(where);
        const orderByClause = OrderByFormatter.format(orderBy);
        const query = `SELECT ${selectedAttributes.join(', ')} FROM ${model.name} ${whereClause} ${orderByClause}`;

        this.connection.addRequest(query, [], identifier);
    }

    insert(model: Model, data: { [key: string]: any } = {}, identifier: string = ''): void {
        AttributeValidator.validateData(model, data);

        const attributes = Object.keys(data);

        const values = attributes.map(attr => {
            const value = data[attr];
            return typeof value === 'string' ? `'${value}'` : value;
        }).join(', ');

        const query = `INSERT INTO ${model.name} (${attributes.join(', ')}) VALUES (${values})`;

        this.connection.addRequest(query, [], identifier);
    }

    update(model: Model, data: { [key: string]: any } = {}, where: any = {}, identifier: string = ''): void {
        AttributeValidator.validateData(model, data);
        AttributeValidator.validateWhere(model, where);

        const attributes = Object.keys(data);

        const values = attributes.map(attr => {
            const value = data[attr];
            return `${attr} = ${typeof value === 'string' ? `'${value}'` : value}`;
        }).join(', ');

        const whereClause = WhereConditionFormatter.format(where);
        const query = `UPDATE ${model.name} SET ${values} ${whereClause}`;

        this.connection.addRequest(query, [], identifier);
    }

    delete(model: Model, where: any = {}, identifier: string = ''): void {
        AttributeValidator.validateWhere(model, where);

        const whereClause = WhereConditionFormatter.format(where);
        const query = `DELETE FROM ${model.name} ${whereClause}`;

        this.connection.addRequest(query, [], identifier);
    }

    async execute(): Promise<{ [key: string]: any }> {
        try {
            const result = await this.connection.execute();
            console.log("Execution result:", typeof result === 'object' ? JSON.stringify(result) : result);
            return result;
        } catch (err) {
            console.error("Execution error:", err);
            throw err;
        }
    }
}

export default Database;
