import * as ts from 'typescript';

/**
 * Removes imports from original file
 * @param code the whole file as text
 * @param nodes to be removed
 */
export const removeNodesFromOriginalCode = (
    code: string,
    nodes: (ts.ImportDeclaration | ts.ExpressionStatement)[],
) => {
    let text = code;
    for (const node of nodes) {
        const start = Number(node.pos);
        const end = Number(node.end);
        if (Number.isSafeInteger(start) && Number.isSafeInteger(end)) {
            text = text.replace(code.substring(start, end), '');
        }
    }
    return text;
};
