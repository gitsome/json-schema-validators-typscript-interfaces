#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const json_schema_to_typescript_1 = require("json-schema-to-typescript");
const get_all_files_1 = __importDefault(require("./scripts/get-all-files"));
const generate_json_schema_validators_js_1 = __importDefault(require("./scripts/generate-json-schema-validators.js"));
const commandLineArgs = yargs_1.default
    .alias('s', 'source')
    .describe('s', 'the directory for your json schema files')
    .alias('i', 'interface-target')
    .describe('i', 'the output location for TypeScript interfaces')
    .alias('v', 'validator-target')
    .describe('v', 'the output location for json schema validators')
    .alias('p', 'patterns')
    .describe('p', 'the location of a regex patterns module (optional)')
    .demandOption(['source'], 'The source (s) parameter is required.')
    .help('help')
    .argv;
const jsonSchemaSourceDirectory = path_1.default.resolve(process.cwd(), commandLineArgs.source);
let interfaceTarget;
if (commandLineArgs.i) {
    interfaceTarget = path_1.default.resolve(process.cwd(), commandLineArgs.source);
}
else {
    interfaceTarget = path_1.default.join(jsonSchemaSourceDirectory, '..', 'json-schema-interfaces');
}
let validatorTarget;
if (commandLineArgs.v) {
    validatorTarget = path_1.default.resolve(process.cwd(), commandLineArgs.source);
}
else {
    validatorTarget = path_1.default.join(jsonSchemaSourceDirectory, '..', 'json-schema-validators');
}
let patterns = {};
if (commandLineArgs.patterns) {
    patterns = require(path_1.default.resolve(process.cwd(), commandLineArgs.patterns));
}
const SOURCE_JSON_SCHEMA_DIR = jsonSchemaSourceDirectory;
const TARGET_TYPESCRIPT_INTERFACE_DIR = interfaceTarget;
const TARGET_VALIDATORS_DIR = validatorTarget;
const TEMPORARY_DIR = path_1.default.resolve(process.cwd(), './json-schema-transformation-tmp');
const TEMPORARY_SCHEMA_DIR = path_1.default.join(TEMPORARY_DIR, 'schema');
console.log("JSON SCHEMA LOCATION:", SOURCE_JSON_SCHEMA_DIR);
console.log("TYPESCRIPT INTERFACES LOCATION:", TARGET_TYPESCRIPT_INTERFACE_DIR);
console.log("JSON SCHEMA VALIDATORS LOCATION:", TARGET_VALIDATORS_DIR);
console.log("REGEX PATTERNS:", patterns);
const REGEX_IS_SCHEMA_FILE = /\.(json)$/i;
const REGEX_PATTERN_TEMPLATE = /\$\{\s*PATTERN\s*([^\s]*)\s*\}/g;
const updateSchemaFile = (filePath) => {
    // read the file synchronously
    const rawFile = fs_extra_1.default.readFileSync(filePath, 'utf8');
    const newRawFile = rawFile.replace(REGEX_PATTERN_TEMPLATE, (match, matchText) => {
        if (!patterns[matchText]) {
            throw new Error(`updateSchemaFile:RegexPattern - pattern not found '${matchText}'`);
        }
        // remove start and end / for JSON SCHEMA purposes and also escape characers to make regex expression valid in JSON
        return patterns[matchText].toString()
            .replace(/^\//, '')
            .replace(/\/$/, '')
            .replace(/\\/g, '\\\\')
            .replace(/\"/g, '\\"');
    });
    fs_extra_1.default.writeFileSync(filePath, newRawFile, 'utf8');
};
// first copy all json schema files
fs_extra_1.default.copySync(SOURCE_JSON_SCHEMA_DIR, TEMPORARY_SCHEMA_DIR);
// replace all ${PATTERN <pattern name>} with the proper regex
get_all_files_1.default(TEMPORARY_SCHEMA_DIR).then((fileInfoList) => {
    return fileInfoList.filter((fileInfo) => {
        return fileInfo.fullPath.match(REGEX_IS_SCHEMA_FILE);
    }).map((fileInfo) => {
        return fileInfo.fullPath;
    });
    // ensure the interface directory exists
}).then((schemaFileList) => {
    schemaFileList.forEach((schemaFilePath) => {
        updateSchemaFile(schemaFilePath);
    });
    return schemaFileList;
}).then((schemaFileList) => {
    fs_extra_1.default.mkdirSync(TARGET_TYPESCRIPT_INTERFACE_DIR, { recursive: true });
    return schemaFileList;
    // run typescript to json schema
}).then((schemaFileList) => {
    const allSchemaPromises = [];
    schemaFileList.forEach((schemaFilePath) => {
        const schemaPromise = json_schema_to_typescript_1.compileFromFile(schemaFilePath, {}).then((ts) => {
            const relativeTypeScriptFilePath = path_1.default.relative(TEMPORARY_SCHEMA_DIR, schemaFilePath).replace(/.json$/, '.ts');
            const targetTypeScriptFilePath = path_1.default.resolve(TARGET_TYPESCRIPT_INTERFACE_DIR, relativeTypeScriptFilePath);
            const targetTypeScriptFileFolderPath = path_1.default.dirname(targetTypeScriptFilePath);
            // ensure the path exists
            fs_extra_1.default.mkdirSync(targetTypeScriptFileFolderPath, { recursive: true });
            return fs_extra_1.default.writeFileSync(targetTypeScriptFilePath, ts);
        });
        allSchemaPromises.push(schemaPromise);
    });
    return Promise.all(allSchemaPromises);
}).then(() => {
    return generate_json_schema_validators_js_1.default(TEMPORARY_SCHEMA_DIR, TARGET_VALIDATORS_DIR);
}).then(() => {
    // finally delete the temp directory
    fs_extra_1.default.removeSync(TEMPORARY_DIR);
}).then(() => {
    console.log("compile-json-schema.success");
}).catch((err) => {
    console.error(`compile-json-schema.error:`, err);
});
//# sourceMappingURL=index.js.map