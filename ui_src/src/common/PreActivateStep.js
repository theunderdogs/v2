export class PreActivateStep {
    run(navigationInstruction, next) {
        console.log("I'm inside the pre activate step!")
        return next();
    }
}