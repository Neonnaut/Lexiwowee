var Place;
(function (Place) {
    Place[Place["Bilabial"] = 0] = "Bilabial";
    Place[Place["Labiodental"] = 1] = "Labiodental";
    Place[Place["Alveolar"] = 2] = "Alveolar";
    Place[Place["Postalveolar"] = 3] = "Postalveolar";
    Place[Place["Retroflex"] = 4] = "Retroflex";
    Place[Place["Palatal"] = 5] = "Palatal";
    Place[Place["Velar"] = 6] = "Velar";
    Place[Place["Uvular"] = 7] = "Uvular";
})(Place || (Place = {}));
var Manner;
(function (Manner) {
    Manner[Manner["Plosive"] = 0] = "Plosive";
    Manner[Manner["Fricative"] = 1] = "Fricative";
    Manner[Manner["Nasal"] = 2] = "Nasal";
    Manner[Manner["Sibilant"] = 3] = "Sibilant";
    Manner[Manner["LateralFricative"] = 4] = "LateralFricative";
    Manner[Manner["LateralAffricate"] = 5] = "LateralAffricate";
    Manner[Manner["Affricate"] = 6] = "Affricate";
})(Manner || (Manner = {}));
/**
 * This class represents a single consonant phone, including features and
 * notations.
 */
class Segment {
    representation;
    voiced;
    place;
    manner;
    /**
     * Create a new segment with the given features.
     * @param representation The string representation of the segment.
     * @param voiced `true` iff the segment is voiced.
     * @param place The place of articulation of the consonant.
     * @param manner The manner of articulation of the consonant.
     */
    constructor(representation, voiced, place, manner) {
        this.representation = representation;
        this.voiced = voiced;
        this.place = place;
        this.manner = manner;
    }
    /** `true` iff the phoneme is a plosive or nasal. */
    get isStop() {
        return this.manner === Manner.Nasal || this.manner === Manner.Plosive;
    }
    /** `true` iff the phoneme is bilabial or velar. */
    get isPeripheral() {
        return this.place === Place.Bilabial || this.place === Place.Velar;
    }
    toString() {
        return this.representation;
    }
}
class ClusterEngine {
    /**
     * The list of all recognized consonant segments. This is an array for a
     * reason: in order for the labial-and-labiodental phonemes to work
     * properly, this must be ordered.
     */
    segments;
    /**
     * Initialize the cluster engine.
     * @param isIpa Whether the current featureset is IPA.
     */
    constructor(isIpa) {
        this.segments = [
            // Bilabial, labio-dental
            new Segment('p', false, Place.Bilabial, Manner.Plosive),
            new Segment('b', true, Place.Bilabial, Manner.Plosive),
            new Segment(isIpa ? 'ɸ' : 'ph', false, Place.Bilabial, Manner.Fricative),
            new Segment(isIpa ? 'β' : 'bh', true, Place.Bilabial, Manner.Fricative),
            new Segment('f', false, Place.Labiodental, Manner.Fricative),
            new Segment('v', true, Place.Labiodental, Manner.Fricative),
            new Segment('m', true, Place.Bilabial, Manner.Nasal),
            new Segment('m', true, Place.Labiodental, Manner.Nasal),
            // Alveolar
            new Segment('t', false, Place.Alveolar, Manner.Plosive),
            new Segment('d', true, Place.Alveolar, Manner.Plosive),
            new Segment('s', false, Place.Alveolar, Manner.Sibilant),
            new Segment('z', true, Place.Alveolar, Manner.Sibilant),
            new Segment(isIpa ? 'θ' : 'th', false, Place.Alveolar, Manner.Fricative),
            new Segment(isIpa ? 'ð' : 'dh', true, Place.Alveolar, Manner.Fricative),
            new Segment(isIpa ? 'ɬ' : 'lh', false, Place.Alveolar, Manner.LateralFricative),
            new Segment(isIpa ? 'ɮ' : 'ldh', true, Place.Alveolar, Manner.LateralFricative),
            new Segment(isIpa ? 'tɬ' : 'tl', false, Place.Alveolar, Manner.LateralAffricate),
            new Segment(isIpa ? 'dɮ' : 'dl', true, Place.Alveolar, Manner.LateralAffricate),
            new Segment('ts', false, Place.Alveolar, Manner.Affricate),
            new Segment('dz', true, Place.Alveolar, Manner.Affricate),
            new Segment(isIpa ? 'ʃ' : 'sh', false, Place.Postalveolar, Manner.Sibilant),
            new Segment(isIpa ? 'ʒ' : 'zh', true, Place.Postalveolar, Manner.Sibilant),
            new Segment(isIpa ? 'tʃ' : 'ch', false, Place.Postalveolar, Manner.Affricate),
            new Segment(isIpa ? 'dʒ' : 'j', true, Place.Postalveolar, Manner.Affricate),
            new Segment('n', true, Place.Alveolar, Manner.Nasal),
            // Retroflex
            new Segment(isIpa ? 'ʈ' : 'rt', false, Place.Retroflex, Manner.Plosive),
            new Segment(isIpa ? 'ɖ' : 'rd', true, Place.Retroflex, Manner.Plosive),
            new Segment(isIpa ? 'ʂ' : 'sr', false, Place.Retroflex, Manner.Sibilant),
            new Segment(isIpa ? 'ʐ' : 'zr', true, Place.Retroflex, Manner.Sibilant),
            new Segment(isIpa ? 'ʈʂ' : 'rts', false, Place.Retroflex, Manner.Affricate),
            new Segment(isIpa ? 'ɖʐ' : 'rdz', true, Place.Retroflex, Manner.Affricate),
            new Segment(isIpa ? 'ɳ' : 'rn', true, Place.Retroflex, Manner.Nasal),
            // Palatal
            new Segment(isIpa ? 'c' : 'ky', false, Place.Palatal, Manner.Plosive),
            new Segment(isIpa ? 'ɟ' : 'gy', true, Place.Palatal, Manner.Plosive),
            new Segment(isIpa ? 'ɕ' : 'sy', false, Place.Palatal, Manner.Sibilant),
            new Segment(isIpa ? 'ʑ' : 'zy', true, Place.Palatal, Manner.Sibilant),
            new Segment(isIpa ? 'ç' : 'hy', false, Place.Palatal, Manner.Fricative),
            new Segment(isIpa ? 'ʝ' : 'yy', true, Place.Palatal, Manner.Fricative),
            new Segment(isIpa ? 'tɕ' : 'cy', false, Place.Palatal, Manner.Affricate),
            new Segment(isIpa ? 'dʑ' : 'jy', true, Place.Palatal, Manner.Affricate),
            new Segment(isIpa ? 'ɲ' : 'ny', true, Place.Palatal, Manner.Nasal),
            // Velar
            new Segment('k', false, Place.Velar, Manner.Plosive),
            new Segment('g', true, Place.Velar, Manner.Plosive),
            new Segment(isIpa ? 'x' : 'kh', false, Place.Velar, Manner.Fricative),
            new Segment(isIpa ? 'ɣ' : 'gh', true, Place.Velar, Manner.Fricative),
            new Segment(isIpa ? 'ŋ' : 'ng', true, Place.Velar, Manner.Nasal),
            // Uvular
            new Segment('q', false, Place.Uvular, Manner.Plosive),
            new Segment(isIpa ? 'ɢ' : 'gq', true, Place.Uvular, Manner.Plosive),
            new Segment(isIpa ? 'χ' : 'qh', false, Place.Uvular, Manner.Fricative),
            new Segment(isIpa ? 'ʁ' : 'gqh', true, Place.Uvular, Manner.Fricative),
            new Segment(isIpa ? 'ɴ' : 'nq', true, Place.Uvular, Manner.Nasal)
        ];
    }
    getSegment(features) {
        return this.segments.find(el => (features.voiced === undefined || el.voiced === features.voiced)
            && (features.place === undefined || el.place === features.place)
            && (features.manner === undefined
                || el.manner === features.manner));
    }
    /**
     * Apply `std-assimilations` to a word.
     * @param word The word, as an array of graphs.
     * @returns A copy of the word that has assimilations applied to it.
     * @example
     * let origWord = ['a', 'n', 'p', 'a'];
     * let newWord = ce.applyAssimilations(origWord);
     * // newWord = ['a', 'm', 'p', 'a']
     */
    applyAssimilations(word) {
        const nasalAssimilate = (ph1, ph2) => {
            const data1 = this.segments.find(el => el.representation === ph1);
            if (data1 && data1.manner === Manner.Nasal) {
                const data2 = this.segments.find(el => el.representation === ph2);
                if (data2) {
                    const result = this.segments.find(el => el.place === data2.place
                        && el.manner === Manner.Nasal);
                    if (result) {
                        return result.representation;
                    }
                }
            }
            return ph1;
        };
        const voiceAssimilate = (ph1, ph2) => {
            const data2 = this.segments.find(el => el.representation === ph2);
            if (data2) {
                const data1 = this.segments.find(el => el.representation === ph1);
                if (data1) {
                    const result = this.segments.find(el => el.voiced === data2.voiced
                        && el.place === data1.place
                        && el.manner === data1.manner);
                    if (result) {
                        return result.representation;
                    }
                }
            }
            return ph1;
        };
        const newArr = [...word];
        for (let i = 0; i < word.length - 1; ++i) {
            newArr[i] = voiceAssimilate(word[i], word[i + 1]);
            newArr[i] = nasalAssimilate(newArr[i], word[i + 1]);
        }
        return newArr;
    }
    /**
     * Apply `coronal-metathesis` to a word.
     * @param word The word, as an array of graphs.
     * @returns A copy of the word that has coronal metathesis applied to it.
     * @example
     * let origWord = ['a', 't', 'p', 'a'];
     * let newWord = ce.applyCoronalMetathesis(origWord);
     * // newWord = ['a', 'p', 't', 'a']
     */
    applyCoronalMetathesis(word) {
        const coronalMetathesis = (ph1, ph2) => {
            const data1 = this.segments.find(el => el.representation === ph1);
            if (data1 && data1.place === Place.Alveolar) {
                const data2 = this.segments.find(el => el.representation === ph2);
                if (data2?.isPeripheral
                    && data2.isStop
                    && data2.manner === data1.manner) {
                    return [ph2, ph1];
                }
            }
            return [ph1, ph2];
        };
        const newArr = [...word];
        for (let i = 0; i < word.length - 1; ++i) {
            [newArr[i], newArr[i + 1]] = coronalMetathesis(newArr[i], word[i + 1]);
        }
        return newArr;
    }
}

export { ClusterEngine, Segment, Place, Manner };