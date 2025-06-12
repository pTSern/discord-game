
import { NSFlex } from "flex";

import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, ComponentEmojiResolvable } from "discord.js";

export namespace NSActionRowBuilder {

    export interface IComponent {
        id: string;
        label: string;
        style?: ButtonStyle;
        emoji?: ComponentEmojiResolvable;
        url?: string;
        disabled?: boolean;
    }

    namespace _private {
        const _pool: Record<NSFlex.TKey, ActionRowBuilder> = {}

        export function set(_id: NSFlex.TKey, _row: ActionRowBuilder) {
            _pool[_id] = _row;
        }

        export function get<TType extends AnyComponentBuilder = AnyComponentBuilder>(_id: NSFlex.TKey) {
            return _pool[_id] as ActionRowBuilder<TType>;
        }
    }

    export function button(_components: NSFlex.TArg<"options", IComponent[]>, _id?: NSFlex.TKey) {
        const _is = _id !== undefined;

        if(_is) {
            const _get = _private.get<ButtonBuilder>(_id);
            if(_get) return _get;
        }

        const _row = new ActionRowBuilder<ButtonBuilder>();

        if(!Array.isArray(_components)) {
            switch(typeof _components) {
                case "object": {
                    _components = _components.options;
                    break;
                }
                case "function": {
                    _components = _components();
                    break;
                }
            }
        }

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

        _is && _private.set(_id, _row);

        return _row;
    }

}
