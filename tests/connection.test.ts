import { createClient } from '@libsql/client';
import Connection from '../src/library/Connection';
import { Query, ExecuteResult } from '../src/library/Connection/types';

jest.mock('@libsql/client');

describe('Connection', () => {
    let connection: Connection;
    const mockExecute = jest.fn();

    beforeEach(() => {
        (createClient as jest.Mock).mockReturnValue({
            execute: mockExecute,
        });
        connection = new Connection('test-url', 'test-token');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a client with the correct parameters', () => {
        expect(createClient).toHaveBeenCalledWith({
            url: 'test-url',
            authToken: 'test-token',
        });
    });

    it('should execute a query and return the result', async () => {
        const mockResult: ExecuteResult = { rows: [{ id: 1, name: 'John Doe' }] };
        mockExecute.mockResolvedValue(mockResult);

        const query: Query = { sql: 'SELECT * FROM users', args: [] };
        const result = await connection.execute(query);

        expect(mockExecute).toHaveBeenCalledWith(query);
        expect(result).toEqual(mockResult);
    });

    it('should handle errors during query execution', async () => {
        const error = new Error('Query execution failed');
        mockExecute.mockRejectedValue(error);

        const query: Query = { sql: 'SELECT * FROM users', args: [] };

        await expect(connection.execute(query)).rejects.toThrow('Query execution failed');
    });
});
