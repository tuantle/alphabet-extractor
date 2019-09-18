/**
 *
 * Unit tests for directed-graph-tree using tape.
 *
 */
'use strict'; // eslint-disable-line

import test from 'tape';

import DTG from '../src/directed-graph-tree';

export function runTests () {
    test(`\tRunning unit test for directed graph tree - should be able to create instant and add vertices:`, (assert) => {
        const dtg = new DTG();

        assert.notEqual(dtg, undefined);
        dtg.addVertices([ `a`, `b`, `c`, `d` ]);
        assert.same([
            dtg.hasVertex(`a`),
            dtg.hasVertex(`b`),
            dtg.hasVertex(`c`),
            dtg.hasVertex(`d`),
            dtg.hasVertex(`e`)
        ], [ true, true, true, true, false ]);
        assert.end();
    });
    test(`\tRunning unit test for directed graph tree - should be able to create an edge and daisy chain edges:`, (assert) => {
        const dtg = new DTG();

        dtg.addVertices([ `a`, `b`, `c`, `d`, `e` ]);
        dtg.createEdge(`a`, `b`);
        dtg.createDaisyChainEdges([ `b`, `c`, `d` ]);
        assert.same([
            dtg.hasEdge(`a`, `b`),
            dtg.hasEdge(`b`, `c`),
            dtg.hasEdge(`c`, `d`),
            dtg.hasEdge(`b`, `a`),
            dtg.hasEdge(`b`, `d`),
            dtg.hasEdge(`d`, `e`)
        ], [ true, true, true, false, false, false ]);
        assert.end();
    });
    test(`\tRunning unit test for directed graph tree - should be able to check for loops:`, (assert) => {
        const dtg = new DTG();

        dtg.addVertices([ `a`, `b`, `c`, `d` ]);
        dtg.createDaisyChainEdges([ `a`, `b`, `c`, `d` ]);
        assert.equal(dtg.getLoopCount(), 0);
        dtg.createEdge(`d`, `b`);
        assert.equal(dtg.getLoopCount(), 1);
        assert.end();
    });
    test(`\tRunning unit test for directed graph tree - should be able to check for connection completeness:`, (assert) => {
        const dtg = new DTG();

        dtg.addVertices([ `a`, `b`, `c`, `d`, `e`, `f` ]);
        dtg.createDaisyChainEdges([ `a`, `b`, `c` ]);
        dtg.createDaisyChainEdges([ `d`, `e`, `f` ]);
        assert.equal(dtg.isFullyConnected(), false);
        dtg.createEdge(`c`, `d`);
        assert.equal(dtg.isFullyConnected(), true);
        assert.end();
    });
    test(`\tRunning unit test for directed graph tree - should be able to get all possible paths in DTG:`, (assert) => {
        const dtg = new DTG();

        dtg.addVertices([ `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `x`, `y`, `z` ]);
        dtg.createDaisyChainEdges([ `a`, `b`, `e`, `f` ]);
        dtg.createEdge(`d`, `g`);
        dtg.createEdge(`d`, `x`);
        dtg.createEdge(`x`, `y`);
        dtg.createEdge(`x`, `z`);
        dtg.createDaisyChainEdges([ `b`, `c`, `d`, `e` ]);
        dtg.createEdge(`f`, `g`);
        dtg.createEdge(`h`, `i`);

        const paths = dtg.getPaths();

        assert.equal(paths.length, 6);
        assert.same(paths, [
            [ `h`, `i` ],
            [ `a`, `b`, `e`, `f`, `g` ],
            [ `a`, `b`, `c`, `d`, `g` ],
            [ `a`, `b`, `c`, `d`, `x`, `y` ],
            [ `a`, `b`, `c`, `d`, `x`, `z` ],
            [ `a`, `b`, `c`, `d`, `e`, `f`, `g` ]
        ]);
        assert.end();
    });
}
