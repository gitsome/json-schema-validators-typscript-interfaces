import { promise } from "readdirp";

export type ReaddirReturn = ReturnType<typeof promise>;

const getAllFiles = (rootPath: string): ReaddirReturn => {
  return promise(rootPath);
};

export default getAllFiles;
