import readdirp from 'readdirp';

const getAllFiles = (rootPath) => {
  return readdirp.promise(rootPath);
};

export default getAllFiles;