/**
 *
 * Unit tests for alphabet-extractor using tape.
 *
 */
'use strict'; // eslint-disable-line

import test from 'tape';

import {
    getUniqueCharSet,
    getOrderedCharSet,
    extractAlphabetChars
} from '../src/alphabet-extractor';

export function runTests () {
    test(`\tRunning unit test for getUniqueCharSet - should be able to get a set of unique chars from a word list:`, (assert) => {
        assert.same(getUniqueCharSet([ `bca`, `aaa`, `acb`, `ddb`, `dca` ]).sort(), [ `a`, `b`, `c`, `d` ]);
        assert.end();
    });
    test(`\tRunning unit test for getOrderedCharSet - should be able to get a set of ordered chars from a word list:`, (assert) => {
        assert.same(getOrderedCharSet([ `bca`, `aaa`, `acb`, `ddb`, `dca` ]), [[ `b`, `a`, `d` ], [ `a`, `c` ], [ `d`, `c` ]]);
        assert.end();
    });
    test(`\tRunning unit test for extractAlphabetChars - should be able to get the complete set of the alphabet from a word list:`, (assert) => {
        // assert.same(extractAlphabetChars([ `bca`, `aaa`, `acb` ]), [ `b`, `a`, `c` ]);
        assert.same(extractAlphabetChars([ `bca`, `aaa`, `acb`, `ddb`, `dca` ]), [ `b`, `a`, `d`, `c` ]);
        assert.end();
    });
}
