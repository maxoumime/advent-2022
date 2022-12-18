import {yieldCharactersAsync} from "../util";

function isStartOfPacketDetected(window: ReadonlyArray<string>) {
    return !window.includes(undefined) && new Set([...window]).size === window.length;
}

async function findMarkerAsync(numberOfCharacters: number) {
    const window = new Array(numberOfCharacters).fill(undefined);
    let index = 0;
    for await (const character of yieldCharactersAsync(__dirname)) {
        window[index % numberOfCharacters] = character;
        if (isStartOfPacketDetected(window)) {
            break;
        }
        index++;
    }

    if (!isStartOfPacketDetected(window)) {
        throw new Error('No start of packet detected.');
    }

    return index + 1;
}

export async function runDay6() {
    const startOfPacketIndex = await findMarkerAsync(4);
    console.log(`Start of Packet index: ${startOfPacketIndex}`);
    const startOfMessageIndex = await findMarkerAsync(14);
    console.log(`Start of Message index: ${startOfMessageIndex}`);

}
