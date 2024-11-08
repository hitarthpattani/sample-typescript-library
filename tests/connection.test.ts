/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import fetch from 'node-fetch';
import Connection from '../src/library/connection';

jest.mock('node-fetch', () => jest.fn());

describe('Connection', () => {
    let connection: Connection;
    let originalConsoleError: any;
    let originalConsoleLog: any;

    beforeEach(() => {
        connection = new Connection('http://example.com', 'test-token');
        originalConsoleError = console.error;
        originalConsoleLog = console.log;
        console.error = jest.fn();
        console.log = jest.fn();
    });

    afterEach(() => {
        console.error = originalConsoleError;
        console.log = originalConsoleLog;
    });

    describe('constructor', () => {
        it('should initialize with the correct URL and token', () => {
            expect(connection.url).toBe('http://example.com/v2/pipeline');
            expect(connection.token).toBe('test-token');
            expect(connection.requests).toEqual([]);
        });
    });

    describe('addRequest', () => {
        it('should add a request to the requests array', () => {
            connection.addRequest('SELECT * FROM users', [], 'test-id');
            expect(connection.requests).toEqual([
                { type: 'execute', stmt: { sql: 'SELECT * FROM users', named_args: [] }, identifier: 'test-id' }
            ]);
        });
    });

    describe('execute', () => {
        it('should throw an error if there are no requests to execute', async () => {
            await expect(connection.execute()).rejects.toThrow('No requests to execute');
        });

        it('should execute requests and return responses', async () => {
            connection.addRequest('SELECT * FROM users', [], 'test-id');

            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({
                    results: [
                        { type: 'execute', response: { type: 'execute', result: 'test-result' } },
                        { type: 'close' }
                    ]
                })
            });

            const responses = await connection.execute();

            expect(responses).toEqual({
                'test-id': {
                    query: 'SELECT * FROM users',
                    result: 'test-result'
                }
            });
        });

        it('should handle HTTP errors', async () => {
            connection.addRequest('SELECT * FROM users', [], 'test-id');

            (fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 500
            });

            await expect(connection.execute()).rejects.toThrow('HTTP error! status: 500');
        });

        it('should handle execution errors', async () => {
            connection.addRequest('SELECT * FROM users', [], 'test-id');

            (fetch as jest.Mock).mockRejectedValue(new Error('Fetch error'));

            await expect(connection.execute()).rejects.toThrow('Fetch error');
        });

        it('should handle request errors in the response', async () => {
            connection.addRequest('SELECT * FROM users', [], 'test-id');

            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({
                    results: [
                        { type: 'execute', response: { type: 'error', error: 'test-error' } },
                        { type: 'close' }
                    ]
                })
            });

            const responses = await connection.execute();

            expect(responses).toEqual({
                'test-id': {
                    query: 'SELECT * FROM users',
                    error: 'test-error'
                }
            });
        });
    });
});
