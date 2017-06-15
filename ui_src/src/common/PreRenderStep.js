export class PreRenderStep {
    run(navigationInstruction, next) {
        console.log("I'm inside the pre render step!")
        return next();
    }
}