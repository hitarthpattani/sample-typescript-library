/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

class OrderByFormatter {
    static format(orderBy: { field: string; direction: string }[]): string {
        if (!orderBy || orderBy.length === 0) {
            return '';
        }

        return `ORDER BY ${orderBy.map(order => `${order.field} ${order.direction}`).join(', ')}`;
    }
}

export default OrderByFormatter;
