/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import { Order } from './types'

class OrderByFormatter {
    static format(orderBy: Order[]): string {
        if (!orderBy || orderBy.length === 0) {
            return '';
        }

        return `ORDER BY ${orderBy.map(order => `${order.field} ${order.direction}`).join(', ')}`;
    }
}

export default OrderByFormatter;
