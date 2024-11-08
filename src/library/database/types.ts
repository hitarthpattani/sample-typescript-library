export interface Attribute {
    name: string;
    type: string;
    properties?: string[];
}

export interface Model {
    name: string;
    attributes: Record<string, Attribute>;
    createTable: (identifier?: string) => void;
    insert: (data: Record<string, any>, identifier?: string) => void;
    update: (data: Record<string, any>, where: any, identifier?: string) => void;
    select: (attributes: string[], where: any, orderBy: any[], identifier?: string) => void;
    delete: (where: any, identifier?: string) => void;
}
