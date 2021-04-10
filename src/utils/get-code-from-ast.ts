import * as ts from 'typescript';
import { removeNodesFromOriginalCode } from './remove-nodes-from-original-code';
import { newLineCharacters, shebangRegex } from '../constants';

/**
 * This function generate a code string from the passed nodes.
 * @param nodes all imports
 * @param originalCode
 */
export const getCodeFromAst = (
    nodes: (ts.ImportDeclaration | ts.ExpressionStatement)[],
    originalCode: string,
    sourceFile: ts.SourceFile,
) => {
    const shebang = shebangRegex.exec(originalCode);
    const nodesToRemoveFromCode = [...nodes];
    const codeWithoutImportsAndInterpreter = removeNodesFromOriginalCode(
        originalCode,
        nodesToRemoveFromCode,
    );

    const printer = ts.createPrinter();
    const nodeArray = ts.factory.createNodeArray(nodes);

    const result = printer.printList(
        ts.ListFormat.PreserveLines,
        nodeArray,
        sourceFile,
    );

    // TODO: clean up
    const interpreterDirective =
        (shebang && shebang[0] && `${shebang[0]}\n`) || '';

    return (
        interpreterDirective +
        result.replace(
            /"PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE";/gi,
            newLineCharacters,
        ) +
        codeWithoutImportsAndInterpreter.trim()
    );
};
