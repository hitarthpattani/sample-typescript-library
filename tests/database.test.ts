import { createClient } from '@libsql/client';
import Database from '../src/library/Database';
import { Model, ExecuteResult } from '../src/library/Database/types';

jest.mock('@libsql/client');

describe('Database', () => {
    let db: Database;
    const mockExecute = jest.fn();

    beforeEach(() => {
        (createClient as jest.Mock).mockReturnValue({
            execute: mockExecute,
        });
        db = new Database('test-url', 'test-token');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should define a model', () => {
        db.define('User', { id: { name: 'id', type: 'number' }, name: { name: 'name', type: 'string' } });
        expect((db as any).User).toEqual({
            name: 'User',
            attributes: { id: { name: 'id', type: 'number' }, name: { name: 'name', type: 'string' } },
        });
    });

    it('should create a table for a model', async () => {
        mockExecute.mockResolvedValue({});

        const model: Model = { name: 'User', attributes: { id: { name: 'id', type: 'number' }, name: { name: 'name', type: 'string' } } };
        await db.createTable(model);

        expect(mockExecute).toHaveBeenCalledWith({
            sql: 'CREATE TABLE User (id number, name string)',
            args: [],
        });
    });

    it('should select data from a model', async () => {
        const mockResult: ExecuteResult = { rows: [{ id: 1, name: 'John Doe' }] };
        mockExecute.mockResolvedValue(mockResult);

        const model: Model = { name: 'User', attributes: { id: { name: 'id', type: 'number' }, name: { name: 'name', type: 'string' } } };
        const result = await db.select(model);

        expect(mockExecute).toHaveBeenCalledWith({
            sql: 'SELECT id, name FROM User ',
            args: [],
        });
        expect(result).toEqual(mockResult.rows);
    });

    it('should insert data into a model', async () => {
        mockExecute.mockResolvedValue({});

        const model: Model = { name: 'User', attributes: { id: { name: 'id', type: 'number' }, name: { name: 'name', type: 'string' } } };
        const data = { id: 1, name: 'John Doe' };
        await db.insert(model, data);

        expect(mockExecute).toHaveBeenCalledWith({
            sql: 'INSERT INTO User (id, name) VALUES (?, ?)',
            args: [1, 'John Doe'],
        });
    });

    it('should update data in a model', async () => {
        mockExecute.mockResolvedValue({});

        const model: Model = { name: 'User', attributes: { id: { name: 'id', type: 'number' }, name: { name: 'name', type: 'string' } } };
        const data = { name: 'Jane Doe' };
        const options = { where: 'id = 1' };
        await db.update(model, data, options);

        expect(mockExecute).toHaveBeenCalledWith({
            sql: 'UPDATE User SET name = ? WHERE id = 1',
            args: ['Jane Doe'],
        });
    });

    it('should delete data from a model', async () => {
        mockExecute.mockResolvedValue({});

        const model: Model = { name: 'User', attributes: { id: { name: 'id', type: 'number' }, name: { name: 'name', type: 'string' } } };
        const options = { where: 'id = 1' };
        await db.delete(model, options);

        expect(mockExecute).toHaveBeenCalledWith({
            sql: 'DELETE FROM User WHERE id = 1',
            args: [],
        });
    });
});
