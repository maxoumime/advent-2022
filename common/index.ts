import * as fs from "fs";
import * as readline from "readline";

export async function* yieldLinesAsync(filePath: string) {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    yield* rl;
}
