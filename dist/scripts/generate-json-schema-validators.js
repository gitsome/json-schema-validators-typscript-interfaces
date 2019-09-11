"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const ajv_1 = __importDefault(require("ajv"));
const ajv_pack_1 = __importDefault(require("ajv-pack"));
const get_all_files_1 = __importDefault(require("./get-all-files"));
const generateJsonSchemaValidators = (ROOT_SCHEMA_PATH, VALIDATOR_TARGET_PATH) => {
    // MAKE SURE THE TARGET DIRECTORY EXISTS
    fs_extra_1.default.mkdirSync(VALIDATOR_TARGET_PATH, { recursive: true });
    return get_all_files_1.default(ROOT_SCHEMA_PATH).then((schemaFileInfoList) => {
        const allSchemaFiles = schemaFileInfoList.map((schemaFileInfo) => {
            return schemaFileInfo.fullPath;
        });
        const schemaList = allSchemaFiles.map((schemaFile) => {
            const schema = JSON.parse(fs_extra_1.default.readFileSync(schemaFile, 'utf8'));
            const schemaId = path_1.default.relative(ROOT_SCHEMA_PATH, schemaFile);
            schema["$id"] = schemaId;
            schema._filePath = schemaFile;
            return schema;
        });
        const ajv = new ajv_1.default({ sourceCode: true, schemas: schemaList });
        schemaList.forEach((schema) => {
            const schemaValidatorCode = ajv_pack_1.default(ajv, ajv.getSchema(schema.$id));
            const relativeSchemaFilePath = path_1.default.relative(ROOT_SCHEMA_PATH, schema._filePath).replace(/.json$/, '.js');
            const targetScemaValidtorFilePath = path_1.default.resolve(VALIDATOR_TARGET_PATH, relativeSchemaFilePath);
            const targetScemaValidtorFolderPath = path_1.default.dirname(targetScemaValidtorFilePath);
            fs_extra_1.default.mkdirSync(targetScemaValidtorFolderPath, { recursive: true });
            fs_extra_1.default.writeFileSync(targetScemaValidtorFilePath, schemaValidatorCode);
        });
    });
};
exports.default = generateJsonSchemaValidators;
//# sourceMappingURL=generate-json-schema-validators.js.map