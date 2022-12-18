import {yieldLinesAsync} from "../util";

export async function runDay1Async() {
    const elves = [];
    let currentElfCalories = 0;
    for await (const line of yieldLinesAsync(__dirname)) {
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
