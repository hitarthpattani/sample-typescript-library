export interface Condition {
    field: string;
    operator: string;
    value: any;
}

export interface Group {
    logic: string;
    conditions: (Condition | Group)[];
}

export type Where = Condition | Group;
