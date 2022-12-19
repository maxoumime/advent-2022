import {runDay8Async} from "./day8";

runDay8Async().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
})
