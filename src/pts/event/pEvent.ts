import { NSEventDefine } from "./pDefines";
import { NSEventDriver } from "./pDriver";

export const pEventManager = NSEventDriver.Handler.create<NSEventDefine.TEvent>({
    log: true,
    alias: '[pEventManager]',
});

