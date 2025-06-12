import { NSlashCommand } from "../helper/SlashCommand";

export namespace NSCommands {

    const slash = NSlashCommand.generator( {
        name: "dice",
        description: "Cược { value } vào game Tài Xỉu.",
        options: [
            {
                name: "value",
                description: "Số lượng",
                required: true
            }
        ]
    })

    const test = NSlashCommand.generator( {
        name: 'test',
        description: 'Nạp { value } vào tài khoản',
        options: [
            {
                name: 'value',
                description: "Số tiền",
                required: true
            }
        ]
    })

    const menu = NSlashCommand.generator( {
        name: 'menu',
        description: "Tạo Menu",
    } )

    const setting = NSlashCommand.generator( {
        name: "setting",
        description: 'Thay đổi cài đặt',
    })

    export const commands = [ slash, test, menu, setting ];
}
