import path from "path";
import process from "process";

const temporaryFolders = () => {
  const temporaryFolder = path.resolve(
    process.cwd(),
    "./json-schema-transformation-tmp"
  );
  const temporarySchemaFolder = path.join(temporaryFolder, "schema");
  return { temporaryFolder, temporarySchemaFolder };
};

export default temporaryFolders;
