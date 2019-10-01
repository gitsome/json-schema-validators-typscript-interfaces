declare const getAllFiles: (rootPath: string) => Promise<import("readdirp").EntryInfo[]>;
export default getAllFiles;
