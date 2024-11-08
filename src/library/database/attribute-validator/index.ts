/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import { Model } from './types'
import { Order } from '../order-by-formatter/types'
import { Condition, Group } from '../where-condition-formatter/types'

class AttributeValidator {
    static validOperators = [
        '=', '!=', '<>', '>', '>=', '<', '<=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN', 'BETWEEN', 'IS', 'IS NOT'
    ];

    static validLogics = ['AND', 'OR'];
    static validDirections = ['ASC', 'DESC'];

    static validateData(model: Model, data: { [key: string]: any }): void {
        const modelAttributes = Object.keys(model.attributes).map(key => model.attributes[key].name);
        const attributes = Object.keys(data);

        attributes.forEach(attr => {
            if (!modelAttributes.includes(attr)) {
                throw new Error(`Attribute "${attr}" is not defined in model "${model.name}"`);
            }
        });
    }

    static validateWhere(model: Model, where: Condition | Group): void {
        const modelAttributes = Object.keys(model.attributes).map(key => model.attributes[key].name);

        const validateCondition = (condition: Condition) => {
            if (!modelAttributes.includes(condition.field)) {
                throw new Error(`Attribute "${condition.field}" is not defined in model "${model.name}"`);
            }
            if (!AttributeValidator.validOperators.includes(condition.operator)) {
                throw new Error(`Operator "${condition.operator}" is not valid in SQL`);
            }
        };

        const validateGroup = (group: Group) => {
            if (!AttributeValidator.validLogics.includes(group.logic)) {
                throw new Error(`Logic "${group.logic}" is not valid. It should be either "AND" or "OR".`);
            }
            group.conditions.forEach(cond => {
                if ('conditions' in cond) {
                    validateGroup(cond);
                } else {
                    validateCondition(cond);
                }
            });
        };

        if ('conditions' in where) {
            validateGroup(where);
        } else {
            validateCondition(where);
        }
    }

    static validateOrderBy(model: Model, orderBy: Order[]): void {
        const modelAttributes = Object.keys(model.attributes).map(key => model.attributes[key].name);

        orderBy.forEach(order => {
            if (!modelAttributes.includes(order.field)) {
                throw new Error(`Attribute "${order.field}" is not defined in model "${model.name}"`);
            }
            if (!AttributeValidator.validDirections.includes(order.direction)) {
                throw new Error(`Direction "${order.direction}" is not valid. It should be either "ASC" or "DESC".`);
            }
        });
    }
}

export default AttributeValidator;
