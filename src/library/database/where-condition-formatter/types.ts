/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

export interface Condition {
    field: string;
    value: any;
    operator: string;
}

export interface Group {
    logic: string;
    conditions: Array<Condition | Group>;
}
