import { ButtonInteraction, CommandInteraction, InteractionReplyOptions, InteractionResponse, Message } from "discord.js";
import { NSActionRowBuilder } from "../helper/ActionRowBuilder";
import { pString } from "../pts/utils/pString";

interface _IData {
    option: TType;
    interaction: CommandInteraction;
    message?: InteractionResponse
}

const _types = ['odd', 'storm', 'even'] as const;
type TType = typeof _types[number];

const _options: Record<TType, string> = {
    odd: "Lẻ",
    storm: "Bão",
    even: "Chẵn"
}

const _row: NSActionRowBuilder.IComponent[] = _types.map( (_type, _index) => ({
    id: _type,
    label: _options[_type],
    style: _index + 1
}))

const _drow: NSActionRowBuilder.IComponent[] = _row.map( _type => ({ ..._type, disabled: true }))

const _auuid = pString.uuid();
const _duuid = pString.uuid();

class Dice {
    protected _isRunning: boolean = false;

    protected _data: Record<string, _IData> = {  }

    protected _reset() {
        this._isRunning = false;
        this._data = {}
    }

    start(_duration: number, _interation: CommandInteraction) {
        this._data[_interation.user.id] = {
            option: null,
            interaction: _interation,
        }

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
                    await interaction.followUp({ content: `Bạn không cược gì nên được hoàn ${_value} coins`, flags: 'Ephemeral' });
                } else {
                    const _p: InteractionReplyOptions = option === _rs ? { content: `${_view} về, bú x${_rate} = ${_value * _rate} coins`, flags: 'Ephemeral' } : { content: `Kết quả: ${_view}, cút luôn ${_value} coins`, flags: 'Ephemeral' }
                    await interaction.followUp(_p);
                }
            }

            const drow = NSActionRowBuilder.button(_drow, _duuid);
            _interation.editReply( { content: `Kết quả ${_view}, Bú x${_rate}`, components: [drow] } )
            this._reset();
        }, _duration * 1000);

        const row = NSActionRowBuilder.button(_row, _auuid);

        _interation.reply( { content: "Cược", components: [row], options: { withResponse: true } } )
    }

    protected _core!: ButtonInteraction;
    async handler(interaction: ButtonInteraction) {
        if(!this._isRunning) {
            interaction.reply({ content: '⏳ Đang không có game nào chạy.', flags: 'Ephemeral' });
            return;
        } 

        const { customId } = interaction;
        const _target = this._data[interaction.user.id];

        if(!_target) { interaction.reply({ content: `Bro phải dùng '/dice {Số tiền}'để tham gia nhé.`, flags: 'Ephemeral' }); return; }

        _target.option = customId as TType;
        const _value = ( _target.interaction as unknown as CommandInteraction).options;
        const _coin = Number(_value.get('value')?.value);

        if(_target.message) {
            _target.message.edit( { content: `Chuyển sang đâm ${_coin} coins vào ${_options[customId]}` } )
            interaction.deferUpdate();
        } else {
            _target.message = await interaction.reply({ content: `Đâm vào ${_coin} coins vào ${_options[customId]}`, flags: 'Ephemeral' });
        }
    }

}

export const pDice = new Dice();
