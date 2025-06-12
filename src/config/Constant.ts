
const _commands = ['dice', 'test'] as const;
export type TCommand = typeof _commands[number];
