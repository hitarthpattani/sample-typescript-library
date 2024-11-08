/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import { OrderBy } from "./types";

export class OrderByFormatter {
    static format(orderBy: OrderBy[]): string {
        if (!orderBy || orderBy.length === 0) {
            return '';
        }

        return `ORDER BY ${orderBy.map(order => `${order.field} ${order.direction}`).join(', ')}`;
    }
}

export default OrderByFormatter;
