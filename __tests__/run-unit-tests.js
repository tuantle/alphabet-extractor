/**
 *
 * Test suites runner.
 *
 */
'use strict'; // eslint-disable-line

/* eslint quotes: 0 */
require('@babel/register')({
    comments: false,
    sourceMaps: 'inline',
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current'
                }
            }
        ]
    ],
    plugins: [
        '@babel/plugin-transform-strict-mode',
        '@babel/plugin-proposal-object-rest-spread'
    ]
});

/* load test suites */
const directedGraphTreeUnitTests = require('./directed-graph-tree-unit-tests'); // eslint-disable-line
const alphabetExtractorUnitTests = require('./alphabet-extractor-unit-tests'); // eslint-disable-line

directedGraphTreeUnitTests.runTests();
alphabetExtractorUnitTests.runTests();
