
export namespace NSEventDefine {
    const _events = [
        "onClientReady", "onMongoReady", "onEveryThingReady", "onClientLogin"
    ] as const;

    export type TEvent = typeof _events[number]
}
