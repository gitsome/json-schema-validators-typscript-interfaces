"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const json_schema_to_typescript_1 = require("json-schema-to-typescript");
const get_all_files_1 = __importDefault(require("./scripts/get-all-files"));
const generate_json_schema_validators_1 = __importDefault(require("./scripts/generate-json-schema-validators"));
const normalize_options_1 = __importDefault(require("./scripts/normalize-options"));
const temporary_folders_1 = __importDefault(require("./scripts/temporary-folders"));
exports.main = (options) => {
    const { source: SOURCE_JSON_SCHEMA_DIR, interfaceTarget: TARGET_TYPESCRIPT_INTERFACE_DIR, validatorTarget: TARGET_VALIDATORS_DIR, patterns } = normalize_options_1.default(options);
    const { temporaryFolder: TEMPORARY_DIR, temporarySchemaFolder: TEMPORARY_SCHEMA_DIR } = temporary_folders_1.default();
    console.log("JSON SCHEMA LOCATION:", SOURCE_JSON_SCHEMA_DIR);
    console.log("TYPESCRIPT INTERFACES LOCATION:", TARGET_TYPESCRIPT_INTERFACE_DIR);
    console.log("JSON SCHEMA VALIDATORS LOCATION:", TARGET_VALIDATORS_DIR);
    console.log("REGEX PATTERNS:", patterns);
    const REGEX_IS_SCHEMA_FILE = /\.(json)$/i;
    const REGEX_PATTERN_TEMPLATE = /\$\{\s*PATTERN\s*([^\s]*)\s*\}/g;
    const updateSchemaFile = (filePath) => {
        // read the file synchronously
        const rawFile = fs_extra_1.default.readFileSync(filePath, "utf8");
        const newRawFile = rawFile.replace(REGEX_PATTERN_TEMPLATE, (match, matchText) => {
            if (!patterns[matchText]) {
                throw new Error(`updateSchemaFile:RegexPattern - pattern not found '${matchText}'`);
            }
            // remove start and end / for JSON SCHEMA purposes and also escape characters to make regex expression valid in JSON
            return patterns[matchText]
                .toString()
                .replace(/^\//, "")
                .replace(/\/$/, "")
                .replace(/\\/g, "\\\\")
                .replace(/"/g, '\\"');
        });
        fs_extra_1.default.writeFileSync(filePath, newRawFile, "utf8");
    };
    // first copy all json schema files
    fs_extra_1.default.copySync(SOURCE_JSON_SCHEMA_DIR, TEMPORARY_SCHEMA_DIR);
    // replace all ${PATTERN <pattern name>} with the proper regex
    get_all_files_1.default(TEMPORARY_SCHEMA_DIR)
        .then(fileInfoList => {
        return fileInfoList
            .filter(fileInfo => {
            return fileInfo.fullPath.match(REGEX_IS_SCHEMA_FILE);
        })
            .map(fileInfo => {
            return fileInfo.fullPath;
        });
        // ensure the interface directory exists
    })
        .then(schemaFileList => {
        schemaFileList.forEach(schemaFilePath => {
            updateSchemaFile(schemaFilePath);
        });
        return schemaFileList;
    })
        .then(schemaFileList => {
        fs_extra_1.default.mkdirSync(TARGET_TYPESCRIPT_INTERFACE_DIR, { recursive: true });
        return schemaFileList;
        // run typescript to json schema
    })
        .then(schemaFileList => {
        const allSchemaPromises = schemaFileList.map(schemaFilePath => {
            const schemaPromise = json_schema_to_typescript_1.compileFromFile(schemaFilePath, {}).then(ts => {
                const relativeTypeScriptFilePath = path_1.default
                    .relative(TEMPORARY_SCHEMA_DIR, schemaFilePath)
                    .replace(/.json$/, ".ts");
                const targetTypeScriptFilePath = path_1.default.resolve(TARGET_TYPESCRIPT_INTERFACE_DIR, relativeTypeScriptFilePath);
                const targetTypeScriptFileFolderPath = path_1.default.dirname(targetTypeScriptFilePath);
                // ensure the path exists
                fs_extra_1.default.mkdirSync(targetTypeScriptFileFolderPath, { recursive: true });
                return fs_extra_1.default.writeFileSync(targetTypeScriptFilePath, ts);
            });
            return schemaPromise;
        });
        return Promise.all(allSchemaPromises);
    })
        .then(() => {
        return generate_json_schema_validators_1.default(TEMPORARY_SCHEMA_DIR, TARGET_VALIDATORS_DIR);
    })
        .then(() => {
        // finally delete the temp directory
        fs_extra_1.default.removeSync(TEMPORARY_DIR);
    })
        .then(() => {
        console.log("compile-json-schema.success");
    })
        .catch(err => {
        console.error("compile-json-schema.error:", err);
    });
};
//# sourceMappingURL=api.js.map