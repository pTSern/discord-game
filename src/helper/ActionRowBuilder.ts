import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentEmojiResolvable } from "discord.js";

export namespace NSActionRowBuilder {

    export interface IComponent {
        id: string;
        label: string;
        style?: ButtonStyle;
        emoji?: ComponentEmojiResolvable;
        url?: string;
        disabled?: boolean;
    }

    const _pool = {}

    export function button(_components: NSFlex.TFlexArg<"options", IComponent[]>) {
        const _row = new ActionRowBuilder<ButtonBuilder>();

        for(const _comp of _components) {
            const _button = new ButtonBuilder();
            const { id, label, style = ButtonStyle.Primary, emoji, url, disabled } = _comp;

            _button.setCustomId(id);
            _button.setLabel(label);
            _button.setStyle(style);
            url && _button.setURL(url);
            emoji && _button.setEmoji(emoji);
            disabled && _button.setDisabled(disabled);

            _row.addComponents(_button);
        }

        return _row;
    }

}
