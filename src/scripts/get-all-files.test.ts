import getAllFiles, { ReaddirReturn } from "./get-all-files";

jest.mock("readdirp", () => ({
  promise(root: string): ReaddirReturn {
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
  it("should find the files", async () => {
    expect(await getAllFiles("/test")).toEqual([
      {
        basename: "example.json",
        fullPath: "/test/example.json",
        path: "./example.json"
      }
    ]);
  });
});
