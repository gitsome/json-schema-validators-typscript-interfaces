"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const temporary_folders_1 = __importDefault(require("./temporary-folders"));
jest.mock("process", () => ({
    cwd: () => "/test/"
}));
describe("temporary folder finder", () => {
    it("should be relative to working directory", () => {
        expect(temporary_folders_1.default()).toEqual({
            temporaryFolder: "/test/json-schema-transformation-tmp",
            temporarySchemaFolder: "/test/json-schema-transformation-tmp/schema"
        });
    });
});
//# sourceMappingURL=temporary-folders.test.js.map