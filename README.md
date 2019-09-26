# JSON Schema to Validators and TypeScript Interfaces

This module uses `ajv`, `ajv-pack`, and `json-schema-to-typescript` to read a directory full of json schema documents and spit out associated validators and TypeScript interfaces.

This allows developers to define their data models that require validation once in json schema format while automatically getting access to performant validators and TypeScript interfaces for development.

One good use case for this module is serverless NodeJS development. The developer has json schema validators that check requests, and data models on the backend, and has TypeScript interfaces for data models that can be used both in Lambda code and front-end code.

## Quick Start

```bash
npx json-schema-validators-typescript-interfaces -s <path to your json schema source>
```

## Installation

```bash
yarn add json-schema-validators-typescript-interfaces -D
```

## Command Line Usage

From the root of your project, you can invoke the module directly

```bash
json-schema-validators-typescript-interfaces -s <path to your json schema source>
```

## Build Integration

```json
//todo
```

## Regex Patterns

Some json schema properties might use the same regex patterns. Client side checks might also need to use those same regex patterns for client side validation of individual fields. It can be convenient and less error prone to have a library or regex patterns for re-use across your project.

If you store your regex patterns in a separate module, this library can reference them and replace template placeholders in your json schema files.

NOTE: json schema does not support case-insensitive flags so any flags in the provided regex patterns are stripped off.

Here is a sample of a regex pattern module:

```js
const patterns = {

  EMAIL_ADDRESS: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,

  URL_ANY: /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,

  URL_HTTPS: /^((https):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
};

module.exports = patterns;
```

Here is how these could be templated inside of your json schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {
      "minLength": 3,
      "maxLength": 100,
      "type": "string"
    },
    "description": {
      "minLength": 10,
      "maxLength": 500,
      "type": "string"
    },
    "url": {
      "pattern": "${PATTERN URL_HTTPS}",
      "type": "string"
    },
    "emailAddress": {
      "pattern": "${PATTERN EMAIL_ADDRESS}",
      "type": "string"
    },
    "phone": {
      "type": "string"
    }
  },
  "required": [
    "description",
    "name"
  ]
}
```

In order to tell this library to use your regex module, simply provide the path via the `--patterns` or `-p` parameter

```bash
json-schema-validators-typescript-interfaces -s <path to your json schema source> -p <path to your regex patterns module>
```

## Custom Interface and Validator Target Directories

By default the library will place validator and interface artifacts next to where your json schema files are located in directories `json-schema-validators` and `json-schema-interfaces`.

You can override either of them by providing command line arguments. For details see the help:

```bash
json-schema-validators-typescript-interfaces -h
```