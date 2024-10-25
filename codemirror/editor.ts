import { Compartment, EditorState } from '@codemirror/state';
import { highlightSelectionMatches } from '@codemirror/search';
import { indentWithTab, defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { indentUnit, bracketMatching } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import {
    EditorView, keymap, lineNumbers,
    highlightActiveLineGutter, drawSelection, highlightActiveLine,
} from '@codemirror/view';

// Themes
import { xcodeLight, xcodeDark } from './dist';
const themeConfig = new Compartment();
const lineWrapConfig = new Compartment();

// Language
import { lexifer } from "./langdist";

function createEditorState(initialContents, myTheme) {
    let extensions = [
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        drawSelection(),
        indentUnit.of("  "),
        EditorState.allowMultipleSelections.of(true),
        bracketMatching(),
        closeBrackets(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
            indentWithTab,
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
        ]),
        lexifer(),
        themeConfig.of(themeIdentifier(myTheme)),
        lineWrapConfig.of([])
    ];

    return EditorState.create({
        doc: initialContents,
        extensions
    });
}

function createEditorView(state, parent) {
    return new EditorView({ state, parent });
}

function themeIdentifier(myTheme) {
    switch (myTheme) {
        case 'light':
            return xcodeLight;
        case 'dark':
            return xcodeDark;
        default:
            return xcodeLight;
    }
}

function changeEditorTheme(myEditor, myTheme) {
    myEditor.dispatch({
        effects: themeConfig.reconfigure(themeIdentifier(myTheme))
    })
}

function changeEditorLineWrap(myEditor, wrapping) {
    myEditor.dispatch({
        effects: [lineWrapConfig.reconfigure(
            wrapping ? EditorView.lineWrapping : []
        )]
    })
}

export { createEditorState, createEditorView, changeEditorTheme, changeEditorLineWrap };