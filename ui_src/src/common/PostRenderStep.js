export class PostRenderStep {
    run(navigationInstruction, next) {
        console.log("I'm inside the post render step!")
        return next();
    }
}
