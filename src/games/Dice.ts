import { ButtonInteraction, ButtonStyle, CommandInteraction, InteractionReplyOptions } from "discord.js";
import { NSActionRowBuilder } from "../helper/ActionRowBuilder";

interface _IData {
    option: TType;
    interaction: CommandInteraction;
}

const _types = ['odd', 'storm', 'even'] as const;
type TType = typeof _types[number];

const _options: Record<TType, string> = {
    odd: "Lẻ",
    storm: "Bão",
    even: "Chẵn"
}

const _row = _types.map( (_type, _index) => ({
    id: _type,
    label: _options[_type],
    style: _index + 1
}))

class Dice {
    protected _isRunning: boolean = false;

    protected _data: Record<string, _IData> = {  }

    protected _reset() {
        this._isRunning = false;
        this._data = {}
    }

    start(_duration: number, _interation: CommandInteraction) {
        if(this._isRunning) return;
        this._isRunning = true;

        setTimeout( async () => {
            const _rand = Math.random() * 10 >> 0;
            const _storm = Date.now() % 10;

            const [_rs, _view, _rate] = _rand === _storm ? ['storm', "Bão", 15] : (_rand % 2 === 0 ? ['chan', 'Chẵn', 2] : ['le', "Lẻ", 2]);

            const _list = Object.values(this._data)
            for(const data of _list) {
                const { option, interaction } = data;

                const _value = Number(interaction.options.get('value')?.value);

                if(!option) {
                    await interaction.reply({ content: `Bạn không cược gì nên được hoàn ${_value} coins`, flags: 'Ephemeral' });
                } else {
                    const _p: InteractionReplyOptions = option === _rs ? { content: `${_view} về, bú x${_rate} = ${_value * _rate} coins`, flags: 'Ephemeral' } : { content: `Kết quả: ${_view}, cút luôn ${_value * _rate} coins`, flags: 'Ephemeral' }
                    await interaction.reply(_p);
                }
            }

            _interation.followUp( { content: `Kết quả ${_view}, Bú ${_rate}`, components: [] } )
            this._reset();
        }, _duration * 1000);

        const row = NSActionRowBuilder.button(_row)

        _interation.reply( { content: "Cược", components: [row] } )
    }

    protected _core!: ButtonInteraction;
    handler(interaction: ButtonInteraction) {
        if(!this._isRunning) {
            interaction.reply({ content: '⏳ Đang không có game nào chạy.', flags: 'Ephemeral' });
            return;
        } 

        const { customId } = interaction;
        const _target = this._data[interaction.user.id];

        if(_target) {
            _target.option = customId as TType;

            interaction.reply({ content: `Đâm vào ${_options[_target.option]}`, flags: 'Ephemeral' });
        }

    }

}

export const pDice = new Dice();
