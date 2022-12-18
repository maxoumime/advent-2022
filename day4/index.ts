import {yieldLinesAsync} from "../util";
import * as path from "path";

function toStartEnd(sectionRaw: string) {
    return sectionRaw.split('-').map(c => {
        const number = parseInt(c)
        if (isNaN(number)) {
            throw new Error('Unknown number: ' + c);
        }
        return number;
    });
}
function toSection(section: number[]) {
    const [start, end] = section;
    let sections = [];
    for (let i = start; i <= end; i++) {
        sections.push(i)
    }
    return sections;
}

async function* yieldPairs() {
    for await (const line of yieldLinesAsync(__dirname)) {
        const [sectionA, sectionB] = line.split(',');

        if (!sectionA || !sectionB) {
            break;
        }

        yield [toStartEnd(sectionA), toStartEnd(sectionB)];
    }
}

function isFullyOverlapping(sectionA: number[], sectionB: number[]) {
    return sectionA[0] <= sectionB[0] && sectionA[1] >= sectionB[1]
}

function isPartiallyOverlapping(sectionA: number[], sectionB: number[]) {
    if (isFullyOverlapping(sectionA, sectionB))
        return true;

    const [sectionAStart, sectionAEnd] = sectionA;
    const [sectionBStart, sectionBEnd] = sectionB;

    if (sectionAStart >= sectionBStart || sectionAStart >= sectionBEnd) {
        return true;
    }

    if (sectionAEnd >= sectionBStart || sectionAEnd >= sectionBEnd) {
        return true;
    }

    return false;
}

async function part1Async() {
    let uselessAssignments = 0;
    for await (const [sectionA, sectionB] of yieldPairs()) {
        if (isFullyOverlapping(sectionA, sectionB) || isFullyOverlapping(sectionB, sectionA)) {
            uselessAssignments++
        }
    }
    console.log(uselessAssignments);
}

async function part2Async() {
    let uselessAssignments = 0;
    for await (const [sectionARaw, sectionBRaw] of yieldPairs()) {
        const sectionA = toSection(sectionARaw);
        const sectionB = toSection(sectionBRaw);

        if (sectionA.some(s => sectionB.includes(s))) {
            uselessAssignments++;
        }
    }
    console.log(uselessAssignments);
}

export async function runDay4() {
    await part1Async();
    await part2Async();
}
