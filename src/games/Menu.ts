import { Client, CommandInteraction, TextChannel } from "discord.js";
import { pEventManager } from "../pts/event/pEvent";
import { DBConfig } from "../database/models/Config";
import { CFDice } from "../config/Dice";

interface _IConfig {
    interactionId: string;
    channelId: string;
}

class _Menu {
    constructor() {
        pEventManager.add('onClientReady', { _function: this._onClientReady, _this: this })
        pEventManager.add('onMongoReady', { _function: this._onMongoReady, _this: this } )
    }

    protected _client: Client = null;
    protected _pConfig: Promise<_IConfig> = null;
    protected _config: _IConfig = null;

    protected _onClientReady(client: Client) {
        this._client = client;
    }

    protected _onMongoReady() {
        this._pConfig = DBConfig.Model.get<_IConfig>('InfyBtn');
        this._pConfig.then( _cfg => { this._config = _cfg; this._pConfig = null; } )
    }

    async open(_interaction: CommandInteraction) {
        const { id } = _interaction;

        await this._pConfig;
        if(!!this._config) {
            const { interactionId } = this._config;

            if(id != interactionId) {
                await this._actDeleteMessage(this._config);
                this._actSaveConfig(_interaction);
                return;
            }
        }
        this._actSaveConfig(_interaction);
    }

    protected async _actSaveConfig(_interaction: CommandInteraction) {
        await _interaction.reply( { content: "Cược đi bro - Đợi 15 giây nhé / game", components: [CFDice.button], options: { withResponse: true } } )
        this._config = { interactionId: _interaction.id, channelId: _interaction.channelId }
        DBConfig.Model.set<_IConfig>("InfyBtn", this._config);
    }

    protected async _actDeleteMessage(_config: _IConfig) {
        try {
            const { channelId } = _config;

            const _chanel = await this._client.channels.fetch(channelId) as TextChannel;
            const _messages = await _chanel.messages.fetch({ limit: 10 });
            const _bots = _messages.filter(m => m.author.id == this._client.user.id);

            await Promise.all(_bots.map(_msg => _msg.delete()));

        } catch (error) {
            console.error(">>> DDO ERROR", error);
        }
    }
}

export const pMenu = new _Menu();
