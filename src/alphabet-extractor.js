/*
 *
 * Coding solution. Extractin alphabet order of a given sorted word list for take home challenge.
 *
 * Problem:
 * You are given a list of words sorted in alphabetical order. The only issue is that this alphabet isn’t English.
 * Can you determine the ordering of the alphabet?
 * Note that you can assume the list of words will have enough information to derive the complete order of the alphabet.
 *
 * Input: ‘bca', ‘aaa', ‘acb’
 * Output: ‘b’, ‘a’, ‘c’
 *
 */
`use strict`; // eslint-disable-line

import DTG from './directed-graph-tree';

/**
 * @description - Get all unique character set in a given word list.
 *
 * @function getUniqueCharSet
 * @param {array} words
 * @return {array}
 */
const getUniqueCharSet = (words) => {
    let uniqueChars = [];

    if (Array.isArray(words) && words.length && words.every((word) => typeof word === `string`)) {
        uniqueChars = [ ...new Set(words.map((word) => word.split(``)).flat()) ].sort();
    } else {
        console.warn(`WARN: getUniqueCharSet - Input words are not strings or invalid.`);
    }
    return uniqueChars;
};

/**
 * @description - Extract character ordered set from a given listed of sorted words.
 *
 * using example: [ 'bca', 'aaa', 'acb', 'ddb', 'dca' ], in the first recursive pass,
 * orderedCharMap =
 * {
 *    'b': [ 'bca' ],
 *    'a': [ 'aaa', 'acb' ],
 *    'd': [ 'ddb', 'dca' ]
 * }
 *
 * the second recursive pass
 * orderedCharMap =
 * {
 *    'a': [ 'aa' ],
 *    'c': [ 'cb' ]
 * }
 * and
 * {
 *    'd': [ 'db' ],
 *    'c': [ 'ca' ]
 * }
 *
 * @function getOrderedCharSet
 * @param {array} words
 * @return {array}
 */
const getOrderedCharSet = (words) => {
    let orderedChars = [];

    if (Array.isArray(words) && words.length && words.every((word) => typeof word === `string`)) {
        const orderedCharMap = words.reduce((_orderedCharMap, word) => {
            const firstChar = word.charAt(0);

            if (!_orderedCharMap.hasOwnProperty(firstChar)) {
                _orderedCharMap[firstChar] = [ word ];
            } else {
                _orderedCharMap[firstChar].push(word);
            }
            return _orderedCharMap;
        }, {});

        orderedChars = [ Object.keys(orderedCharMap) ];
        Object.values(orderedCharMap).filter((_words) => _words.length > 1).forEach((_words) => {
            const trimmedWords = _words.map((word) => word.substring(1));

            orderedChars.push(...getOrderedCharSet(trimmedWords));
        });
    } else {
        console.warn(`WARN: getOrderedCharSet - Input words are not strings or invalid.`);
    }
    return orderedChars.filter((orderedChar) => orderedChar.length > 1);
};

/**
 * @description - Extract alphabet characters from a given listed of sorted words.
 *                Assuming the given list of words will have enough information
 *                to derive the complete set of the alphabet.
 *
 *                Example proplem:
 *                      You are given a list of words sorted in alphabetical order. The only issue is that this alphabet isn’t English.
 *                      Can you determine the ordering of the alphabet?
 *                      Note that you can assume the list of words will have enough information to derive the complete order of the alphabet.
 *
 *                      Input:  [ bca, aaa, acb, ddb, dca ]
 *                      Output: [ b, a, d, c ]
 *
 *                Algorithm steps:
 *                      1) get a set unique chars from word list which should be:
 *                         [ a, b, d, c ]
 *                      2) get a set of ordered chars from word list which should be:
 *                         *b, c, a
 *                         *a, *a, a
 *                          a, *c, b
 *                         *d, *d, b
 *                          d, *c, a
 *
 *                         [ b, a, d ]
 *                         [ a, c ]
 *                         [ d, c ]
 *                      3) using the set of ordered chars information to construct a topology map using directed tree graph:
 *                         dtg: b → a → d
 *                                  ↓ ↙
 *                                  c
 *                      4) from the dtg, get the longest path of visited vertices which is the resulting alphabet.
 *                         longest path: [ b, a, d, c ]
 *
 * @function extractAlphabetChars
 * @param {array} words
 * @return {array}
 */
const extractAlphabetChars = (words) => {
    let alphabetChars = [];

    if (Array.isArray(words) && words.length && words.every((word) => typeof word === `string`)) {
        const dtg = new DTG();
        const uniqueChars = getUniqueCharSet(words);
        const orderedChars = getOrderedCharSet(words);

        // construct a topology map using a DTG
        dtg.addVertices(uniqueChars);
        orderedChars.forEach((orderedChar) => {
            dtg.createDaisyChainEdges(orderedChar);
        });

        // alphabetical characters result is the last item (longest set of visited vertices) in paths
        // getPaths function returns a set of all possible path of visited vertices sorted from short to longest
        alphabetChars = dtg.getPaths().pop();

        // check for loop connection in DTG. A correctly sorted word list should have no loop
        if (dtg.getLoopCount() !== 0) {
            console.warn(`WARN: extractAlphabetChars - Input list of words are not alphabetically sorted. Unable to derive the complete order of the alphabet.`);
        }

        // check for a fully connected DTG where there is only one root vertex and
        // compare the set of extracted alphabet and the set of unique characters in the word list. If they are not equal, then there are not enough information
        if (!dtg.isFullyConnected() || uniqueChars.join(``) !== [ ...alphabetChars ].sort().join(``)) {
            console.warn(`WARN: extractAlphabetChars - Input list of words do not have enough information to derive the complete order of the alphabet.`);
        }
    } else {
        console.warn(`WARN: extractAlphabetChars - Input words are not strings or invalid.`);
    }
    return alphabetChars;
};

export {
    getUniqueCharSet,
    getOrderedCharSet,
    extractAlphabetChars
};
