"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const temporaryFolders = () => {
    const temporaryFolder = path_1.default.resolve(process_1.default.cwd(), "./json-schema-transformation-tmp");
    const temporarySchemaFolder = path_1.default.join(temporaryFolder, "schema");
    return { temporaryFolder, temporarySchemaFolder };
};
exports.default = temporaryFolders;
//# sourceMappingURL=temporary-folders.js.map