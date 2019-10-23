#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const api_1 = require("./api");
const commandLineArgs = yargs_1.default
    .string("source")
    .alias("s", "source")
    .describe("s", "the directory for your json schema files")
    .string("interface-target")
    .alias("i", "interface-target")
    .alias("interfaceTarget", "interface-target")
    .describe("i", "the output location for TypeScript interfaces")
    .string("validator-target")
    .alias("v", "validator-target")
    .alias("validatorTarget", "validator-target")
    .describe("v", "the output location for json schema validators")
    .string("patterns")
    .alias("p", "patterns")
    .describe("p", "the location of a regex patterns module (optional)")
    .boolean("yup")
    .describe("yup", "generate yup validators from json schema")
    .string("yup-target")
    .alias("y", "yupTarget")
    .alias("validatorTarget", "yup-target")
    .describe("y", "the output location for yup validators")
    .demandOption(["source"], "The source (s) parameter is required.")
    .help("help").argv;
api_1.main(commandLineArgs);
//# sourceMappingURL=cli.js.map