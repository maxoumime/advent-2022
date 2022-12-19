import {runDay7Async} from "./day7";

runDay7Async().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
})
