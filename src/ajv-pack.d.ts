declare module "ajv-pack" {
  import { Ajv, ValidateFunction } from "ajv";
  function ajvPack(instance: Ajv, validator: ValidateFunction): string;
  export default ajvPack;
}
