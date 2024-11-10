// src/library/connection/index.ts
var Connection = class {
  constructor(url = "", token = "") {
    this.url = `${url}/v2/pipeline`;
    this.token = token;
  }
  getUrl() {
    return this.url;
  }
  getToken() {
    return this.token;
  }
};
var connection_default = Connection;
export {
  connection_default as Connection
};
//# sourceMappingURL=index.mjs.map