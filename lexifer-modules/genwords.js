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