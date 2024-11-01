import getLexExample from "../../lexiwowee-modules/A_examples.js";
import genWords from "../../lexiwowee-modules/genwords.js";
//import generate_words from "../../lexiwowee-modules/A_main_lexiwowee.js";

function create_file_editor() {
    // Work out content and theme of file editor
    let content = ''; let theme = 'dark'; let filename = '';
    if (localStorage.hasOwnProperty('lexifer')) {
        try {
            let got_local_storage = JSON.parse(localStorage.getItem('lexifer'));
            content = got_local_storage[0]; filename = got_local_storage[1];
        } catch {
            localStorage.removeItem("lexifer");
            content = getLexExample('basic');
        }
    } else {
        content = getLexExample('basic');
    }
    if (localStorage.hasOwnProperty('colourScheme')) {
        if (localStorage.getItem('colourScheme') != 'dark-mode') {
            theme = 'light'
        }
    }

    //Create file editor
    return cm6.createEditorView(
        cm6.createEditorState(content, theme),
        document.getElementById("editor")
    );
}

$(window).on('load', function () {
    const editor = create_file_editor();

    // Watch for dark / light change in system settings for system theme people
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.hasOwnProperty('colourScheme')) {
            const scheme = event.matches ? "dark" : "light";
            if (scheme == "dark") {
                cm6.changeEditorTheme(editor, "dark");
            } else if (scheme == "light") {
                cm6.changeEditorTheme(editor, "light");
            }
        }
    });

    // Wrap lines checkbox
    $("#editor-wrap-lines").click(function () {
        if ($("#editor-wrap-lines").is(':checked')) {
            cm6.changeEditorLineWrap(editor, true);
        } else {
            cm6.changeEditorLineWrap(editor, false);
        }
    });

    //Examples buttons
    $("[class='lex-example']").click(function () {
        const choice = $(this).attr('value');
        const text = getLexExample(choice);
        var confirm = window.confirm("Clear input with example?");
        if (text != false && confirm != false) {
            editor.dispatch({
                changes: {
                    from: 0,
                    to: editor.state.doc.length,
                    insert: text
                }
            })
        }
    });

    // Generate words button
    $("#generate-words").click(function () {
        let output_message = document.getElementById('output-message');
        let file = editor.state.doc.toString();
        let output_words_field = document.getElementById('output-words-field');

        output_message.innerHTML = "";

        const words = genWords(
            file,
            parseInt($("#num-of-words").val()),
            $("#paragraph-mode").is(":checked"),
            $("#verbose-mode").is(":checked"),
            $("#sort-words").is(":checked"),
            $("#capitalise-words").is(":checked"),
            $("#remove-duplicates").is(":checked"),
            $("#force-words").is(":checked"),
            $("#word-divider").val(),
            (error) => {
                output_message.innerHTML +=
                    `<p class='error-message'>${error}</p>`;
            }
        );

        /*
        const { words, result_message, second_message } = generate_words(
            editor.state.doc.toString(),
            parseInt($("#num-of-words").val()),
            $("#paragraph-mode").is(":checked"),
            $("#verbose-mode").is(":checked"),
            $("#sort-words").is(":checked"),
            $("#capitalise-words").is(":checked"),
            $("#remove-duplicates").is(":checked"),
            $("#force-words").is(":checked"),
            $("#word-divider").val()
        );
        */

        // Transfer words to the output
        output_words_field.innerHTML = words;
        output_words_field.focus();

        let filename = $("#file-name").val();
        if (filename == '') { filename = 'lexifer'; }

        // Store file contents in localstorage to be retrieved on page refresh.
        localStorage.setItem('lexifer', JSON.stringify([file, filename]));
    });

    //Mode buttons
    $("input[name='mode-type']").click(function () {
        if ($("#word-list-mode").is(':checked')) {
            $("#sort-words").prop('disabled', false);
            $("#capitalise-words").prop('disabled', false);
            $("#remove-duplicates").prop('disabled', false);
            $("#word-divider").prop('disabled', false);
            $("#force-words").prop('disabled', false);

        } else {
            $("#sort-words").prop('disabled', true);
            $("#capitalise-words").prop('disabled', true);
            $("#remove-duplicates").prop('disabled', true);
            $("#word-divider").prop('disabled', true);
            $("#force-words").prop('disabled', true);
        }
    });

    //Load file button
    $("#load-file").click(function () {
        let input = document.createElement('input');

        input.type = 'file';
        input.onchange = _this => {
            let file = Array.from(input.files)[0], read = new FileReader();
            read.readAsText(file);
            read.onloadend = function () {
                file = read.result;

                let filename = Array.from(input.files)[0].name.replace(/\.[^/.]+$/, "");
                $("#file-name").val(filename);

                editor.dispatch({
                    changes: {
                        from: 0,
                        to: editor.state.doc.length,
                        insert: file
                    }
                })
                localStorage.setItem('lexifer', JSON.stringify([file, filename]));
            }
        };
        input.click();
        $("#editor").focus();
    });

    // Save file button
    $("#save-file").click(function () {
        let link = document.createElement("a");
        let file = editor.state.doc.toString();
        let file_boy = new Blob([file], { type: 'text/plain' });
        link.href = URL.createObjectURL(file_boy);


        let filename = $("#file-name").val();
        let ext_filename = filename;

        if (filename == '') { ext_filename = 'lexifer.txt'; } else { ext_filename = ext_filename + ".txt"; }
        if (filename == '') { filename = 'lexifer'; }

        link.download = ext_filename;
        link.click();
        URL.revokeObjectURL(link.href);
        // Save input text in user's localstorage for next session
        localStorage.setItem('lexifer', JSON.stringify([file, filename]));
    });

    //Copy results button
    $(document).on("click", "#output-words-copy", function () {
        let output_words_field = document.getElementById("output-words-field");

        if (output_words_field.value != "") {

            // Select text for depreciated way, and aesthetics.
            output_words_field.select();
            output_words_field.setSelectionRange(0, 99999); /*For mobile devices*/
            output_words_field.focus();

            if (!navigator.clipboard) {
                document.execCommand("copy"); // Depreciated way
            } else {
                navigator.clipboard.writeText(output_words_field.value);
            }
        }
    });
});