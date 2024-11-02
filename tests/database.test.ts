import Database from '../src/library/Database'; // Adjust the path as necessary
import Connection from '../src/library/Connection'; // Adjust the path as necessary
import { Model, Attribute, Options } from '../src/library/Database/types'; // Adjust the path as necessary

jest.mock('../src/library/Connection');

describe('Database', () => {
    let connection: Connection;
    let database: Database;
    const mockExecute = jest.fn();

    beforeEach(() => {
        connection = new Connection('test-url', 'test-token');
        connection.execute = mockExecute;
        database = new Database(connection);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should define a model and return it', () => {
        const modelName = 'TestModel';
        const attributes: Record<string, Attribute> = {
            id: { name: 'id', type: 'INTEGER' },
            name: { name: 'name', type: 'TEXT' }
        };

        const model = database.define(modelName, attributes);

        expect(model).toEqual({
            name: modelName,
            attributes: attributes
        });
        expect((database as any)[modelName]).toEqual(model);
    });

    it('should create a table', async () => {
        const model: Model = {
            name: 'TestModel',
            attributes: {
                id: { name: 'id', type: 'INTEGER' },
                name: { name: 'name', type: 'TEXT' }
            }
        };
        mockExecute.mockResolvedValue({});

        await database.createTable(model);

        expect(mockExecute).toHaveBeenCalledWith({
            sql: 'CREATE TABLE TestModel (id INTEGER, name TEXT)',
            args: []
        });
    });

    it('should select rows from a table', async () => {
        const model: Model = {
            name: 'TestModel',
            attributes: {
                id: { name: 'id', type: 'INTEGER' },
                name: { name: 'name', type: 'TEXT' }
            }
        };
        const rows = [{ id: 1, name: 'TestName' }];
        mockExecute.mockResolvedValue({ rows });

        const result = await database.select(model);

        expect(mockExecute).toHaveBeenCalledWith({
            sql: 'SELECT id, name FROM TestModel ',
            args: []
        });
        expect(result).toEqual(rows);
    });

    it('should insert a row into a table', async () => {
        const model: Model = {
            name: 'TestModel',
            attributes: {
                id: { name: 'id', type: 'INTEGER' },
                name: { name: 'name', type: 'TEXT' }
            }
        };
        const data = { id: 1, name: 'TestName' };
        mockExecute.mockResolvedValue({});

        await database.insert(model, data);

        expect(mockExecute).toHaveBeenCalledWith({
            sql: 'INSERT INTO TestModel (id, name) VALUES (?, ?)',
            args: [1, 'TestName']
        });
    });

    it('should update a row in a table', async () => {
        const model: Model = {
            name: 'TestModel',
            attributes: {
                id: { name: 'id', type: 'INTEGER' },
                name: { name: 'name', type: 'TEXT' }
            }
        };
        const data = { name: 'UpdatedName' };
        const options: Options = { where: 'id = 1' };
        mockExecute.mockResolvedValue({});

        await database.update(model, data, options);

        expect(mockExecute).toHaveBeenCalledWith({
            sql: 'UPDATE TestModel SET name = ? WHERE id = 1',
            args: ['UpdatedName']
        });
    });

    it('should delete a row from a table', async () => {
        const model: Model = {
            name: 'TestModel',
            attributes: {
                id: { name: 'id', type: 'INTEGER' },
                name: { name: 'name', type: 'TEXT' }
            }
        };
        const options: Options = { where: 'id = 1' };
        mockExecute.mockResolvedValue({});

        await database.delete(model, options);

        expect(mockExecute).toHaveBeenCalledWith({
            sql: 'DELETE FROM TestModel WHERE id = 1',
            args: []
        });
    });
});
