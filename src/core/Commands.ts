import { NSlashCommand } from "../helper/SlashCommand";

export namespace NSCommands {

    const slash = NSlashCommand.generator( {
        name: "dice",
        description: "Roll a dice from 1 to 6",
        options: [
            {
                name: "value",
                description: "The value",
                required: true
            },
            {
                name: "amount",
                description: "The amount",
                required: true
            }
        ]
    })

    const test = NSlashCommand.generator( {
        name: 'test',
        description: 'Test command',
        options: [
            {
                name: 'xx',
                description: "he",
                required: false 
            }
        ]
    })

    export const commands = [ slash, test ];
}
