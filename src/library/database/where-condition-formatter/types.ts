/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

export interface Condition {
    field: string;
    value: string | number;
    operator: string;
}

export interface Group {
    logic: string;
    conditions: (Condition | Group)[];
}
