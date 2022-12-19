import * as _ from 'lodash';
import {enumValues, yieldCharactersAsync} from "../util";

type Position = {
    x: number;
    y: number;
}

enum EdgesEnum {
    TOP = 'TOP',
    RIGHT = 'RIGHT',
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
}

class Map {
    private readonly grid: Tree[][];

    constructor(grid: Tree[][]) {
        this.grid = grid;
    }

    static async buildFromFileAsync() {
        const grid: Tree[][] = [];
        let row: Tree[] = [];
        for await (const character of yieldCharactersAsync(__dirname)) {
            if (character === '\n') {
                grid.push(row);
                row = [];
                continue;
            }
            const treeHeight = parseInt(character);
            if (Number.isNaN(treeHeight)) {
                throw new Error(`Unknown character: ${character}`);
            }

            const tree = new Tree(treeHeight, {
                x: row.length,
                y: grid.length
            });

            row.push(tree);
        }

        if (row.length > 0) {
            grid.push(row);
        }

        return new Map(grid);
    }

    * yieldTrees() {
        for (const row of this.grid) {
            yield* row;
        }
    }

    row(position: Position) {
        return this.grid[position.y];
    }

    column(position: Position) {
        return this.grid.map(row => row[position.x]);
    }
}

class Tree {
    readonly height: number;
    readonly position: Position;

    constructor(height: number, position: Position) {
        this.height = height;
        this.position = position;
    }

    neighboursToEdge(edge: EdgesEnum, map: Map) {
        switch (edge) {
            case EdgesEnum.TOP:
                return _(map.column(this.position)).slice(0, this.position.y).reverse().value();

            case EdgesEnum.RIGHT:
                return map.row(this.position).slice(this.position.x + 1);

            case EdgesEnum.BOTTOM:
                return map.column(this.position).slice(this.position.y + 1);

            case EdgesEnum.LEFT:
                return _(map.row(this.position)).slice(0, this.position.x).reverse().value();

            default:
                throw new Error(`Unknown edge: ${edge}`);
        }
    }

    isLargestInGrid(map: Map) {
        for (const edge of enumValues(EdgesEnum)) {
            const neighbors = this.neighboursToEdge(edge, map);
            if (neighbors.length === 0 || neighbors.every(it => it.height < this.height)) {
                return true;
            }
        }

        return false;
    }

    scenicScore(map: Map) {
        let score = 1;
        for (const edge of enumValues(EdgesEnum)) {
            let visibleTrees = 0;
            for (const neighbor of this.neighboursToEdge(edge, map)) {
                visibleTrees++;
                if (neighbor.height >= this.height) {
                    break;
                }
            }
            score *= visibleTrees;
        }

        return score;
    }
}

async function runPart1Async(map: Map) {
    const higherTrees: Tree[] = [];
    for (const tree of map.yieldTrees()) {
        if (tree.isLargestInGrid(map)) {
            higherTrees.push(tree);
        }
    }

    console.log(`Number of high trees: ${higherTrees.length}`);
}

async function runPart2Async(map: Map) {
    let bestScenicScore: number | undefined;
    for (const tree of map.yieldTrees()) {
        const score = tree.scenicScore(map);
        if (!bestScenicScore || bestScenicScore < score) {
            bestScenicScore = score;
        }
    }

    console.log(`Best tree has score of ${bestScenicScore}`);
}

export async function runDay8Async() {
    const map = await Map.buildFromFileAsync();
    await runPart1Async(map);
    await runPart2Async(map);
}
