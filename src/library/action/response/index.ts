/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import { HttpStatus } from '../../constants';

class ActionResponse {
    logger: any;

    constructor(logger: any) {
        this.logger = logger;
    }

    /**
     * Returns a success response object, this method should be called on the handlers actions
     *
     * @param response a descriptive message of the result
     *        e.g. 'missing xyz parameter'
     * @returns the response object, ready to be returned from the action main's function.
     */
    success(response: object | string): { statusCode: number; body: object | string } {
        return {
            statusCode: HttpStatus.OK,
            body: response
        };
    }

    /**
     * Returns an error response object, this method should be called on the handlers actions
     *
     * @param statusCode the status code.
     *        e.g. 400
     * @param error a descriptive message of the result
     *        e.g. 'missing xyz parameter'
     * @returns the response object, ready to be returned from the action main's function.
     */
    error(statusCode: number, error: string): { error: { statusCode: number; body: { error: string } } } {
        if (this.logger && typeof this.logger.info === 'function') {
            this.logger.info(`${statusCode}: ${error}`);
        }

        return {
            error: {
                statusCode,
                body: {
                    error: error
                }
            }
        };
    }
}

export default ActionResponse;
