import { getCodeFromAst } from './utils/get-code-from-ast';
import { getSortedNodes } from './utils/get-sorted-nodes';
import { getImportNodes } from './utils/get-import-nodes';
// import { getParserPlugins } from './utils/get-parser-plugins';
import { PrettierOptions } from './types';
import * as ts from 'typescript';

export function preprocessor(code: string, options: PrettierOptions) {
    const {
        importOrder,
        importOrderSeparation,
        // parser: prettierParser,
        // experimentalBabelParserPluginsList = [],
    } = options;

    const sourceFile = ts.createSourceFile(
        'filename',
        code,
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.Deferred,
    );

    const importNodes = getImportNodes(sourceFile);

    // TODO: Interpreter shebang

    // short-circuit if there are no import declaration
    if (importNodes.length === 0) return code;

    const allImports = getSortedNodes(
        importNodes,
        importOrder,
        importOrderSeparation,
    );

    return getCodeFromAst(allImports, code, sourceFile);
}
