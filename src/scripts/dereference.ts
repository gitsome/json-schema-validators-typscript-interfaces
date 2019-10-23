import fs from "fs-extra";
import path from "path";
import $RefParser from "json-schema-ref-parser";

export default (
  jsonSchemFileList: string[],
  TEMPORARY_SCHEMA_DIR: string,
  TARGET_DEREFERENCED_DIR: string
) => {
  const schemaPromises = jsonSchemFileList.map((jsonSchemaPath: string) => {
    return $RefParser.dereference(jsonSchemaPath).then(results => {
      delete results.definitions;
      const dereferencedSchema = JSON.stringify(results, null, 2);

      const relativeTypeScriptFilePath = path.relative(
        TEMPORARY_SCHEMA_DIR,
        jsonSchemaPath
      );

      const targetDereferencedFilePath = path.resolve(
        TARGET_DEREFERENCED_DIR,
        relativeTypeScriptFilePath
      );

      const targetDereferencedFolderPath = path.dirname(
        targetDereferencedFilePath
      );

      // ensure the path exists
      fs.mkdirSync(targetDereferencedFolderPath, { recursive: true });

      return fs.writeFileSync(targetDereferencedFilePath, dereferencedSchema);
    });
  });

  return Promise.all(schemaPromises).catch((e: any) => {
    console.log("e:", e);
  });
};
