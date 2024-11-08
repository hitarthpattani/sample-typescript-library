/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import WhereConditionFormatter from '../../src/library/database/where-condition-formatter';
import { Condition, Group } from '../../src/library/database/where-condition-formatter/types';

describe('WhereConditionFormatter', () => {
    describe('buildCondition', () => {
        it('should build a condition string for a numeric value', () => {
            const condition: Condition = { field: 'age', value: 30, operator: '=' };
            expect(WhereConditionFormatter.buildCondition(condition)).toBe('age = 30');
        });

        it('should build a condition string for a string value', () => {
            const condition: Condition = { field: 'name', value: 'John', operator: '=' };
            expect(WhereConditionFormatter.buildCondition(condition)).toBe("name = 'John'");
        });
    });

    describe('buildGroup', () => {
        it('should build a group string with AND logic', () => {
            const group: Group = {
                logic: 'AND',
                conditions: [
                    { field: 'age', value: 30, operator: '=' },
                    { field: 'name', value: 'John', operator: '=' }
                ]
            };
            expect(WhereConditionFormatter.buildGroup(group)).toBe("age = 30 AND name = 'John'");
        });

        it('should build a nested group string', () => {
            const group: Group = {
                logic: 'OR',
                conditions: [
                    { field: 'age', value: 30, operator: '=' },
                    {
                        logic: 'AND',
                        conditions: [
                            { field: 'name', value: 'John', operator: '=' },
                            { field: 'city', value: 'New York', operator: '=' }
                        ]
                    }
                ]
            };
            expect(WhereConditionFormatter.buildGroup(group)).toBe("age = 30 OR (name = 'John' AND city = 'New York')");
        });
    });

    describe('format', () => {
        it('should return an empty string if where is undefined', () => {
            expect(WhereConditionFormatter.format(undefined as any)).toBe('');
        });

        it('should return an empty string if where is an empty object', () => {
            expect(WhereConditionFormatter.format({} as any)).toBe('');
        });

        it('should format a single condition', () => {
            const where: Condition = { field: 'age', value: 30, operator: '=' };
            expect(WhereConditionFormatter.format(where)).toBe('WHERE age = 30');
        });

        it('should format a group of conditions', () => {
            const where: Group = {
                logic: 'AND',
                conditions: [
                    { field: 'age', value: 30, operator: '=' },
                    { field: 'name', value: 'John', operator: '=' }
                ]
            };
            expect(WhereConditionFormatter.format(where)).toBe("WHERE age = 30 AND name = 'John'");
        });
    });
});
