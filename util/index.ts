import * as fs from "fs";
import * as readline from "readline";
import * as path from "path";

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
