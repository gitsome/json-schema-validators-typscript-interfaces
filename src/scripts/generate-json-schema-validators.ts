import fs from 'fs-extra';
import path from 'path';
import Ajv from 'ajv';
import AjvPack from 'ajv-pack';

import getAllFiles from './get-all-files';

const generateJsonSchemaValidators = (ROOT_SCHEMA_PATH: string, VALIDATOR_TARGET_PATH: string) => {

  // MAKE SURE THE TARGET DIRECTORY EXISTS
  fs.mkdirSync(VALIDATOR_TARGET_PATH, { recursive: true });

  return getAllFiles(ROOT_SCHEMA_PATH).then((schemaFileInfoList) => {

    const allSchemaFiles = schemaFileInfoList.map((schemaFileInfo) => {
      return schemaFileInfo.fullPath;
    });

    const schemaList = allSchemaFiles.map((schemaFile) => {
      const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
      const schemaId = path.relative(ROOT_SCHEMA_PATH, schemaFile);
      schema["$id"] = schemaId;
      schema._filePath = schemaFile;
      return schema;
    });

    const ajv = new Ajv({sourceCode: true, schemas: schemaList});

    schemaList.forEach((schema) => {

      const schemaValidatorCode = AjvPack(ajv, ajv.getSchema(schema.$id));

      const relativeSchemaFilePath = path.relative(ROOT_SCHEMA_PATH, schema._filePath).replace(/.json$/, '.js');
      const targetSchemaValidtorFilePath = path.resolve(VALIDATOR_TARGET_PATH, relativeSchemaFilePath);
      const targetSchemaValidtorFolderPath = path.dirname(targetSchemaValidtorFilePath);

      fs.mkdirSync(targetSchemaValidtorFolderPath, { recursive: true });
      fs.writeFileSync(targetSchemaValidtorFilePath, schemaValidatorCode);
    });

  });
};

export default generateJsonSchemaValidators;