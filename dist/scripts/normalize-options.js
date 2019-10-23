"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const normalizeOptions = (options) => {
    const source = path_1.default.resolve(process_1.default.cwd(), options.source);
    let interfaceTarget;
    if (options.interfaceTarget) {
        interfaceTarget = path_1.default.resolve(process_1.default.cwd(), options.interfaceTarget);
    }
    else {
        interfaceTarget = path_1.default.join(source, "..", "json-schema-interfaces");
    }
    let validatorTarget;
    if (options.validatorTarget) {
        validatorTarget = path_1.default.resolve(process_1.default.cwd(), options.validatorTarget);
    }
    else {
        validatorTarget = path_1.default.join(source, "..", "json-schema-validators");
    }
    let dereferencedTarget;
    if (options.dereferencedTarget) {
        dereferencedTarget = path_1.default.resolve(process_1.default.cwd(), options.dereferencedTarget);
    }
    else {
        dereferencedTarget = path_1.default.join(source, "..", "json-schema-dereferenced");
    }
    let patterns = {};
    if (options.patterns) {
        patterns = require(path_1.default.resolve(process_1.default.cwd(), options.patterns));
    }
    return {
        source,
        interfaceTarget,
        validatorTarget,
        dereferencedTarget,
        patterns
    };
};
exports.default = normalizeOptions;
//# sourceMappingURL=normalize-options.js.map