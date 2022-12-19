import {yieldLinesAsync} from "../util";

interface FileNode {
    type: 'file';
    name: string;
    size: number;
    parent?: DirectoryNode;
}

interface DirectoryNode {
    type: 'directory';
    name: string;
    children: Array<Node>;
    parent?: DirectoryNode;
}

class DirectoryNode implements DirectoryNode {
    private _size: number | undefined;

    constructor(name: string, parent?: DirectoryNode) {
        this.type = 'directory';
        this.name = name;
        this.parent = parent;
        this.children = [];
    }

    get size() {
        if (this._size !== undefined)
            return this._size;

        const size = this.children.reduce((acc, child) => {
            const childSize = child.type === 'file' ? child.size : child.size;
            return acc + childSize;
        }, 0);
        this._size = size;
        return size;
    }
}

type Node = FileNode | DirectoryNode;

interface CdCommand {
    command: 'cd';
    directory: '/' | '..' | string;
}

interface LsCommand {
    command: 'ls';
}

type Command = CdCommand | LsCommand;

function parseCommandLine(rawLine: string): Command {
    const rawCommand = rawLine.replace(/^\$ /, '');
    const [command, argument] = rawCommand.split(' ');

    switch (command) {
        case 'cd': {
            if (!argument)
                throw new Error('CD needs an argument.');

            return {
                command,
                directory: argument
            }
        }

        case 'ls': {
            if (argument)
                throw new Error('LS doesn\'t expect an argument');

            return {
                command,
            }
        }

        default:
            throw new Error(`Unknown command: ${command}`)
    }
}

function executeCommand(command: Command, root: DirectoryNode, node: DirectoryNode): DirectoryNode {
    if (command.command !== 'cd') {
        // Only `cd` is supported.
        return node;
    }

    switch (command.directory) {
        case '/':
            return root;

        case '..': {
            if (!node.parent)
                throw new Error('No parent for current node.');

            return node.parent;
        }

        default: {
            const child = node.children.find(it => it.name === command.directory);
            if (!child || child.type !== 'directory')
                throw new Error(`Child directory not found: ${command.directory}`);

            return child;
        }
    }
}

async function parserootAsync() {
    let lastCommand: Command | undefined;
    const root = new DirectoryNode('/');
    let currentNode: DirectoryNode = root;

    for await (const line of yieldLinesAsync(__dirname)) {
        if (line.startsWith('$ ')) {
            const command = parseCommandLine(line);
            currentNode = executeCommand(command, root, currentNode);
            lastCommand = command;
            continue;
        }

        if (lastCommand?.command !== 'ls') {
            throw new Error('Can only handle ls results.');
        }

        const [dirOrSize, name] = line.split(' ');

        const child: Node = dirOrSize === 'dir' ? new DirectoryNode(name, currentNode) : {
            type: 'file',
            name,
            size: parseInt(dirOrSize),
            parent: currentNode,
        }

        currentNode.children.push(child);
    }

    return root;
}

function* yieldDirectories(root: DirectoryNode) {
    for (const child of root.children) {
        if (child.type === 'file')
            continue;

        yield child;
        yield* yieldDirectories(child);
    }
}

function* yieldFilteredDirectories(root: DirectoryNode, predicate: (DirectoryNode) => boolean) {
    for (const directory of yieldDirectories(root)) {
        if (!predicate(directory)) {
            continue;
        }
        yield directory;
    }
}

async function runPart1Async(root: DirectoryNode) {
    const directories = [...yieldFilteredDirectories(root, dir => dir.size <= 100_000)];
    const sumOfDirectories = directories.reduce((acc, dir) => acc + dir.size, 0);
    console.log(`Sum of directories < 100_000: ${sumOfDirectories}`);
}

async function runPart2Async(root: DirectoryNode) {
    const requiredSpace = 30_000_000;
    const availableSpace = 70_000_000 - root.size;
    const missingSpace = availableSpace - requiredSpace;
    if (missingSpace >= 0) {
        throw new Error('Instructions unclear: There is enough space to run the update.');
    }

    const minimumDirectorySize = Math.abs(missingSpace);
    const directories = [...yieldFilteredDirectories(root, dir => dir.size >= minimumDirectorySize)];
    directories.sort((a, b) => a.size - b.size);

    console.log(`Smallest matching directory: ${directories[0].size}`);
}

export async function runDay7Async() {
    const root = await parserootAsync();
    await runPart1Async(root);
    await runPart2Async(root);
}
