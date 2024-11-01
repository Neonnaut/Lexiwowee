

// We want to process options

// We want to process the file editor contents into a PhonDef object

// We want to generate word list array from the PhonDef object, with options:
// num_of_words, remove_duplicates, paragraph mode, show_generation_steps

// We want to process the word list array by options, sort_words and capitalise_words

/*We want to return:
* Word list
* Time it took to generate
* amount of words generated
* number of words rejected
* number of duplicate words removed
* How many filters to how many words
* Any info warnings; any error warnings
*/

function generate_words(
    editor,
    num_of_words = 100,

    paragraph_mode = false,
    verbose_mode = false,
    sort_words = true,
    capitalise_words = false,
    remove_duplicates = true,
    force_words = false,
    word_divider = " ") {
    return {
        words: "some words",
        results_message: "generated", second_message: "filters",
    }
}

export default generate_words;