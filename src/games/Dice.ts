import { ButtonInteraction, CommandInteraction, InteractionResponse, TextInputStyle } from "discord.js";
import { pMath } from "../pts/utils";
import { DBUser } from "../database/models/User";
import { CFDice } from "../config/Dice";
import { NSLanguage } from "../config/Language";
import { NSActionRowBuilder } from "../helper/ActionRowBuilder";

interface _IData {
    option: CFDice.TType;
    interaction: CommandInteraction;
    message?: InteractionResponse;
}

class _Dice {
    protected _isRunning: boolean = false;
    protected _data: Record<string, _IData> = {  }

    protected _reset() {
        this._isRunning = false;
        this._data = {}
    }

    protected _logic(): { type: CFDice.TType, rate: number, first: number, second: number, third: number } {
        const first = pMath.random(1, 6, "INTEGER", false);
        const second = Date.now() % 6 + 1;
        const third = pMath.random(1, 6, "INTEGER", true);

        if(first == second && second == third) return { type: 'storm', rate: 15, first, second, third };
        else return ( first + second + third ) % 2 === 0 ? { type: 'even', rate: 2, first, second, third } : { type: 'odd', rate: 2, first, second, third };
    }

    protected _handler(_duration: number, _interaction: CommandInteraction) {
        setTimeout(async () => {
            const { type, rate, first, second, third } = this._logic();
            const _view = NSLanguage.get(type, _interaction.locale);
            const _list = Object.values(this._data);

            const messages = await Promise.all(_list.map(async ({ option, interaction }) => {
                const { locale } = interaction;
                const _value_ = Number(interaction.options.get('value')?.value);
                const _user_ = await DBUser.Model.get(interaction.user.id);
                const _coin = NSLanguage.get( 'txt_coin', locale );

                if (!option) {
                    interaction.followUp({ 
                        content: NSLanguage.get( {
                            key: 'dyn_dice_no_opt_refund',
                            replacer: [
                                { find: "@refund", replacer: `${_value_}` },
                                { find: "@wallet", replacer: `${_user_.coins}` },
                                { find: "@coin", replacer: _coin }
                            ]
                        }, locale),

                        flags: 'Ephemeral' 
                    });
                    return null;
                } else if (option === type) {
                    await _user_.addCoins(_value_ * rate);
                    interaction.followUp({ 
                        content: NSLanguage.get( {
                            key: 'dyn_dice_win',
                            replacer: [
                                { find: "@view", replacer: _view },
                                { find: "@rate", replacer: `${rate}` },
                                { find: "@amount", replacer: `${_value_ * rate}` },
                                { find: "@wallet", replacer: `${_user_.coins}` },
                                { find: "@coin", replacer: _coin }] 
                        }, locale),
                        flags: 'Ephemeral'
                    });
                    return `> ${interaction.user.displayName} đâm ${_view} và bú ${_value_ * rate} coins.`;
                } else {
                    interaction.followUp({ 
                        content: NSLanguage.get( {
                            key: 'dyn_dice_lose',
                            replacer: [
                                { find: "@view", replacer: _view },
                                { find: "@bet", replacer: `${_value_}` },
                                { find: "@wallet", replacer: `${_user_.coins}` },
                                { find: "@coin", replacer: _coin }] 
                        }, locale),
                        flags: 'Ephemeral' 
                    });
                    return `> ${interaction.user.displayName} đâm ${_view} và cút ${_value_} coins.`;
                }
            }));

            const _msg = messages.filter(Boolean).join('\n');

            _interaction.followUp({ 
                content: NSLanguage.get( {
                    key: 'dyn_dice_result',
                    replacer: [
                        { find: "@view", replacer: _view },
                        { find: "@rate", replacer: `${rate}` },
                        { find: "@first", replacer: `${first}` },
                        { find: "@second", replacer: `${second}` },
                        { find: "@third", replacer: `${third}` },
                        { find: "@msg", replacer: `${_msg}` }
                    ]
                }, _interaction.locale),
                flags: 'Ephemeral'
            });

            this._reset();
        }, _duration * 1000);
    }

    async bet(_duration: number, _interaction: CommandInteraction) {
        const { user, options, locale } = _interaction;
        const { id } = user;

        const _value = Number(options.get('value')?.value);
        const _user = await DBUser.Model.get(id);
        const _coin = NSLanguage.get( 'txt_coin', locale );

        if( !await _user.addCoins(-_value) ) {
            _interaction.reply( {
                content: NSLanguage.get( {
                    key: 'dyn_dice_not_enough',
                    replacer: [
                        { find: "@wallet", replacer: `${_user.coins}` },
                        { find: "@bet", replacer: `${_value}` },
                        { find: "@coin", replacer: _coin },
                    ]
                }, _interaction.locale),
                flags: "Ephemeral",
            } )
            return;
        }

        console.log(`${user.displayName} đã cược ${_value} coins vào game Dice.`);

        this._data[id] = {
            option: null,
            interaction: _interaction,
        }

        if(this._isRunning) {
            _interaction.reply( {
                content: NSLanguage.get( {
                    key: 'dyn_dice_game_running',
                    replacer: [
                        { find: "@bet", replacer: `${_value}` },
                        { find: "@coin", replacer: _coin },
                    ]
                }, _interaction.locale),
                flags: "Ephemeral",
            } )
            return;
        };
        this._isRunning = true;

        this._handler(_duration, _interaction);
        _interaction.reply( {
            embeds: [{
                title: "lmao",
                description: NSLanguage.get( {
                    key: 'dyn_dice_start_new_game',
                    replacer: [
                        { find: "@bet", replacer: `${_value}` },
                        { find: "@coin", replacer: _coin },
                    ]
                }, _interaction.locale),
                color: 0x00FF00,
                image: { url: "https://www.google.com/imgres?q=image&imgurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1575936123452-b67c3203c357%3Ffm%3Djpg%26q%3D60%26w%3D3000%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%253D&imgrefurl=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fimage&docid=ExDvm63D_wCvSM&tbnid=-mNI5DBCB_iEPM&vet=12ahUKEwim6Nn35OyNAxXUavUHHduSF-UQM3oECBsQAA..i&w=3000&h=2000&hcb=2&ved=2ahUKEwim6Nn35OyNAxXUavUHHduSF-UQM3oECBsQAA",  }
            }],
            //content: NSLanguage.get( {
            //    key: 'dyn_dice_start_new_game',
            //    replacer: [
            //        { find: "@bet", replacer: `${_value}` },
            //        { find: "@coin", replacer: _coin },
            //    ]
            //}, _interaction.locale),
            flags: "Ephemeral",
        } )
        //this._one(_interaction);
    }

    async handler(_interaction: ButtonInteraction) {
        if(!this._isRunning) {
            _interaction.reply({
                content: NSLanguage.get( {
                    key: 'txt_no_game',
                    replacer: [
                    ]
                }, _interaction.locale),

                flags: 'Ephemeral' });
            return;
        } 

        const { customId } = _interaction;
        const _target = this._data[_interaction.user.id];

        if(!_target) {
            const _modal = NSActionRowBuilder.modal( {
                id: 'testx',
                title: "HEHE",
                components: {
                    id: 'xxx',
                    label: 'TEXT_INPUT',
                    required: true,
                    placeholder: 'Bet Amount',
                }
            })
            _interaction.showModal(_modal)
            //_interaction.reply({
            //    content: NSLanguage.get( {
            //        key: 'dyn_dice_require_bet',
            //        replacer: []
            //    }, _interaction.locale),
            //    flags: 'Ephemeral' 
            //});
            return; 
        }

        _target.option = customId as CFDice.TType;
        const _value = ( _target.interaction as unknown as CommandInteraction).options;
        const _coin = Number(_value.get('value')?.value);

        const _view = NSLanguage.get(_target.option, _interaction.locale);
        if(_target.message) {
            _target.message.edit( {
                content: NSLanguage.get( {
                    key: 'dyn_dice_change_bet',
                    replacer: [
                        { find: "@bet", replacer: `${_coin}` },
                        { find: "@view", replacer: _view },
                        { find: "@coin", replacer: _coin }
                    ]
                }, _interaction.locale),
            } )
            _interaction.deferUpdate();
        } else {
            _target.message = await _interaction.reply({
                content: NSLanguage.get( {
                    key: 'dyn_dice_place_bet',
                    replacer: [
                        { find: "@bet", replacer: `${_coin}` },
                        { find: "@view", replacer: _view },
                        { find: "@coin", replacer: _coin }
                    ]
                }, _interaction.locale),
                flags: 'Ephemeral' 
            });
        }
    }
}

export const pDice = new _Dice();
