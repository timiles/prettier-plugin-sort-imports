import { getCodeFromAst } from './utils/get-code-from-ast';
import { getSortedNodes } from './utils/get-sorted-nodes';
import { getImportNodes } from './utils/get-import-nodes';
import { PrettierOptions } from './types';
import * as ts from 'typescript';

export function preprocessor(code: string, options: PrettierOptions) {
    const { importOrder, importOrderSeparation } = options;

    const sourceFile = ts.createSourceFile(
        'filename',
        code,
        ts.ScriptTarget.ESNext,
        true,
        ts.ScriptKind.Deferred,
    );

    const transformFactory = (context: ts.TransformationContext) => (
        rootNode: ts.SourceFile,
    ): ts.SourceFile => {
        const visit = (node: ts.Node) => {
            node = ts.visitEachChild(node, visit, context);
            if (ts.isImportDeclaration(node)) {
                let sourceFileText = node.getSourceFile().text;
                const existingComments = ts.getLeadingCommentRanges(
                    sourceFileText,
                    node.pos,
                );
                if (existingComments) {
                    // Log existing comments just for fun
                    for (const comment of existingComments) {
                        console.log("=========START=========")
                        console.log(
                            sourceFileText.substring(comment.pos, comment.end),
                        );
                        console.log("=========END=========")
                    }
                    // Comment also attaches to the first child, we must remove it recursively.
                    let removeComments = (c: ts.Node) => {
                        if (c.getFullStart() === node.getFullStart()) {
                            ts.setTextRange(c, {
                                pos: c.getStart(),
                                end: c.getEnd(),
                            });
                        }
                        c = ts.visitEachChild(c, removeComments, context);
                        return c;
                    };
                    ts.visitEachChild(node, removeComments, context);
                    ts.setTextRange(node, {
                        pos: node.getStart(),
                        end: node.getEnd(),
                    }); 
                    ts.setSyntheticLeadingComments(node, [
                        {
                            pos: -1,
                            end: -1,
                            hasTrailingNewLine: false,
                            text: ' This is the new edited comment',
                            kind: ts.SyntaxKind.SingleLineCommentTrivia,
                        },
                    ]);
                }
            }
            return node;
        };

        return ts.visitNode(rootNode, visit);
    };

    const transformedSource = ts.transform(sourceFile, [transformFactory]);
    const importNodes = getImportNodes(transformedSource.transformed[0]);

    // short-circuit if there are no import declaration
    if (importNodes.length === 0) return code;

    const allImports = getSortedNodes(
        importNodes,
        importOrder,
        importOrderSeparation,
    );

    return getCodeFromAst(allImports, code, transformedSource.transformed[0]);
}
