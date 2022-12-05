import * as _ from 'lodash';
import {yieldLinesAsync} from "../util";

async function buildInitialStateAsync() {
    const lines: string[] = [];
    for await (const line of yieldLinesAsync(__dirname)) {
        if (line.trim() === '')
            break;

        lines.push(line);
    }

    const lastStackNumber = lines.pop().trim().split(' ').at(-1);
    const stacks: string[][] = new Array(parseInt(lastStackNumber)).fill(undefined).map(() => []);

    lines.reverse().forEach(line => {
        const chunk: string[] = [];

        const trimmed = line.replace(/^./, '');
        let currentStack = 0;
        for (let i = 0; i < trimmed.length; i++) {
            const char = trimmed[i];
            if (i % 4 !== 0) {
                continue;
            }

            if (char !== ' ') {
                stacks[currentStack].push(char);
            }
            currentStack++;
        }

        return chunk;
    })

    return stacks;
}

async function* yieldInstructions() {
    for await (const line of yieldLinesAsync(__dirname)) {
        if (!line.startsWith('move ')) {
            continue;
        }

        const [, quantityRaw, fromRaw, toRaw] = line.match(/move (\d+) from (\d+) to (\d+)/);

        yield {
            from: parseInt(fromRaw) - 1,
            to: parseInt(toRaw) - 1,
            quantity: parseInt(quantityRaw),
        }
    }
}

function printStacks(stacks: string[][]) {
    stacks.forEach((stack, index) => {
        console.log(index + 1, stack.join(' '))
    })
    console.log('==============')
}

async function part1Async() {
    const stacks = await buildInitialStateAsync();
    printStacks(stacks);

    for await (const instruction of yieldInstructions()) {
        for (let i = 1; i <= instruction.quantity; i++) {
            const crate = stacks[instruction.from].pop();
            if (!crate)
                throw new Error('No crate');

            stacks[instruction.to].push(crate);
        }
    }

    printStacks(stacks);

    const topCrates = stacks.map(s => s.at(-1)).join('')
    console.log(topCrates);
}

async function part2Async() {
    const stacks = await buildInitialStateAsync();
    printStacks(stacks);

    for await (const instruction of yieldInstructions()) {
        const fromStack = stacks[instruction.from];
        const toStack = stacks[instruction.to];

        const crates = fromStack.slice(-instruction.quantity);
        stacks[instruction.from] = fromStack.slice(0, -instruction.quantity);
        stacks[instruction.to] = [...toStack, ...crates];
    }

    printStacks(stacks);

    const topCrates = stacks.map(s => s.at(-1)).join('')
    console.log(topCrates);
}
async function main() {
    await part1Async();
    await part2Async();
}

main().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
})
