/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import AttributeValidator from '../../src/library/database/attribute-validator';
import { Model } from '../../src/library/database/attribute-validator/types';
import { Order } from '../../src/library/database/order-by-formatter/types';
import { Condition, Group } from '../../src/library/database/where-condition-formatter/types';

describe('AttributeValidator', () => {
    const model: Model = {
        name: 'TestModel',
        attributes: {
            id: { name: 'id' },
            name: { name: 'name' },
            age: { name: 'age' }
        }
    };

    describe('validateData', () => {
        it('should validate data correctly', () => {
            const data = { id: 1, name: 'John' };
            expect(() => AttributeValidator.validateData(model, data)).not.toThrow();
        });

        it('should throw an error for invalid attribute', () => {
            const data = { id: 1, invalidAttr: 'test' };
            expect(() => AttributeValidator.validateData(model, data)).toThrow('Attribute "invalidAttr" is not defined in model "TestModel"');
        });
    });

    describe('validateWhere', () => {
        it('should validate where condition correctly', () => {
            const where: Condition = { field: 'name', value: 'John', operator: '=' };
            expect(() => AttributeValidator.validateWhere(model, where)).not.toThrow();
        });

        it('should throw an error for invalid attribute in where condition', () => {
            const where: Condition = { field: 'invalidAttr', value: 'test', operator: '=' };
            expect(() => AttributeValidator.validateWhere(model, where)).toThrow('Attribute "invalidAttr" is not defined in model "TestModel"');
        });

        it('should throw an error for invalid operator in where condition', () => {
            const where: Condition = { field: 'name', value: 'John', operator: 'INVALID' };
            expect(() => AttributeValidator.validateWhere(model, where)).toThrow('Operator "INVALID" is not valid in SQL');
        });

        it('should validate where group correctly', () => {
            const where: Group = {
                logic: 'AND',
                conditions: [
                    { field: 'name', value: 'John', operator: '=' },
                    { field: 'age', value: 30, operator: '>' }
                ]
            };
            expect(() => AttributeValidator.validateWhere(model, where)).not.toThrow();
        });

        it('should throw an error for invalid logic in where group', () => {
            const where: Group = {
                logic: 'INVALID',
                conditions: [
                    { field: 'name', value: 'John', operator: '=' },
                    { field: 'age', value: 30, operator: '>' }
                ]
            };
            expect(() => AttributeValidator.validateWhere(model, where)).toThrow('Logic "INVALID" is not valid. It should be either "AND" or "OR".');
        });
    });

    describe('validateOrderBy', () => {
        it('should validate order by correctly', () => {
            const orderBy: Order[] = [{ field: 'name', direction: 'ASC' }];
            expect(() => AttributeValidator.validateOrderBy(model, orderBy)).not.toThrow();
        });

        it('should throw an error for invalid attribute in order by', () => {
            const orderBy: Order[] = [{ field: 'invalidAttr', direction: 'ASC' }];
            expect(() => AttributeValidator.validateOrderBy(model, orderBy)).toThrow('Attribute "invalidAttr" is not defined in model "TestModel"');
        });

        it('should throw an error for invalid direction in order by', () => {
            const orderBy: Order[] = [{ field: 'name', direction: 'INVALID' }];
            expect(() => AttributeValidator.validateOrderBy(model, orderBy)).toThrow('Direction "INVALID" is not valid. It should be either "ASC" or "DESC".');
        });
    });
});
