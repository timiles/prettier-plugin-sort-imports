import * as ts from 'typescript';

export const flow: ParserPlugin = 'flow';
export const typescript: ParserPlugin = 'typescript';
export const decoratorsLegacy: ParserPlugin = 'decorators-legacy';
export const classProperties: ParserPlugin = 'classProperties';
export const jsx: ParserPlugin = 'jsx';

export const newLineCharacters = '\n\n';

const PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE =
    'PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE';

export const newLineNode = ts.factory.createExpressionStatement(
    ts.factory.createStringLiteral(PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE),
);
