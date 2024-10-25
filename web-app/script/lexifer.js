import getLexExample from "../../lexifer-modules/lexifer-examples.js"
import genWords from "../../lexifer-modules/genwords.js";

$(window).on('load', function () {

    // Work out content and theme of file editor
    let content = ''; let theme = 'dark';
    if (localStorage.hasOwnProperty('lexifer')) {
        content = localStorage.getItem('lexifer')
    } else {
        content = getLexExample('basic')
    }
    if (localStorage.hasOwnProperty('colourScheme')) {
        if (localStorage.getItem('colourScheme') != 'dark-mode') {
            theme = 'light'
        }
    }

    //Create file editor
    const view = cm6.createEditorView(
        cm6.createEditorState(content, theme),
        document.getElementById("editor")
    );

    // Watch for dark / light change in system settings for system theme people
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.hasOwnProperty('colourScheme')) {
            const scheme = event.matches ? "dark" : "light";
            if (scheme == "dark") {
                cm6.changeEditorTheme(view, "dark");
            } else if (scheme == "light") {
                cm6.changeEditorTheme(view, "light");
            }
        }
    });

    // Wrap lines checkbox
    $("#lexiferLineWrap").click(function () {
        if ($("#lexiferLineWrap").is(':checked')) {
            cm6.changeEditorLineWrap(view, true);
        } else {
            cm6.changeEditorLineWrap(view, false);
        }
    });

    //Examples buttons
    $("[class='lexifer-example']").click(function () {
        const choice = $(this).attr('value');
        const text = getLexExample(choice);
        var confirm = window.confirm("Clear input with example?");
        if (text != false && confirm != false) {
            view.dispatch({
                changes: {
                    from: 0,
                    to: view.state.doc.length,
                    insert: text
                }
            })
            localStorage.setItem('lexifer', text);
        }
    });

    // Generate words button
    $("[name='lexiferButton']").click(function () {
        const lexiferMessage = document.getElementById('lexiferMessage');
        lexiferMessage.innerHTML = "";

        let editor = view.state.doc.toString();
        let numOfWords = parseInt($("#numOfWords").val());
        let paragraph = $("#paragraph").is(":checked"); let verbose = $("#verbose").is(":checked");
        let sortWords = $("#sortWords").is(":checked"); let capitaliseWords = $("#capitaliseWords").is(":checked");
        let removeDuplicates = $("#removeDuplicates").is(":checked");
        let wordDivider = $("#wordDivider").val();

        const myWords = genWords(
            editor, numOfWords, wordDivider, paragraph, verbose, sortWords, capitaliseWords, removeDuplicates,
            (error) => {
                lexiferMessage.innerHTML +=
                    `<p class='error-message'>${error}</p>`;
            }
        );

        // Transfer words to the output
        $("#lexiferOutput").html(
            myWords
        );

        // Store file contents in localstorage to be retrieved on page refresh.
        localStorage.setItem('lexifer', view.state.doc.toString());
        $('#lexiferOutput').focus();
    });

    //Load file button
    $("[name='fakeLoadButton']").click(function () {
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = _this => {
            let file = Array.from(input.files)[0], read = new FileReader();
            read.readAsText(file);
            read.onloadend = function () {
                view.dispatch({
                    changes: {
                        from: 0,
                        to: view.state.doc.length,
                        insert: read.result
                    }
                })
                localStorage.setItem('lexifer', read.result);
            }
        };
        input.click();
        $("#editor").focus();
    });

    // Save file button
    $("[name='saveButton']").click(function () {
        const link = document.createElement("a");
        const text = view.state.doc.toString();
        const file = new Blob([text], { type: 'text/plain' });
        link.href = URL.createObjectURL(file);

        var filename = "lexifer.def";
        var fileLines = text.split("\n");

        for (var i = 0; i < fileLines.length; i++) {
            if (fileLines[i].trim().startsWith("name:")) {
                filename = fileLines[i].trim().substring(5).trim();
                filename += ".def"
            }
        }

        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
        // Save input text in user's localstorage for next session
        localStorage.setItem('lexifer', text);
    });

    //Copy results button
    $(document).on("click", "#copyLexiferResults", function () {
        var lexOutput = document.getElementById("lexiferOutput");
        if (lexOutput.value != "") {

            // Select text for depreciated way, and aesthetics.
            lexOutput.select();
            lexOutput.setSelectionRange(0, 99999); /*For mobile devices*/
            lexOutput.focus();

            if (!navigator.clipboard) {
                document.execCommand("copy"); // Depreciated way
            } else {
                navigator.clipboard.writeText(lexOutput.value);
            }
        }
    });
});