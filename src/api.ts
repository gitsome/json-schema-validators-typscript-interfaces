import fs from "fs-extra";
import path from "path";
import { compileFromFile } from "json-schema-to-typescript";
import getAllFiles from "./scripts/get-all-files";
import generateJsonSchemaValidators from "./scripts/generate-json-schema-validators";
import normalizeOptions, { Options } from "./scripts/normalize-options";
import temporaryFolders from "./scripts/temporary-folders";
import dereference from "./scripts/dereference";

/**
 * Takes directory full of json schema documents
 * and spit out associated validators and TypeScript interfaces.
 *
 * @param options configuration for folders used
 * @returns true for successful processing, false for failed processing
 */
export const main = async (options: Options) => {
  const {
    source: SOURCE_JSON_SCHEMA_DIR,
    interfaceTarget: TARGET_TYPESCRIPT_INTERFACE_DIR,
    validatorTarget: TARGET_VALIDATORS_DIR,
    patterns,
    dereferencedTarget: TARGET_DEREFERENCE_DIR
  } = normalizeOptions(options);

  const {
    temporaryFolder: TEMPORARY_DIR,
    temporarySchemaFolder: TEMPORARY_SCHEMA_DIR
  } = temporaryFolders();

  console.log("JSON SCHEMA LOCATION:", SOURCE_JSON_SCHEMA_DIR);
  console.log(
    "TYPESCRIPT INTERFACES LOCATION:",
    TARGET_TYPESCRIPT_INTERFACE_DIR
  );
  console.log("JSON SCHEMA VALIDATORS LOCATION:", TARGET_VALIDATORS_DIR);
  console.log("JSON SCHEMA YUP VALIDATORS LOCATION:", TARGET_DEREFERENCE_DIR);
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
  try {
    const fileInfoList = await getAllFiles(TEMPORARY_SCHEMA_DIR);
    const schemaFileList = fileInfoList
      .filter(fileInfo => {
        return fileInfo.fullPath.match(REGEX_IS_SCHEMA_FILE);
      })
      .map(fileInfo => {
        return fileInfo.fullPath;
      });
    schemaFileList.forEach(schemaFilePath => {
      updateSchemaFile(schemaFilePath);
    });
    fs.mkdirSync(TARGET_DEREFERENCE_DIR, { recursive: true });
    await dereference(
      schemaFileList,
      TEMPORARY_SCHEMA_DIR,
      TARGET_DEREFERENCE_DIR
    );
    fs.mkdirSync(TARGET_TYPESCRIPT_INTERFACE_DIR, { recursive: true });
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
    await Promise.all(allSchemaPromises);
    await generateJsonSchemaValidators(
      TEMPORARY_SCHEMA_DIR,
      TARGET_VALIDATORS_DIR
    );
    // finally delete the temp directory
    fs.removeSync(TEMPORARY_DIR);
    console.log("compile-json-schema.success");
    return true;
  } catch (err) {
    console.error("compile-json-schema.error:", err);
    return false;
  }
};
