"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_all_files_1 = __importDefault(require("./get-all-files"));
jest.mock("readdirp", () => ({
    promise(root) {
        return Promise.resolve([
            {
                path: "./example.json",
                fullPath: `${root}/example.json`,
                basename: "example.json"
            }
        ]);
    }
}));
describe("get all files in folder", () => {
    it("should find the files", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield get_all_files_1.default("/test")).toEqual([
            {
                basename: "example.json",
                fullPath: "/test/example.json",
                path: "./example.json"
            }
        ]);
    }));
});
//# sourceMappingURL=get-all-files.test.js.map