/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

export interface Attribute {
    name: string;
    type: string;
}

export interface Model {
    name: string;
    attributes: Record<string, Attribute>;
}

export interface Options {
    attributes?: string[];
    where?: string;
}
