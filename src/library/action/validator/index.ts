/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

class ActionValidator {
    /**
     * Returns the list of missing keys given an object and its required keys.
     * A parameter is missing if its value is undefined or ''.
     * A value of 0 or null is not considered as missing.
     *
     * @param obj object to check.
     * @param required list of required keys.
     *        Each element can be multi-level deep using a '.' separator e.g. 'myRequiredObj.myRequiredKey'
     *
     * @returns array
     * @private
     */
    static getMissingKeys(obj: { [key: string]: any }, required: string[]): string[] {
        return required.filter(r => {
            const splits = r.split('.');
            const last = splits[splits.length - 1];
            const traverse = splits.slice(0, -1).reduce((tObj, split) => (tObj[split] || {}), obj);
            return traverse[last] === undefined || traverse[last] === ''; // missing default params are empty string
        });
    }

    /**
     * Returns the list of missing keys given an object and its required keys.
     * A parameter is missing if its value is undefined or ''.
     * A value of 0 or null is not considered as missing.
     *
     * @param params action input parameters.
     * @param requiredHeaders list of required input headers.
     * @param requiredParams list of required input parameters.
     *        Each element can be multi-level deep using a '.' separator e.g. 'myRequiredObj.myRequiredKey'.
     *
     * @returns string|null if the return value is not null, then it holds an error message describing the missing inputs.
     *
     */
    static checkMissingRequestInputs(params: { [key: string]: any }, requiredParams: string[] = [], requiredHeaders: string[] = []): string | null {
        let errorMessage: string | null = null;

        // input headers are always lowercase
        requiredHeaders = requiredHeaders.map(h => h.toLowerCase());
        // check for missing headers
        const missingHeaders = ActionValidator.getMissingKeys(params.__ow_headers || {}, requiredHeaders);
        if (missingHeaders.length > 0) {
            errorMessage = `missing header(s) '${missingHeaders}'`;
        }

        // check for missing parameters
        const missingParams = ActionValidator.getMissingKeys(params, requiredParams);
        if (missingParams.length > 0) {
            if (errorMessage) {
                errorMessage += ' and ';
            } else {
                errorMessage = '';
            }
            errorMessage += `missing parameter(s) '${missingParams}'`;
        }

        return errorMessage;
    }
}

export default ActionValidator;
