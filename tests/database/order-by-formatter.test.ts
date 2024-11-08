/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import OrderByFormatter from '../../src/library/database/order-by-formatter';
import { Order } from '../../src/library/database/order-by-formatter/types';

describe('OrderByFormatter', () => {
    it('should return an empty string if orderBy is undefined', () => {
        expect(OrderByFormatter.format(undefined as any)).toBe('');
    });

    it('should return an empty string if orderBy is an empty array', () => {
        expect(OrderByFormatter.format([])).toBe('');
    });

    it('should format a single order correctly', () => {
        const orderBy: Order[] = [{ field: 'name', direction: 'ASC' }];
        expect(OrderByFormatter.format(orderBy)).toBe('ORDER BY name ASC');
    });

    it('should format multiple orders correctly', () => {
        const orderBy: Order[] = [
            { field: 'name', direction: 'ASC' },
            { field: 'age', direction: 'DESC' }
        ];
        expect(OrderByFormatter.format(orderBy)).toBe('ORDER BY name ASC, age DESC');
    });
});
