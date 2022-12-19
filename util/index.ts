import * as fs from "fs";
import * as readline from "readline";
import * as path from "path";
import {brotliDecompress} from "zlib";

export async function* yieldLinesAsync(fileDir: string, fileName?: string) {
    const filePath = path.join(fileDir, fileName ?? 'input.txt');
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    yield* rl;

    rl.close();
}

export async function* yieldCharactersAsync(fileDir: string, fileName?: string): AsyncGenerator<string, void, undefined> {
    const filePath = path.join(fileDir, fileName ?? 'input.txt');
    const fileStream = fs.createReadStream(filePath);

    await new Promise(resolve => fileStream.once('readable', resolve));

    while (true) {
        const buffer = fileStream.read(1);
        if (!buffer)
            break;

        yield buffer.toString();
    }
}

export function enumValues<Enum>(enumType: Enum): Enum[keyof Enum][] {
    return Object.values(enumType);
}
