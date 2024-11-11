/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import { Condition, Group } from './types'

class WhereConditionFormatter {
    static buildCondition(condition: Condition): string {
        const { field, value, operator } = condition;
        const formattedValue = typeof value === 'string' ? `'${value}'` : value;
        return `${field} ${operator} ${formattedValue}`;
    }

    static buildGroup(group: Group): string {
        const conditions = group.conditions.map(cond => {
            if ('conditions' in cond) {
                return `(${WhereConditionFormatter.buildGroup(cond)})`;
            }
            return WhereConditionFormatter.buildCondition(cond);
        });
        return conditions.join(` ${group.logic} `);
    }

    static format(where: Condition | Group): string {
        if (!where || Object.keys(where).length === 0) {
            return '';
        }

        if ('conditions' in where) {
            return `WHERE ${WhereConditionFormatter.buildGroup(where)}`;
        } else {
            return `WHERE ${WhereConditionFormatter.buildCondition(where)}`;
        }
    }
}

export default WhereConditionFormatter;
