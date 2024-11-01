/*
 * Copyright (c) 2021-2022 William Baker
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
// Actual code run when you click "generate"

import PhonologyDefinition from './PhonologyDefinition.js';
import { ClusterEngine, Segment, Place, Manner } from './SmartClusters.js';
import ArbSorter from './ArbSorter.js';

// Original  -- returns a string
const genWords = (() => {
    const lexifer = (
        file,
        num_of_words = 100,

        paragraph_mode = false,
        verbose_mode = false,
        sort_words = true,
        capitalise_words = false,
        remove_duplicates = true,
        force_words = false,
        word_divider = " ",
        stderr = console.error
    ) => {

        // number of words
        if (isNaN(num_of_words)) {
            num_of_words = 100;
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
        if (paragraph_mode) {
            word_divider = '\n'
            sort_words = false;
            capitalise_words = false;
            remove_duplicates = false;
            force_words = false;
        } else if (verbose_mode) {
            word_divider = '\n'
            sort_words = false;
            capitalise_words = false;
        } else {
            word_divider = word_divider.replace(new RegExp('\\\\n', 'g'), '\n');
        }

        // Options
        if (typeof remove_duplicates != "boolean" || typeof sort_words != "boolean" ||
            typeof capitalise_words != "boolean" || typeof force_words != "boolean") {
            stderr(`Malformed options.`);
        }

        let ans = '';
        try {
            const phonDef = new PhonologyDefinition(file, stderr);

            if (paragraph_mode) {
                ans = phonDef.paragraph(num_of_words);
            } else {
                const words = phonDef.generate(num_of_words, verbose_mode, sort_words, remove_duplicates, force_words);

                for (const cat in words) {
                    if (cat !== 'words:') {
                        ans += `\n\n${cat}:\n`;
                    }

                    if (capitalise_words) {
                        for (let i = 0; i < words[cat].length; i++) {
                            words[cat][i] = words[cat][i].charAt(0).toUpperCase() + words[cat][i].slice(1);
                        }
                    }

                    ans += words[cat].join(word_divider || verbose_mode ? word_divider : ' ');
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