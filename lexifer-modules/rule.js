import last from './last.js';

const letterMatches = (fragment, letter) => letter === '!' || letter === '?'
    || ![...fragment].some(el => el !== '!' && el !== '?' && el !== letter);
const regexEscape = (str) => str.replace(/([[\]{}()*+?|^$:.\\])/gu, '\\$1');
class Rule {
    parts;
    str;
    constructor(rule) {
        // Guard against improper '!' that the loop won't catch.
        if (rule.includes('!!')) {
            throw new Error("misplaced '!' option: in non-duplicate "
                + `environment: '${rule}'.`);
        }
        this.parts = [];
        this.str = rule;
        // Segment the rule
        const fragmentedWord = [];
        let currentPart = '';
        // this parses `?C` better than `C?`, so transform it
        for (const letter of [...rule.replace(/(.)\?/gu, '?$1')].reverse()) {
            if (letterMatches(currentPart, letter)) {
                // potential match, but need to check for things like CCC! and
                // CC!C -- CC!C! is fine
                const breakRegex = new RegExp(`(${regexEscape(letter)}\\??){3,}!`, 'u');
                if (letter === '!'
                    ? /!\??$/u.test(currentPart)
                    : !breakRegex.test(letter + currentPart)) {
                    currentPart = letter + currentPart;
                    continue;
                }
            }
            fragmentedWord.push(currentPart);
            currentPart = letter;
        }
        fragmentedWord.push(currentPart);
        // Parse each segment
        for (const segment of fragmentedWord.filter(Boolean).reverse()) {
            const allowRepeats = !segment.endsWith('!');
            if (!allowRepeats && segment.length <= 2) {
                throw new Error("misplaced '!' option: in non-duplicate "
                    + `environment: '${rule}'.`);
            }
            const segmentAsArray = [...segment];
            const questionCount = segmentAsArray.filter(el => el === '?').length;
            const bangCount = allowRepeats
                ? 0
                : segmentAsArray.filter(el => el === '!').length;
            const letterCount = segment.length - bangCount - questionCount;
            this.parts.push(new Fragment(segmentAsArray.find(el => el !== '!' && el !== '?'), letterCount - questionCount, letterCount, allowRepeats));
        }
    }
    generate() {
        return this.parts.map(el => el.generate()).join('');
    }
    toString() {
        return this.str;
    }
}
class Fragment {
    value;
    minReps;
    maxReps;
    allowRepeats;
    static addOptional; // Filled in in PhDefParser
    static getRandomPhoneme; // Filled in in wordgen
    constructor(value, minReps, maxReps, allowRepeats) {
        this.value = value;
        this.minReps = minReps;
        this.maxReps = maxReps;
        this.allowRepeats = allowRepeats;
    }
    getPhoneme(word) {
        if (!word?.length) {
            return Fragment.getRandomPhoneme(this.value);
        }
        let val;
        do {
            val = Fragment.getRandomPhoneme(this.value);
        } while (!this.allowRepeats && val === last(word));
        return val;
    }
    generate() {
        if (this.maxReps === 1) {
            if (this.minReps === 0 && !Fragment.addOptional()) {
                return '';
            }
            return this.getPhoneme();
        }
        let i;
        const retVal = [];
        for (i = 0; i < this.minReps; ++i) {
            retVal.push(this.getPhoneme(retVal));
        }
        for (; i < this.maxReps; ++i) {
            if (Fragment.addOptional()) {
                retVal.push(this.getPhoneme(retVal));
            }
        }
        return retVal.join('');
    }
}

export { Rule, Fragment };