import WeightedSelector from './WeightedSelector.js';
import Word from './word.js';
import { ClusterEngine } from './SmartClusters.js';
import { Rule, Fragment } from './rule.js';
import ArbSorter from './ArbSorter.js';

const invalidItemAndWeight = (item) => {
    const parts = item.split(':');
    if (parts.length !== 2) {
        return true;
    }
    const weight = +parts[1];
    return Number.isNaN(weight) || weight < 0 || weight === Infinity;
};
class Category extends Map {
    weight;
    constructor(weight) {
        super();
        this.weight = weight;
    }
}
class SoundSystem {
    filters = [];
    phonemeset = {};
    ruleset = {};
    randpercent = 10;
    useAssim = false;
    useCoronalMetathesis = false;
    sorter = null;
    constructor() {
        Fragment.getRandomPhoneme = phoneme => {
            if (phoneme in this.phonemeset) {
                return this.phonemeset[phoneme].select();
            }
            return phoneme;
        };
    }
    applyFilters(word) {
        if (this.useAssim) {
            word.applyAssimilations();
        }
        if (this.useCoronalMetathesis) {
            word.applyCoronalMetathesis();
        }
        word.applyFilters(this.filters);
        return word;
    }
    addPhUnit(name, selection) {
        const naturalWeights = (phonemes) => {
            const jitter = (val, percent = 10) => val * (1 + percent * (Math.random() - 0.5) / 100);
            const phons = phonemes.split(/\s+/gu);
            const weighted = {};
            const numPhons = phons.length;
            for (let i = 0; i < numPhons; ++i) {
                weighted[phons[i]] = jitter(Math.log(numPhons + 1) - Math.log(i + 1));
            }
            let temp = '';
            for (const key in weighted) {
                temp += `${key}:${weighted[key]} `;
            }
            temp.trim();
            return temp;
        };
        const ruleToDict = (rule) => {
            const items = rule.trim().split(/\s+/gu);
            const dict = new Map();
            for (const item of items) {
                if (invalidItemAndWeight(item)) {
                    throw new Error(`'${item}' is not a valid phoneme and `
                        + 'weight.');
                }
                const [value, weight] = item.split(':');
                dict.set(value, +weight);
            }
            return dict;
        };
        if (!selection.includes(':')) {
            selection = naturalWeights(selection);
        }
        this.phonemeset[name] = new WeightedSelector(ruleToDict(selection));
    }
    addRule(rule, weight, cat = 'words:') {
        if (this.ruleset[cat]) {
            this.ruleset[cat].set(new Rule(rule), weight);
        }
        else {
            throw new Error(`uninitialized category '${cat}' referenced.`);
        }
    }
    addCategory(name, weight) {
        this.ruleset[name] = new Category(weight);
    }
    addFilter(pat, repl) {
        if (repl === '!') {
            this.filters.push([pat, '']);
        }
        else {
            this.filters.push([pat, repl]);
        }
    }
    addSortOrder(order) {
        this.sorter = new ArbSorter(order);
    }
    useIpa() {
        Word.clusterEngine = new ClusterEngine(true);
    }
    useDigraphs() {
        Word.clusterEngine = new ClusterEngine(false);
    }
    generate(numWords, verbose, sorted, category, removeDuplicates = true, force = false) {
        const words = new Set();
        const withDuplicateWords = new Array();

        Word.verbose = verbose;
        Word.sorter = this.sorter;
        if (!this.ruleset[category]) {
            throw new Error(`unknown category '${category}'.`);
        }
        const dict = new Map(
            // at ts-expect-error `Category` and `undefined` are both
            // individually valid, but no single overload matches both.
            this.ruleset[category]);
        // If the map is empty, add `category` to it with weight 0 to produce a
        // more legible error message.
        if (dict.size === 0) {
            dict.set(category, 0);
        }
        const ruleSelector = new WeightedSelector(dict);
        /*
         * If they request more words than are possible, we don't want to lock
         * up. Instead, try up to four times as many (note: is this good?),
         * and then cut off after that. However, this doesn't guarantee that
         * it's impossible to generate more. Setting `force` to true requires
         * it to generate that many words, or freeze if it can't. It's
         * currently only used in paragraph mode, which chooses one word at a
         * time. I think it's safe to assume it's always possible to generate
         * at least one valid word.
         */

        /*
         * Neonnaut edit: Increase a tally of rejected words and non unique words.
         * Reset tally when we get a unique word. End the loop when the tally is
         * four times greater than the amount of words requested.
         */

        var numOfRejects = 0;
        var numOfDuplicates = 0;

        for (let i = 0; i < 4_294_967_295; ++i) {

            if (removeDuplicates && !force) {
                if (numOfDuplicates > numWords * 5) {
                    break;
                }
            }

            if (numOfRejects > numWords * 5 && !force) {
                break;
            }

            const rule = ruleSelector.select();
            const form = rule.generate();
            const word = new Word(form, rule.toString());
            this.applyFilters(word);
            if (word.toString() !== 'REJECT') {

                words.add(word.toString());
                withDuplicateWords.push(word.toString());


                if (words.has(word.toString())) {
                    // We got a duplicate word
                    numOfDuplicates++;
                } else {
                    numOfDuplicates = 0;
                    numOfRejects = 0;
                }

                if (words.size === numWords) {
                    break;
                } else if (withDuplicateWords.length > numWords * 5 && !force) {
                    break;
                }
            } else {
                numOfRejects++;
            }
        }

        let wordList = [];
        if (removeDuplicates) {
            wordList = [...words];
        } else {
            wordList = withDuplicateWords;

        }

        if ((sorted && !verbose)) {
            if (this.sorter) {
                wordList = this.sorter.sort(wordList);
            }
            else {
                wordList.sort((Intl.Collator().compare));
            }
        }
        return wordList;
    }
    randomCategory() {
        const weightedCats = new Map();
        for (const cat in this.ruleset) {
            weightedCats.set(cat, this.ruleset[cat].weight);
        }
        const catSelector = new WeightedSelector(weightedCats);
        return catSelector.select();
    }
}

function createText(word_list) {

    let my_word_list = new Array();
    for (const cat in word_list) {
        my_word_list = my_word_list.concat(word_list[cat]);
    }

    let text = '';

    let wordsUntilPunct = Math.floor(Math.random() * 7) + 2;
    let sentenceLength = 0;

    let myPunct = '. ';
    let punctRando = 0;

    for (var j = 0; j < my_word_list.length; j++) {

        // Add word
        if (sentenceLength == 0) {
            text += my_word_list[j].charAt(0).toUpperCase() + my_word_list[j].slice(1);
        } else {
            text += my_word_list[j];
        }
        wordsUntilPunct = wordsUntilPunct - 1;
        sentenceLength++;

        // Add punct when enough words or at end of sentence
        if (wordsUntilPunct == 0 || (my_word_list.length - 1 == j && sentenceLength != 0)) {

            // Decide which punct to add
            punctRando = Math.random();
            if (punctRando <= 0.15 && myPunct != '?') {
                myPunct = '?'; sentenceLength = 0;
            } else if (punctRando <= 0.5 && myPunct != ',' && my_word_list.length - 1 != j && sentenceLength < 5) {
                myPunct = ',';
            } else {
                myPunct = '.'; sentenceLength = 0;
            }
            // Add punct
            text += myPunct;

            // Decide how many words to add until adding a new punct
            wordsUntilPunct = Math.random() * 7;
            if (wordsUntilPunct <= 0.3) {
                wordsUntilPunct = 1;
            } else if (wordsUntilPunct <= 1) {
                wordsUntilPunct = Math.floor(Math.random() * 7) + 2;
            } else if (wordsUntilPunct < 2) {
                wordsUntilPunct = 4;
            }
            wordsUntilPunct = Math.floor(wordsUntilPunct);
        }
        text += ' ';
    }
    return text;
}



const textify = (phsys, sentences = 25) => {
    let text = '';
    let gen_text = ''
    for (let i = 0; i < sentences; ++i) {
        const sent = Math.floor(Math.random() * 9) + 3;
        let comma = -1;
        if (sent >= 7) {
            comma = Math.floor(Math.random() * (sent - 1));
        }

        gen_text = phsys.generate(1, false, true, phsys.randomCategory(), true);
        if (gen_text != undefined && gen_text != '' && gen_text.length != 0) {
            text += gen_text[0].toString().replace(/./u, el => el.toUpperCase());


            for (let j = 0; j < sent; ++j) {
                gen_text = phsys.generate(1, false, true, phsys.randomCategory(), true);

                if (gen_text != undefined && gen_text != '' && gen_text.length != 0) {
                    text += gen_text;
                    if (j === comma) {
                        text += ',';
                    }
                }
            }
            text += Math.random() <= 0.85 ? '. ' : '? ';
        }
    }
    if (text == "") {
        throw new Error(`Could not generate any words (paragraph requested) .`);
    }
    return text.trim();
};

export { SoundSystem, createText, invalidItemAndWeight };