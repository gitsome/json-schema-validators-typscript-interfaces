"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_options_1 = __importDefault(require("./normalize-options"));
jest.mock("process", () => ({
    cwd: () => "/test/"
}));
describe("options normalization", () => {
    it("should handle just source", () => {
        expect(normalize_options_1.default({
            source: "schemas-folder"
        })).toEqual({
            interfaceTarget: "/test/json-schema-interfaces",
            patterns: {},
            source: "/test/schemas-folder",
            validatorTarget: "/test/json-schema-validators"
        });
    });
    it("should handle interface target", () => {
        expect(normalize_options_1.default({
            interfaceTarget: "custom-interface-folder",
            source: "schemas-folder"
        })).toEqual({
            interfaceTarget: "/test/custom-interface-folder",
            patterns: {},
            source: "/test/schemas-folder",
            validatorTarget: "/test/json-schema-validators"
        });
    });
    it("should handle validator target", () => {
        expect(normalize_options_1.default({
            validatorTarget: "custom-validator-folder",
            source: "schemas-folder"
        })).toEqual({
            interfaceTarget: "/test/json-schema-interfaces",
            patterns: {},
            source: "/test/schemas-folder",
            validatorTarget: "/test/custom-validator-folder"
        });
    });
    it("should handle patterns", () => {
        fail("test me!");
    });
});
//# sourceMappingURL=normalize-options.test.js.map