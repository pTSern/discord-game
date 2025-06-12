import { Locale } from "discord.js";
import { NSActionRowBuilder } from "../helper/ActionRowBuilder";
import { pString } from "../pts/utils";
import { NSLanguage } from "./Language";

export namespace CFDice {
    const _types = ['odd', 'storm', 'even'] as const;
    export type TType = typeof _types[number];

    const _row: NSActionRowBuilder.IButtonComponent[] = _types.map( (_type, _index) => ({
        id: _type,
        label: NSLanguage.get(_type, Locale.Vietnamese),
        style: _index + 1
    }))

    const _auuid = pString.uuid();
    export const button = NSActionRowBuilder.button(_row, _auuid);
}
