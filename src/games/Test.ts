import { CommandInteraction } from "discord.js";
import { DBUser } from "../database/models/User";

class _Test {
    async add(_interation: CommandInteraction) {

        const { user, options } = _interation;
        const { id } = user;

        const _value = Number(options.get('value')?.value);
        const _user = await DBUser.Model.get(id);

        if( await _user.addCoins(_value) ) {
            _interation.reply( { content: `+${_value} coins cho bro. Số dư mới: ${_user.coins} coins.`, flags: 'Ephemeral' } )
            return;
        }
    }
}

export const pTest = new _Test();
