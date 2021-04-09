// import generate from '@babel/generator';
// import { file, Statement, InterpreterDirective } from '@babel/types';
import * as ts from 'typescript';

// import { getAllCommentsFromNodes } from './get-all-comments-from-nodes';
import { removeNodesFromOriginalCode } from './remove-nodes-from-original-code';
import { newLineCharacters } from '../constants';

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
    // const allCommentsFromImports = getAllCommentsFromNodes(nodes);

    const nodesToRemoveFromCode = [
        ...nodes,
        // ...allCommentsFromImports,
        // ...(interpreter ? [interpreter] : []),
    ];

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

    // const newAST = file({
    //     type: 'Program',
    //     body: nodes,
    //     directives: [],
    //     sourceType: 'module',
    //     interpreter: interpreter,
    //     sourceFile: '',
    //     leadingComments: [],
    //     innerComments: [],
    //     trailingComments: [],
    //     start: 0,
    //     end: 0,
    //     loc: {
    //         start: { line: 0, column: 0 },
    //         end: { line: 0, column: 0 },
    //     },
    // });

    // const { code } = generate(newAST);

    return (
        result.replace(
            /"PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE";/gi,
            newLineCharacters,
        ) + codeWithoutImportsAndInterpreter.trim()
    );
};
