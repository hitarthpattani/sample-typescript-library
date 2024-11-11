/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

export interface Connection {
    addRequest(query: string, args: any[], identifier: string): void;
    execute(): Promise<{ [key: string]: any }>;
}
