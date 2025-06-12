import { SlashCommandBuilder, SlashCommandIntegerOption } from "discord.js";
import { NSCommand } from "../config/Constant";

export namespace NSlashCommand {

    export interface IOption {
        name: string;
        description?: string;
        required?: boolean;
    }

    export interface ICommand {
        name: NSCommand.TCommand;
        description?: string;
        options?: IOption[]
    }

    export function generator(_data: ICommand) {
        const { name, description, options } = _data;

        const _slash = new SlashCommandBuilder();
        _slash.setName(name);
        description && _slash.setDescription(description);
        const _options = _genrateOption(options || []);
        _options.forEach( _option => _slash.addIntegerOption(_option) );

        return _slash;
    }

    function _genrateOption(_options: IOption[]) {
        return _options.map( _option => {
            const option = new SlashCommandIntegerOption();

            const { name, description, required } = _option;
            option.setName(name);
            description && option.setDescription(description);
            required && option.setRequired(required);

            return option;
        } )
    }
}



