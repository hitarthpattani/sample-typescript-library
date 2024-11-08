/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import { Condition, Group, Where } from './types';

class WhereConditionFormatter {
    static buildCondition(condition: Condition): string {
        const { field, value, operator } = condition;
        const formattedValue = typeof value === 'string' ? `'${value}'` : value;
        return `${field} ${operator} ${formattedValue}`;
    }

    static buildGroup(group: Group): string {
        const conditions = group.conditions.map(cond => {
            if ('conditions' in cond) {
                return `(${WhereConditionFormatter.buildGroup(cond as Group)})`;
            }
            return WhereConditionFormatter.buildCondition(cond as Condition);
        });
        return conditions.join(` ${group.logic} `);
    }

    static format(where: Where): string {
        if (!where || Object.keys(where).length === 0) {
            return '';
        }

        if ('conditions' in where) {
            return `WHERE ${WhereConditionFormatter.buildGroup(where as Group)}`;
        } else {
            return `WHERE ${WhereConditionFormatter.buildCondition(where as Condition)}`;
        }
    }
}

export default WhereConditionFormatter;
