#!/usr/bin/env node
import yargs from "yargs";
import { main } from "./api";

const commandLineArgs = yargs
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

main(commandLineArgs);
