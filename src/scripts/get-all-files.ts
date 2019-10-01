import { promise } from "readdirp";

const getAllFiles = (rootPath: string) => {
  return promise(rootPath);
};

export default getAllFiles;
