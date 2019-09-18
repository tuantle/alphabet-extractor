/*
 *
 * A simple directed tree graph implementation.
 *
 */
`use strict`; // eslint-disable-line

/**
 * @description - A DTG module.
 *
 * @module DTG
 * @return {object}
 */
const DTG = function () {
    const dtg = this;
    dtg._map = new Map();
};

DTG.prototype = {
    /* ----- DTG Prototype Definitions --------------------- */
    /**
     * @description - Private function to recursively travel up all possible path and collect visited vertices.
     *
     * @method _traverse
     * @param {object} startingNode - starting vertex's node
     * @param {array} visitedVertices - a list of visited vertices
     * @param {function} collect - a callback to collect the path after reaching the end
     * @returns {array}
     */
    _traverse: function (startingNode, visitedVertices, collect) {
        const dtg = this;
        const vertexStart = startingNode.vertexStart;

        if (dtg.isLeafVertex(vertexStart)) {
            // reach the end of one of the many possible paths. Collect the visited vertices
            collect(visitedVertices);
        } else if (dtg.isBranchVertex(vertexStart)) {
            // encounter a split, make copies and collect the visited vertex and continue traveling up all branches
            startingNode.vertexEnds.forEach((vertexEnd) => {
                const endingNode = dtg._map.get(vertexEnd);

                if (visitedVertices.includes(vertexEnd)) {
                    // reach a loop endpoint. Collect the visited vertices
                    console.warn(`WARN: DTG._traverse - Detecting a loop going from vertex ${vertexStart} to vertex ${vertexEnd}.`);
                    visitedVertices.push(vertexEnd);
                    collect(visitedVertices);
                } else {
                    dtg._traverse(endingNode, [ ...visitedVertices, vertexEnd ], collect);
                }
            });
        } else {
            // collect the visited vertex and continue traveling up
            const vertexEnd = startingNode.vertexEnds[0];
            const endingNode = dtg._map.get(vertexEnd);

            if (visitedVertices.includes(vertexEnd)) {
                // reach a loop endpoint. Collect the visited vertices and return
                console.warn(`WARN: DTG._traverse - Detecting a loop going from vertex ${vertexStart} to vertex ${vertexEnd}.`);
                visitedVertices.push(vertexEnd);
                collect(visitedVertices);
                return;
            }

            visitedVertices.push(vertexEnd);
            dtg._traverse(endingNode, visitedVertices, collect);
        }
    },
    /**
     * @description - Check if vertex is a root.
     *
     * @method isRootVertex
     * @returns {boolean}
     */
    isRootVertex: function (vertex) {
        const dtg = this;
        if (dtg.hasVertex(vertex)) {
            const node = dtg._map.get(vertex);

            return node.isRoot;
        }
        return false;
    },
    /**
     * @description - Check if vertex is a leaf.
     *
     * @method isLeafVertex
     * @returns {boolean}
     */
    isLeafVertex: function (vertex) {
        const dtg = this;
        if (dtg.hasVertex(vertex)) {
            const node = dtg._map.get(vertex);

            return !node.isRoot && node.vertexEnds.length === 0;
        }
        return false;
    },
    /**
     * @description - Check if vertex is a branch.
     *
     * @method isBranchVertex
     * @returns {boolean}
     */
    isBranchVertex: function (vertex) {
        const dtg = this;
        if (dtg.hasVertex(vertex)) {
            const node = dtg._map.get(vertex);

            return !node.isRoot && node.vertexEnds.length > 1;
        }
        return false;
    },
    /**
     * @description - Check if directed tree graph is completely connected where only one vertex is root.
     *
     * @method isFullyConnected
     * @returns {boolean}
     */
    isFullyConnected: function () {
        const dtg = this;
        if (dtg._map.size) {
            let count = 0;

            dtg._map.forEach((node) => {
                if (node.isRoot) {
                    count += 1;
                }
            });
            return count === 1;
        }
        return false;
    },
    /**
     * @description - Check if vertex exits.
     *
     * @method hasVertex
     * @returns {boolean}
     */
    hasVertex: function (vertex) {
        const dtg = this;
        return typeof vertex === `string` ? dtg._map.has(vertex) : false;
    },
    /**
     * @description - Check if there is an edge between two given vertices.
     *
     * @method hasEdge
     * @returns {boolean}
     */
    hasEdge: function (vertexStart, vertexEnd) {
        const dtg = this;

        if (typeof vertexStart === `string` && typeof vertexEnd === `string`) {
            if (dtg.hasVertex(vertexStart) && dtg.hasVertex(vertexEnd)) {
                let startingNode = dtg._map.get(vertexStart);

                return startingNode.vertexEnds.some((_vertexEnd) => _vertexEnd === vertexEnd);
            }
        } else {
            console.warn(`WARN: DTG.hasEdge - Input starting and ending vertices are not strings.`);
        }
        return false;
    },
    /**
     * @description - Get the number loop in DTG if exits.
     *                When retrieving all possible path of vertices in DTG,
     *                loops are detected when there is a duplication in visited vertices.
     *
     * @method getLoopCount
     * @returns {number}
     */
    getLoopCount: function () {
        const dtg = this;
        const paths = dtg.getPaths();

        return paths.reduce((count, visitedVertices) => {
            const hasLoop = [ ...new Set(visitedVertices) ].length !== visitedVertices.length;
            return hasLoop ? count + 1 : count;
        }, 0);
    },
    /**
     * @description - Add a list of vertices.
     *
     * @method addVertices
     * @param {array} vertices - a list of vertices to add
     * @returns {void}
     */
    addVertices: function (vertices) {
        const dtg = this;

        if (Array.isArray(vertices) && vertices.length && vertices.every((vertex) => typeof vertex === `string`)) {
            vertices.filter((vertex) => {
                if (dtg.hasVertex(vertex)) {
                    console.error(`WARN: DTG.addVertices - Vertex ${vertex} is already added.`);
                    return false;
                }
                return true;
            }).forEach((vertex) => {
                const node = {
                    vertexStart: vertex,
                    isRoot: true,
                    vertexEnds: []
                };

                dtg._map.set(vertex, node);
            });
        } else {
            console.warn(`WARN: DTG.addVertices - Input vertices are not strings or invalid.`);
        }
    },
    /**
     * @description - Create a forward edge from starting to ending vertices.
     *
     * @method createEdge
     * @param {string} vertexStart - starting vertex of an edge
     * @param {string} vertexEnd - ending vertex of an edge
     * @returns {void}
     */
    createEdge: function (vertexStart, vertexEnd) {
        const dtg = this;

        if (typeof vertexStart === `string` && typeof vertexEnd === `string`) {
            if (vertexStart === vertexEnd) {
                console.error(`ERROR: DTG.createEdge - Cannot connect vertex ${vertexStart} to itself.`);
            } else if (!dtg.hasVertex(vertexStart)) {
                console.error(`ERROR: DTG.createEdge - Starting vertex ${vertexStart} is not found.`);
            } else if (!dtg.hasVertex(vertexEnd)) {
                console.error(`ERROR: DTG.createEdge - Ending vertex ${vertexEnd} is not found.`);
            } else if (dtg.hasEdge(vertexStart, vertexEnd)) {
                console.error(`ERROR: DTG.createEdge - Starting vertex ${vertexStart} and ending vertex ${vertexEnd} are already connected.`);
            } else {
                let startingNode = dtg._map.get(vertexStart);
                let endingNode = dtg._map.get(vertexEnd);

                startingNode.vertexEnds.push(vertexEnd);
                endingNode.isRoot = false;

                dtg._map.set(vertexStart, startingNode);
                dtg._map.set(vertexEnd, endingNode);
            }
        } else {
            console.warn(`WARN: DTG.createEdge - Input starting and ending vertices are not strings.`);
        }
    },
    /**
     * @description - Create forward daisy chain edges from vertices.
     *
     * @method createDaisyChainEdges
     * @param {array} vertices - a list of vertices
     * @returns {void}
     */
    createDaisyChainEdges: function (vertices) {
        const dtg = this;

        if (Array.isArray(vertices) && vertices.length && vertices.every((vertex) => typeof vertex === `string`)) {
            let vertexStart;
            let vertexEnd;

            vertices.forEach((vertex, index) => {
                if (index > 0) {
                    vertexEnd = vertex;
                    dtg.createEdge(vertexStart, vertexEnd);
                }
                vertexStart = vertex;
            });
        } else {
            console.warn(`WARN: DTG.createDaisyChainEdges - Input vertices are not strings or invalid.`);
        }
    },
    /**
     * @description - Get a list of all possible paths of DTG. Results are sorted from shortest to longest path.
     *                Examples:
     *                  vertices:
     *                    a, b, c, d, e, f, g
     *                  connections:
     *                    e -
     *                    a - b - c - d
     *                            |
     *                            f - g
     *                  result paths:
     *                    [[ e ],
     *                     [ a, b, c, d ],
     *                     [ a, b, c, f, g ]]
     *
     * @method getPaths
     * @returns {array}
     */
    getPaths: function () {
        const dtg = this;
        let paths = [];

        if (dtg._map.size) {
            const collect = (visitedVertices) => {
                paths.push(visitedVertices);
            };

            dtg._map.forEach((node) => {
                if (node.isRoot) {
                    const rootNode = node;
                    let visitedVertices = [ rootNode.vertexStart ];

                    // traverse up DTG and collect all paths of visited vertices
                    dtg._traverse(rootNode, visitedVertices, collect);
                }
            });

            // sort the paths from shortest to longest
            paths = paths.sort((pathA, pathB) => {
                if (pathA.length < pathB.length) {
                    return -1;
                }
                return 1;
            });
        }
        return paths;
    }
};

export default DTG;
