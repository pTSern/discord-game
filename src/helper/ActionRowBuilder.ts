
import { NSFlex } from "flex";

import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, ComponentEmojiResolvable, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export namespace NSActionRowBuilder {

    export interface IButtonComponent {
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

    export interface ITextInputComponent {
        id: string;
        label: string;
        style?: TextInputStyle;
        required?: boolean;
        placeholder?: string;
        value?: string;
        minLength?: number;
        maxLength?: number;
    }

    export interface IModal {
        id: string;
        title: string;
        components: ITextInputComponent;
    }

    export function modal(_option: IModal) {
        const _modal = new ModalBuilder();

        const { id, title, components } = _option;
        const { label, style, required, placeholder, minLength, maxLength, value } = components;

        _modal.setCustomId(id);
        _modal.setTitle(title);

        const _comp = new ActionRowBuilder<TextInputBuilder>();

        const _input = new TextInputBuilder();
        _input.setCustomId(components.id);
        _input.setLabel(label);
        _input.setStyle(style || TextInputStyle.Short);
        _input.setRequired(!!required);
        placeholder && _input.setPlaceholder(placeholder);
        value !== undefined && _input.setValue(value);
        minLength !== undefined && _input.setMinLength(minLength);
        maxLength !== undefined && _input.setMaxLength(maxLength);

        _comp.addComponents(_input);
        _modal.addComponents(_comp)

        return _modal;
    }

    export function button(_components: NSFlex.TArg<"options", IButtonComponent[]>, _id?: NSFlex.TKey) {
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
