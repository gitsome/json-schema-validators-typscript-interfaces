"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readdirp_1 = require("readdirp");
const getAllFiles = (rootPath) => {
    return readdirp_1.promise(rootPath);
};
exports.default = getAllFiles;
//# sourceMappingURL=get-all-files.js.map