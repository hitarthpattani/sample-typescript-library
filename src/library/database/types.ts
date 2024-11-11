/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

export interface Model {
    name: string;
    attributes: { [key: string]: { name: string; type: string; properties?: string[] } };
    createTable: (identifier?: string) => void;
    insert: (data?: { [key: string]: any }, identifier?: string) => void;
    update: (data?: { [key: string]: any }, where?: any, identifier?: string) => void;
    select: (attributes?: string[], where?: any, orderBy?: { field: string; direction: string }[], identifier?: string) => void;
    delete: (where?: any, identifier?: string) => void;
}
