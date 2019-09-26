#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import yargs from "yargs";
import { compileFromFile } from "json-schema-to-typescript";
import getAllFiles from "./scripts/get-all-files";
import generateJsonSchemaValidators from "./scripts/generate-json-schema-validators";

const commandLineArgs = yargs
  .string("source")
  .alias("s", "source")
  .describe("s", "the directory for your json schema files")
  .string("interface-target")
  .alias("i", "interface-target")
  .describe("i", "the output location for TypeScript interfaces")
  .string("validator-target")
  .alias("v", "validator-target")
  .describe("v", "the output location for json schema validators")
  .string("patterns")
  .alias("p", "patterns")
  .describe("p", "the location of a regex patterns module (optional)")
  .demandOption(["source"], "The source (s) parameter is required.")
  .help("help").argv;

const jsonSchemaSourceDirectory = path.resolve(
  process.cwd(),
  commandLineArgs.source
);

let interfaceTarget;
if (commandLineArgs.i) {
  interfaceTarget = path.resolve(process.cwd(), commandLineArgs.source);
} else {
  interfaceTarget = path.join(
    jsonSchemaSourceDirectory,
    "..",
    "json-schema-interfaces"
  );
}

let validatorTarget;
if (commandLineArgs.v) {
  validatorTarget = path.resolve(process.cwd(), commandLineArgs.source);
} else {
  validatorTarget = path.join(
    jsonSchemaSourceDirectory,
    "..",
    "json-schema-validators"
  );
}

let patterns: { [key: string]: JSON } = {};
if (commandLineArgs.patterns) {
  patterns = require(path.resolve(process.cwd(), commandLineArgs.patterns));
}

const SOURCE_JSON_SCHEMA_DIR = jsonSchemaSourceDirectory;
const TARGET_TYPESCRIPT_INTERFACE_DIR = interfaceTarget;
const TARGET_VALIDATORS_DIR = validatorTarget;

const TEMPORARY_DIR = path.resolve(
  process.cwd(),
  "./json-schema-transformation-tmp"
);
const TEMPORARY_SCHEMA_DIR = path.join(TEMPORARY_DIR, "schema");

console.log("JSON SCHEMA LOCATION:", SOURCE_JSON_SCHEMA_DIR);
console.log("TYPESCRIPT INTERFACES LOCATION:", TARGET_TYPESCRIPT_INTERFACE_DIR);
console.log("JSON SCHEMA VALIDATORS LOCATION:", TARGET_VALIDATORS_DIR);
console.log("REGEX PATTERNS:", patterns);

const REGEX_IS_SCHEMA_FILE = /\.(json)$/i;
const REGEX_PATTERN_TEMPLATE = /\$\{\s*PATTERN\s*([^\s]*)\s*\}/g;

const updateSchemaFile = (filePath: string) => {
  // read the file synchronously
  const rawFile = fs.readFileSync(filePath, "utf8");

  const newRawFile = rawFile.replace(
    REGEX_PATTERN_TEMPLATE,
    (match, matchText) => {
      if (!patterns[matchText]) {
        throw new Error(
          `updateSchemaFile:RegexPattern - pattern not found '${matchText}'`
        );
      }

      // remove start and end / for JSON SCHEMA purposes and also escape characters to make regex expression valid in JSON
      return patterns[matchText]
        .toString()
        .replace(/^\//, "")
        .replace(/\/$/, "")
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"');
    }
  );

  fs.writeFileSync(filePath, newRawFile, "utf8");
};

// first copy all json schema files
fs.copySync(SOURCE_JSON_SCHEMA_DIR, TEMPORARY_SCHEMA_DIR);

// replace all ${PATTERN <pattern name>} with the proper regex
getAllFiles(TEMPORARY_SCHEMA_DIR)
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
    fs.mkdirSync(TARGET_TYPESCRIPT_INTERFACE_DIR, { recursive: true });

    return schemaFileList;

    // run typescript to json schema
  })
  .then(schemaFileList => {
    const allSchemaPromises = schemaFileList.map(schemaFilePath => {
      const schemaPromise = compileFromFile(schemaFilePath, {}).then(ts => {
        const relativeTypeScriptFilePath = path
          .relative(TEMPORARY_SCHEMA_DIR, schemaFilePath)
          .replace(/.json$/, ".ts");
        const targetTypeScriptFilePath = path.resolve(
          TARGET_TYPESCRIPT_INTERFACE_DIR,
          relativeTypeScriptFilePath
        );
        const targetTypeScriptFileFolderPath = path.dirname(
          targetTypeScriptFilePath
        );

        // ensure the path exists
        fs.mkdirSync(targetTypeScriptFileFolderPath, { recursive: true });

        return fs.writeFileSync(targetTypeScriptFilePath, ts);
      });

      return schemaPromise;
    });

    return Promise.all(allSchemaPromises);
  })
  .then(() => {
    return generateJsonSchemaValidators(
      TEMPORARY_SCHEMA_DIR,
      TARGET_VALIDATORS_DIR
    );
  })
  .then(() => {
    // finally delete the temp directory
    fs.removeSync(TEMPORARY_DIR);
  })
  .then(() => {
    console.log("compile-json-schema.success");
  })
  .catch(err => {
    console.error("compile-json-schema.error:", err);
  });
