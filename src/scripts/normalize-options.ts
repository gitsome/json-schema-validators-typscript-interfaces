import path from "path";
import process from "process";

export interface Options {
  source: string;
  interfaceTarget?: string;
  validatorTarget?: string;
  patterns?: string;
  dereferencedTarget?: string;
}

export interface NormalizedOptions {
  source: string;
  interfaceTarget: string;
  validatorTarget: string;
  dereferencedTarget: string;
  patterns: { [key: string]: JSON };
}

const normalizeOptions = (options: Options): NormalizedOptions => {
  const source = path.resolve(process.cwd(), options.source);

  let interfaceTarget;
  if (options.interfaceTarget) {
    interfaceTarget = path.resolve(process.cwd(), options.interfaceTarget);
  } else {
    interfaceTarget = path.join(source, "..", "json-schema-interfaces");
  }

  let validatorTarget;
  if (options.validatorTarget) {
    validatorTarget = path.resolve(process.cwd(), options.validatorTarget);
  } else {
    validatorTarget = path.join(source, "..", "json-schema-validators");
  }

  let dereferencedTarget;
  if (options.dereferencedTarget) {
    dereferencedTarget = path.resolve(
      process.cwd(),
      options.dereferencedTarget
    );
  } else {
    dereferencedTarget = path.join(source, "..", "json-schema-dereferenced");
  }

  let patterns = {};
  if (options.patterns) {
    patterns = require(path.resolve(process.cwd(), options.patterns));
  }

  return {
    source,
    interfaceTarget,
    validatorTarget,
    dereferencedTarget,
    patterns
  };
};

export default normalizeOptions;
