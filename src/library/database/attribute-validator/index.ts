/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

class AttributeValidator {
    static validOperators = [
        '=', '!=', '<>', '>', '>=', '<', '<=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN', 'BETWEEN', 'IS', 'IS NOT'
    ];

    static validLogics = ['AND', 'OR'];
    static validDirections = ['ASC', 'DESC'];

    static validateData(model: { attributes: { [key: string]: { name: string } }, name: string }, data: { [key: string]: any }) {
        const modelAttributes = Object.keys(model.attributes).map(key => model.attributes[key].name);
        const attributes = Object.keys(data);

        attributes.forEach(attr => {
            if (!modelAttributes.includes(attr)) {
                throw new Error(`Attribute "${attr}" is not defined in model "${model.name}"`);
            }
        });
    }

    static validateWhere(model: { attributes: { [key: string]: { name: string } }, name: string }, where: any) {
        const modelAttributes = Object.keys(model.attributes).map(key => model.attributes[key].name);

        const validateCondition = (condition: { field: string, operator: string }) => {
            if (!modelAttributes.includes(condition.field)) {
                throw new Error(`Attribute "${condition.field}" is not defined in model "${model.name}"`);
            }
            if (!AttributeValidator.validOperators.includes(condition.operator)) {
                throw new Error(`Operator "${condition.operator}" is not valid in SQL`);
            }
        };

        const validateGroup = (group: { logic: string, conditions: any[] }) => {
            if (!AttributeValidator.validLogics.includes(group.logic)) {
                throw new Error(`Logic "${group.logic}" is not valid. It should be either "AND" or "OR".`);
            }
            group.conditions.forEach(cond => {
                if (cond.conditions) {
                    validateGroup(cond);
                } else {
                    validateCondition(cond);
                }
            });
        };

        if (where.conditions) {
            validateGroup(where);
        } else {
            validateCondition(where);
        }
    }

    static validateOrderBy(model: { attributes: { [key: string]: { name: string } }, name: string }, orderBy: { field: string, direction: string }[]) {
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
