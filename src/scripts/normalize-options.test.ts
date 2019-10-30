import normalizeOptions from "./normalize-options";

jest.mock("process", () => ({
  cwd: () => "/test/"
}));

describe("options normalization", () => {
  it("should handle just source", () => {
    expect(
      normalizeOptions({
        source: "schemas-folder"
      })
    ).toEqual({
      interfaceTarget: "/test/json-schema-interfaces",
      patterns: {},
      source: "/test/schemas-folder",
      validatorTarget: "/test/json-schema-validators",
      dereferencedTarget: "/test/json-schema-dereferenced"
    });
  });

  it("should handle interface target", () => {
    expect(
      normalizeOptions({
        interfaceTarget: "custom-interface-folder",
        source: "schemas-folder"
      })
    ).toEqual({
      interfaceTarget: "/test/custom-interface-folder",
      patterns: {},
      source: "/test/schemas-folder",
      validatorTarget: "/test/json-schema-validators",
      dereferencedTarget: "/test/json-schema-dereferenced"
    });
  });

  it("should handle validator target", () => {
    expect(
      normalizeOptions({
        validatorTarget: "custom-validator-folder",
        source: "schemas-folder"
      })
    ).toEqual({
      interfaceTarget: "/test/json-schema-interfaces",
      patterns: {},
      source: "/test/schemas-folder",
      validatorTarget: "/test/custom-validator-folder",
      dereferencedTarget: "/test/json-schema-dereferenced"
    });
  });

  it("should handle patterns", () => {
    fail("test me!");
  });
});
