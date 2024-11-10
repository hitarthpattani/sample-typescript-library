/**
 * Copyright © Adobe, Inc. All rights reserved.
 */
interface Connection$1 {
    url: string;
    token: string;
}

/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

declare class Connection implements Connection$1 {
    url: string;
    token: string;
    constructor(url?: string, token?: string);
    getUrl(): string;
    getToken(): string;
}

export { Connection };
