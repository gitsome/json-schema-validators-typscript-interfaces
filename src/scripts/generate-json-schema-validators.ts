import fs from "fs-extra";
import path from "path";
import Ajv from "ajv";
import AjvPack from "ajv-pack";
import getAllFiles from "./get-all-files";

const generateJsonSchemaValidators = (
  rootSchemaPath: string,
  validatorTargetPath: string
) => {
  // MAKE SURE THE TARGET DIRECTORY EXISTS
  fs.mkdirSync(validatorTargetPath, { recursive: true });

  return getAllFiles(rootSchemaPath).then(schemaFileInfoList => {
    const allSchemaFiles = schemaFileInfoList.map(schemaFileInfo => {
      return schemaFileInfo.fullPath;
    });

    const schemaList = allSchemaFiles.map(schemaFile => {
      const schema = JSON.parse(fs.readFileSync(schemaFile, "utf8"));
      const schemaId = path.relative(rootSchemaPath, schemaFile);
      schema["$id"] = schemaId;
      schema._filePath = schemaFile;
      return schema;
    });

    const ajv = new Ajv({ sourceCode: true, schemas: schemaList });

    schemaList.forEach(schema => {
      const schemaValidatorCode = AjvPack(ajv, ajv.getSchema(schema.$id));

      const relativeSchemaFilePath = path
        .relative(rootSchemaPath, schema._filePath)
        .replace(/.json$/, ".js");
      const targetSchemaValidtorFilePath = path.resolve(
        validatorTargetPath,
        relativeSchemaFilePath
      );
      const targetSchemaValidtorFolderPath = path.dirname(
        targetSchemaValidtorFilePath
      );

      fs.mkdirSync(targetSchemaValidtorFolderPath, { recursive: true });
      fs.writeFileSync(targetSchemaValidtorFilePath, schemaValidatorCode);
    });
  });
};

export default generateJsonSchemaValidators;
