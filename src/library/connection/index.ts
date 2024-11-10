/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import { Connection as IConnection } from './types';

class Connection implements IConnection {
    url: string;
    token: string;

    constructor(url: string = '', token: string = '') {
        this.url = `${url}/v2/pipeline`;
        this.token = token;
    }

    getUrl() {
        return this.url
    }

    getToken() {
        return this.token
    }
}

export default Connection;
