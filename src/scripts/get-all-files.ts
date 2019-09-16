import readdirp from 'readdirp';

const getAllFiles = (rootPath: string) => {
  return readdirp.promise(rootPath);
};

export default getAllFiles;