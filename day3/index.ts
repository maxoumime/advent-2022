import {yieldLinesAsync} from "../util";
import * as path from "path";

async function* yieldRucksacks() {
    for await (const fullRucksack of yieldLinesAsync(__dirname)) {
        if (fullRucksack.length % 2 !== 0)
            throw new Error(`Don't know how to deal with odd lengths.`);

        const rucksackA = fullRucksack.slice(0, fullRucksack.length / 2);
        const rucksackB = fullRucksack.slice(fullRucksack.length / 2);

        yield [rucksackA, rucksackB];
    }
}

function convertToPriority(letter: string) {
    const charCode = letter.charCodeAt(0);

    if (letter.toLowerCase() === letter) {
        return charCode - 96;
    }

    return charCode - 64 + 26;
}

async function part1Async() {
    const commonItems = [];
    for await (const [rucksackA, rucksackB] of yieldRucksacks()) {
        const commonItem = [...rucksackA].find(letter => rucksackB.includes(letter));
        commonItems.push(commonItem);
    }

    const total = commonItems.map(convertToPriority).reduce((acc, priority) => acc + priority, 0);
    console.log(total);
}

async function* yieldGroups() {
    const rucksackGenerator = yieldLinesAsync(__dirname)
    while (true) {
        const group = [
            (await rucksackGenerator.next()).value,
            (await rucksackGenerator.next()).value,
            (await rucksackGenerator.next()).value,
        ];

        if (!group.every(it => it)) {
            break;
        }

        yield group as [string, string, string];
    }
}

async function part2Async() {
    let total = 0;
    for await (const group of yieldGroups()) {
        const commonLetter = [...group[0]].find(letter => {
           return group.every(rucksack => rucksack.includes(letter));
        });
        total += convertToPriority(commonLetter);
    }
    console.log(total);
}

async function main() {
    await part1Async();
    await part2Async();
}

main().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
})
