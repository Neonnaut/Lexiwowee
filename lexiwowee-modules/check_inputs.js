


function check_inputs(file, num_of_words = 100, mode, word_divider = " ",
    remove_duplicates = true, force_word_gen = false, capitalise_words = false, sort_words = true
) {

    if (!file) {
        stderr(`File editor was empty.`);
    }

    // number of words
    if (isNaN(num_of_words)) {
        num_of_words = 100;
        forceNum = true;
    }
    if (num_of_words <= 0 || num_of_words === Infinity) {
        stderr(`Error: Cannot generate ${num_of_words} words. Generating 100 words instead.`);
        num_of_words = 100;
    }
    if (num_of_words >= 1000000) {
        stderr(`Error: Cannot generate more than ${num_of_words} words. Generating 1,000,000 words instead.`);
        num_of_words = 100;
    }
    if (num_of_words !== Math.round(num_of_words)) {
        stderr(`Info: Requested number of words (${num_of_words}) is not an `
            + `integer. Rounding to ${Math.round(num_of_words)}.`);
        num_of_words = Math.round(num_of_words);
    }

    // Mode and word divider
    if (mode == 'word-list') {
        word_divider = word_divider.replace(new RegExp('\\\\n', 'g'), '\n');
    } else if (mode == 'paragraph') {
        word_divider = '\n'
        sort_words = false;
        capitalise_words = false;
        remove_duplicates = false;
        force_word_gen = false;
    } else if (mode == 'verbose') {
        word_divider = '\n'
        sort_words = false;
        capitalise_words = false;
    } else {
        stderr(`Malformed mode "${mode}". Using word-list mode instead.`);
        word_divider = word_divider.replace(new RegExp('\\\\n', 'g'), '\n');
        mode = 'word-list';
    }

    // Options
    if (typeof remove_duplicates != "boolean" || typeof force_word_gen != "boolean" ||
        typeof force_word_gen != "boolean" || typeof force_word_gen != "boolean") {
        stderr(`Malformed options.`);
    }


}

// Original  -- returns a string
const genWords = (() => {
    const lexifer = (
        file, num, wordDivider = " ", paragraph = false, verbose = false, sorted = true, capitaliseWords = false,
        removeDuplicates = true,
        stderr = console.error
    ) => {

        wordDivider = wordDivider.replace(new RegExp('\\\\n', 'g'), '\n');

        let ans = '';
        try {
            const phonDef = new PhonologyDefinition(file, stderr);
            var forceNum = false;

            if (isNaN(num)) {
                num = 100;
                forceNum = true;
            }
            if (num <= 0 || num === Infinity) {
                stderr(`Error: Cannot generate ${num} words. Generating 100 words instead.`);
                num = 100;
            }

            if (paragraph) {
                if (verbose) {
                    stderr("Info: 'Show generation steps' option ignored in paragraph mode.");
                }
                if (wordDivider) {
                    stderr("Info: 'Word divider' option ignored in paragraph mode.");
                }
                wordDivider = "\n";
                if (capitaliseWords) {
                    stderr("Info: 'Capitalise words' option ignored in paragraph mode.");
                }
                if (removeDuplicates) {
                    stderr("Info: 'Remove duplicates' option ignored in paragraph mode.");
                }
                removeDuplicates = false;
                capitaliseWords = false;
                if (sorted) {
                    stderr("Info: 'Sorted' option ignored in paragraph mode.");
                }

                ans = phonDef.paragraph(num);

            }
            else {
                if (num !== Math.round(num)) {
                    stderr(`Info: Requested number of words (${num}) is not an `
                        + `integer. Rounding to ${Math.round(num)}.`);
                    num = Math.round(num);
                }
                if (verbose) {
                    if (wordDivider) {
                        stderr("Info: 'Word divider' option ignored in verbose mode.");
                    }
                    if (capitaliseWords) {
                        stderr("Info: 'Capitalise words' option ignored in verbose mode.");
                    }
                    capitaliseWords = false;

                    wordDivider = "\n";
                    if (sorted) {
                        stderr("Info: 'Sorted' option ignored in verbose mode.");
                    }
                }
                const words = phonDef.generate(num, verbose, sorted, removeDuplicates);

                for (const cat in words) {
                    if (cat !== 'words:') {
                        ans += `\n\n${cat}:\n`;
                    }

                    if (capitaliseWords) {
                        for (let i = 0; i < words[cat].length; i++) {
                            words[cat][i] = words[cat][i].charAt(0).toUpperCase() + words[cat][i].slice(1);
                        }
                    }

                    ans += words[cat].join(wordDivider || verbose ? wordDivider : ' ');
                }
            }
        }
        catch (e) { stderr(e); }
        return ans;
    };

    lexifer.ClusterEngine = ClusterEngine;
    lexifer.Segment = Segment;
    lexifer.Place = Place;
    lexifer.Manner = Manner;
    lexifer.__ArbSorter = ArbSorter;
    return lexifer;
})();

export default genWords;