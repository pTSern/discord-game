export namespace NSCommand {
    export const commands = ['dice', 'test', 'menu', 'setting'] as const;
    export type TCommand = typeof commands[number];
}
