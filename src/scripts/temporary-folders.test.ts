import temporaryFolders from "./temporary-folders";

jest.mock("process", () => ({
  cwd: () => "/test/"
}));

describe("temporary folder finder", () => {
  it("should be relative to working directory", () => {
    expect(temporaryFolders()).toEqual({
      temporaryFolder: "/test/json-schema-transformation-tmp",
      temporarySchemaFolder: "/test/json-schema-transformation-tmp/schema"
    });
  });
});
