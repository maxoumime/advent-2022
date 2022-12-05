import * as fs from "fs";
import * as path from "path";
import {yieldLinesAsync} from "../common";
async function main() {
    const elves = [];
    let currentElfCalories = 0;
    for await (const line of yieldLinesAsync(path.join(__dirname, 'input.txt'))) {
        if (line === '') {
            elves.push(currentElfCalories);
            currentElfCalories = 0;
            continue;
        }
        currentElfCalories += Number(line);
    }
    elves.push(currentElfCalories);
    elves.sort((a, b) => b - a);

    console.log('Elf with the most calories: ', elves[0]);

    console.log('Total calories of the top 3 elves: ', elves[0] + elves[1] + elves[2]);
}

main().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
})
