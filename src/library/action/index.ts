/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

const { Core } = require('@adobe/aio-sdk')

import Response from '../response';
import { HttpStatus } from '../constants';
import ActionValidator from '../action-validator';
import Parameters from '../parameters';

class Action {
    /**
     * @param name
     * @param requiredParams
     * @param requiredHeaders
     * @param action
     * @returns {(function(*): Promise<any>)|*}
     */
    static init(
        name: string = 'main',
        requiredParams: string[] = [],
        requiredHeaders: string[] = ['Authorization'],
        action: (params: { [key: string]: any }) => Promise<any> = async (params) => { return {}; }
    ): (params: { [key: string]: any }) => Promise<any> {
        return async (params: { [key: string]: any }) => {
            // create a Logger
            const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' });
            const response = new Response(logger);

            try {
                // 'info' is the default level if not set
                logger.info(`Calling the ${name} action`);

                // log parameters, only if params.LOG_LEVEL === 'debug'
                logger.debug(Parameters.stringify(params));

                // check for missing request input parameters and headers
                const errorMessage = ActionValidator.checkMissingRequestInputs(
                    params,
                    requiredParams,
                    requiredHeaders
                );
                if (errorMessage) {
                    // return and log client errors
                    return response.error(HttpStatus.BAD_REQUEST, errorMessage);
                }

                const actionResult = await action(params);

                const result = response.success(actionResult);

                // log the response status code
                logger.info(`${result.statusCode}: successful request`);
                return result;
            } catch (error) {
                // log any server errors
                logger.error(error);
                // return with 500
                return response.error(HttpStatus.INTERNAL_ERROR, "server error");
            }
        };
    }
}

export default Action;
