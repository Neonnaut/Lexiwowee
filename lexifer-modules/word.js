import last from './last.js';
import ArbSorter from './ArbSorter.js';

class Word {
    static verbose = false;
    static sorter = null;
    static clusterEngine = null;
    forms;
    filters;
    constructor(form, rule) {
        this.forms = [form];
        this.filters = [rule];
    }
    applyFilter(pat, repl) {
        let newWord = last(this.forms);

        // This thing does not like combining diacritics
        newWord = newWord.replace(new RegExp(pat, 'gu'), repl);

        if (newWord.includes('REJECT')) {
            newWord = 'REJECT';
        }
        if (newWord !== last(this.forms)) {
            this.forms.push(newWord);
            this.filters.push(`${pat} > ${repl || '!'}`);
        }
    }
    applyFilters(filters) {
        for (const filt of filters) {
            this.applyFilter(...filt);
            if (last(this.forms) === 'REJECT') {
                return;
            }
        }
    }
    applyAssimilations() {
        if (Word.sorter && Word.clusterEngine) {
            const newWord = Word.clusterEngine.applyAssimilations(Word.sorter.split(last(this.forms)))
                .join('');
            if (newWord !== last(this.forms)) {
                this.forms.push(newWord);
                this.filters.push('std-assimilations');
            }
        }
    }
    applyCoronalMetathesis() {
        if (Word.sorter && Word.clusterEngine) {
            const newWord = Word.clusterEngine.applyCoronalMetathesis(Word.sorter.split(last(this.forms)))
                .join('');
            if (newWord !== last(this.forms)) {
                this.forms.push(newWord);
                this.filters.push('coronal-metathesis');
            }
        }
    }
    toString() {
        if (Word.verbose) {
            let ans = '';
            for (const i in this.forms) {
                ans += `${this.filters[i]} – ${this.forms[i]}\n`;
            }
            return ans;
        }
        return last(this.forms);
    }
}

export default Word;