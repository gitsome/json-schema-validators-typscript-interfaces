"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const json_schema_ref_parser_1 = __importDefault(require("json-schema-ref-parser"));
exports.default = (jsonSchemFileList, TEMPORARY_SCHEMA_DIR, TARGET_DEREFERENCED_DIR) => {
    const schemaPromises = jsonSchemFileList.map((jsonSchemaPath) => {
        return json_schema_ref_parser_1.default.dereference(jsonSchemaPath).then(results => {
            delete results.definitions;
            const dereferencedSchema = JSON.stringify(results, null, 2);
            const relativeTypeScriptFilePath = path_1.default.relative(TEMPORARY_SCHEMA_DIR, jsonSchemaPath);
            const targetDereferencedFilePath = path_1.default.resolve(TARGET_DEREFERENCED_DIR, relativeTypeScriptFilePath);
            const targetDereferencedFolderPath = path_1.default.dirname(targetDereferencedFilePath);
            // ensure the path exists
            fs_extra_1.default.mkdirSync(targetDereferencedFolderPath, { recursive: true });
            return fs_extra_1.default.writeFileSync(targetDereferencedFilePath, dereferencedSchema);
        });
    });
    return Promise.all(schemaPromises).catch((e) => {
        console.log("e:", e);
    });
};
//# sourceMappingURL=yupify.js.map