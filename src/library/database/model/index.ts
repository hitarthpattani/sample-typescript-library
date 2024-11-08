/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import Connection from '../../connection';
import WhereConditionFormatter from '../where-condition-formatter';
import OrderByFormatter from '../order-by-formatter';
import AttributeValidator from '../attribute-validator';
import { Attribute, Model as IModel } from "./types";

class Model implements IModel {
    name: string;
    attributes: Record<string, Attribute>;
    private connection: Connection;

    constructor(name: string, attributes: Record<string, Attribute>, connection: Connection) {
        this.name = name;
        this.attributes = attributes;
        this.connection = connection;
    }

    createTable(identifier: string = ''): void {
        const columns = Object.entries(this.attributes)
            .map(([_, attr]) => {
                let columnDef = `${attr.name} ${attr.type}`;
                if (Array.isArray(attr.properties)) {
                    columnDef += ' ' + attr.properties.join(' ');
                }
                return columnDef;
            })
            .join(', ');

        const query = `CREATE TABLE IF NOT EXISTS ${this.name} (${columns})`;

        this.connection.addRequest(query, [], identifier);
    }

    insert(data: Record<string, any> = {}, identifier: string = ''): void {
        AttributeValidator.validateData(this, data);

        const attributes = Object.keys(data);

        const values = attributes.map(attr => {
            const value = data[attr];
            return typeof value === 'string' ? `'${value}'` : value;
        }).join(', ');

        const query = `INSERT INTO ${this.name} (${attributes.join(', ')}) VALUES (${values})`;

        this.connection.addRequest(query, [], identifier);
    }

    update(data: Record<string, any> = {}, where: any = {}, identifier: string = ''): void {
        AttributeValidator.validateData(this, data);
        AttributeValidator.validateWhere(this, where);

        const attributes = Object.keys(data);

        const values = attributes.map(attr => {
            const value = data[attr];
            return `${attr} = ${typeof value === 'string' ? `'${value}'` : value}`;
        }).join(', ');

        const whereClause = WhereConditionFormatter.format(where);
        const query = `UPDATE ${this.name} SET ${values} ${whereClause}`;

        this.connection.addRequest(query, [], identifier);
    }

    select(attributes: string[] = [], where: any = {}, orderBy: any[] = [], identifier: string = ''): void {
        const modelAttributes = Object.keys(this.attributes).map(key => this.attributes[key].name);
        const selectedAttributes = attributes.length > 0 ? attributes : modelAttributes;

        selectedAttributes.forEach(attr => {
            if (!modelAttributes.includes(attr)) {
                throw new Error(`Attribute "${attr}" is not defined in model "${this.name}"`);
            }
        });

        AttributeValidator.validateWhere(this, where);
        AttributeValidator.validateOrderBy(this, orderBy);

        const whereClause = WhereConditionFormatter.format(where);
        const orderByClause = OrderByFormatter.format(orderBy);
        const query = `SELECT ${selectedAttributes.join(', ')} FROM ${this.name} ${whereClause} ${orderByClause}`;

        this.connection.addRequest(query, [], identifier);
    }

    delete(where: any = {}, identifier: string = ''): void {
        AttributeValidator.validateWhere(this, where);

        const whereClause = WhereConditionFormatter.format(where);
        const query = `DELETE FROM ${this.name} ${whereClause}`;

        this.connection.addRequest(query, [], identifier);
    }
}

export default Model;
