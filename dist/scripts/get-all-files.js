"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readdirp_1 = __importDefault(require("readdirp"));
const getAllFiles = (rootPath) => {
    return readdirp_1.default.promise(rootPath);
};
exports.default = getAllFiles;
//# sourceMappingURL=get-all-files.js.map