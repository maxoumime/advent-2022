import {yieldLinesAsync} from "../common";
import * as path from "path";

enum PlayEnum {
    ROCK,
    PAPER,
    SCISSORS
}

enum MatchOutcomeEnum {
    WIN = 'WIN',
    DRAW = 'DRAW',
    LOSE = 'LOSE',
}

function convertToPlay(play: string): PlayEnum {
    switch (play) {
        case 'A':
        case 'X':
            return PlayEnum.ROCK;

        case 'B':
        case 'Y':
            return PlayEnum.PAPER;

        case 'C':
        case 'Z':
            return PlayEnum.SCISSORS;

        default:
            throw new Error(`${play} is no a valid move.`);
    }
}

function convertToMatchResult(result: string): MatchOutcomeEnum {
    switch (result) {
        case 'X':
            return MatchOutcomeEnum.LOSE;

        case 'Y':
            return MatchOutcomeEnum.DRAW;

        case 'Z':
            return MatchOutcomeEnum.WIN;

        default:
            throw new Error(`${result} is no a valid result.`);
    }
}

function getBonusPoints(play: PlayEnum) {
    switch (play) {
        case PlayEnum.ROCK:
            return 1;
        case PlayEnum.PAPER:
            return 2;
        case PlayEnum.SCISSORS:
            return 3;
        default:
            throw new Error('Unreachable.');
    }
}

function determineOutcomes(play: PlayEnum) {
    switch (play) {
        case PlayEnum.ROCK:
            return {
                [MatchOutcomeEnum.WIN]: PlayEnum.PAPER,
                [MatchOutcomeEnum.DRAW]: PlayEnum.ROCK,
                [MatchOutcomeEnum.LOSE]: PlayEnum.SCISSORS,
            };
        case PlayEnum.PAPER:
            return {
                [MatchOutcomeEnum.WIN]: PlayEnum.SCISSORS,
                [MatchOutcomeEnum.DRAW]: PlayEnum.PAPER,
                [MatchOutcomeEnum.LOSE]: PlayEnum.ROCK,
            };
        case PlayEnum.SCISSORS:
            return {
                [MatchOutcomeEnum.WIN]: PlayEnum.ROCK,
                [MatchOutcomeEnum.DRAW]: PlayEnum.SCISSORS,
                [MatchOutcomeEnum.LOSE]: PlayEnum.PAPER,
            };
    }
}

function getMatchResult(playA: PlayEnum, playB: PlayEnum) {
    if (playA === playB) {
        return MatchOutcomeEnum.DRAW;
    }

    return determineOutcomes(playA)[MatchOutcomeEnum.WIN] === playB ? MatchOutcomeEnum.WIN : MatchOutcomeEnum.LOSE;
}

function getMatchPoints(outcome: MatchOutcomeEnum) {
    switch (outcome) {
        case MatchOutcomeEnum.WIN:
            return 6;
        case MatchOutcomeEnum.DRAW:
            return 3;
        case MatchOutcomeEnum.LOSE:
            return 0;
    }
}

async function part1Async() {
    let totalScore = 0;
    for await (const line of yieldLinesAsync(path.join(__dirname, 'input.txt'))) {
        const [playA, playB] = line.split(' ').map(convertToPlay);
        const result = getMatchResult(playA, playB);

        totalScore += getMatchPoints(result);
        totalScore += getBonusPoints(playB);
    }
    return totalScore
}

async function part2Async() {
    let totalScore = 0;
    for await (const line of yieldLinesAsync(path.join(__dirname, 'input.txt'))) {
        const [playARaw, matchResultRaw] = line.split(' ');
        const playA = convertToPlay(playARaw);
        const matchResult = convertToMatchResult(matchResultRaw);

        const playB = determineOutcomes(playA)[matchResult];

        const result = getMatchResult(playA, playB);

        totalScore += getMatchPoints(result);
        totalScore += getBonusPoints(playB);
    }

    return totalScore;
}

async function main() {
    console.log('Total score (A): ', await part1Async());
    console.log('Total score (B): ', await part2Async());
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
