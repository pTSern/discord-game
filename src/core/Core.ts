import { ButtonInteraction, Client, CommandInteraction, Events, ModalSubmitInteraction } from "discord.js";
import { NSCommand } from "../config/Constant";

import { pDice } from "../games/Dice";
import { pTest } from "../games/Test";
import { pEventManager } from "../pts/event/pEvent";
import { pMenu } from "../games/Menu";
import { NSActionRowBuilder } from "../helper/ActionRowBuilder";

class _Core {
    constructor() {
        pEventManager.add('onEveryThingReady', { _this: this, _function: this._init })
    }

    protected _init(client: Client) {
        client.on(Events.InteractionCreate, async _interaction => {
            if(_interaction.user.bot) return;

            _interaction.isCommand() && this._onCommand(_interaction);
            _interaction.isButton() && this._onButton(_interaction);
            _interaction.isModalSubmit() && this._onModalSubmit(_interaction);

        });


    }

    protected _onCommand(_interaction: CommandInteraction) {
        switch(_interaction.commandName as NSCommand.TCommand) {
            case 'menu': {
                pMenu.open(_interaction);
                break;
            }
            case 'dice': {
                pDice.bet(10, _interaction);
                break;
            }
            case 'test': {
                pTest.add(_interaction)
                break;
            }
        }
    }

    protected _onButton(_interaction: ButtonInteraction) {
        console.log("Button Interaction:", _interaction.toJSON());
        pDice.handler(_interaction);
    }

    protected _onModalSubmit(_interaction: ModalSubmitInteraction) {
        console.log("Modal Submit Interaction:", _interaction.toJSON())
    }
}

new _Core();
