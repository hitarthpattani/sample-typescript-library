// src/library/Database/index.ts
var Database = class {
  constructor(connection) {
    this.connection = connection;
  }
  define(name, attributes) {
    this[name] = {
      name,
      attributes
    };
  }
  async createTable(model) {
    const columns = Object.entries(model.attributes).map(([_, attr]) => `${attr.name} ${attr.type}`).join(", ");
    const query = `CREATE TABLE ${model.name} (${columns})`;
    await this.connection.execute({ sql: query, args: [] });
  }
  async select(model, options = {}) {
    const attributes = options.attributes || Object.keys(model.attributes).map((key) => model.attributes[key].name);
    const where = options.where ? `WHERE ${options.where}` : "";
    const query = `SELECT ${attributes.join(", ")} FROM ${model.name} ${where}`;
    const result = await this.connection.execute({ sql: query, args: [] });
    return result.rows;
  }
  async insert(model, data) {
    const attributes = Object.keys(data);
    const values = attributes.map((attribute) => "?").join(", ");
    const query = `INSERT INTO ${model.name} (${attributes.join(", ")}) VALUES (${values})`;
    await this.connection.execute({ sql: query, args: Object.values(data) });
  }
  async update(model, data, options = {}) {
    const attributes = Object.keys(data);
    const values = attributes.map((attribute) => `${attribute} = ?`).join(", ");
    const where = options.where ? `WHERE ${options.where}` : "";
    const query = `UPDATE ${model.name} SET ${values} ${where}`;
    await this.connection.execute({ sql: query, args: Object.values(data) });
  }
  async delete(model, options = {}) {
    const where = options.where ? `WHERE ${options.where}` : "";
    const query = `DELETE FROM ${model.name} ${where}`;
    await this.connection.execute({ sql: query, args: [] });
  }
};
var Database_default = Database;
export {
  Database_default as Database
};
//# sourceMappingURL=index.mjs.map