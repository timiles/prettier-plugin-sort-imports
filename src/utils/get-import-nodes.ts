import * as ts from 'typescript';

/**
 *
 * @param input
 */
export function getImportNodes(input: ts.SourceFile) {
    const importDeclarations: ts.ImportDeclaration[] = [];

    // Loop through the root AST nodes of the file
    ts.forEachChild(input, (node) => {
        if (ts.isImportDeclaration(node)) {
            importDeclarations.push(node);
        }
    });

    return importDeclarations;
}
