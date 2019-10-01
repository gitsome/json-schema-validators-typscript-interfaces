export interface Options {
    source: string;
    interfaceTarget?: string;
    validatorTarget?: string;
    patterns?: string;
}
export interface NormalizedOptions {
    source: string;
    interfaceTarget: string;
    validatorTarget: string;
    patterns: {
        [key: string]: JSON;
    };
}
declare const normalizeOptions: (options: Options) => NormalizedOptions;
export default normalizeOptions;
