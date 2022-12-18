import {yieldCharactersAsync} from "../util";

function isStartOfPacketDetected(window: ReadonlyArray<string | undefined>) {
    return !window.includes(undefined) && new Set([...window]).size === window.length;
}

async function findMarkerAsync(numberOfCharacters: number) {
    const window: Array<string | undefined> = new Array(numberOfCharacters).fill(undefined);
    let index = 0;
    for await (const character of yieldCharactersAsync(__dirname)) {
        window[index % numberOfCharacters] = character;
        if (isStartOfPacketDetected(window)) {
            return index;
        }
        index++;
    }

    throw new Error('No start of packet detected.');
}

export async function runDay6Async() {
    const startOfPacketIndex = await findMarkerAsync(4);
    console.log(`Start of Packet index: ${startOfPacketIndex}`);
    const startOfMessageIndex = await findMarkerAsync(14);
    console.log(`Start of Message index: ${startOfMessageIndex}`);

}
