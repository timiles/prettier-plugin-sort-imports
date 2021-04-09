import * as ts from 'typescript';

export const newLineCharacters = '\n\n';

const PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE =
    'PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE';

export const newLineNode = ts.factory.createExpressionStatement(
    ts.factory.createStringLiteral(PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE),
);
