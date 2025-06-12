import { Locale } from "discord.js";
import { pString } from "../pts/utils";
import { CFDice } from "./Dice";

export namespace NSLanguage {

    export const zones = ["en", "vi"] as const;
    export type TZone = typeof zones[number];

    export const keys = [
        "txt_coin", "txt_cancel",
        "dyn_dice_no_opt_refund", "dyn_dice_win",  "dyn_dice_lose", "dyn_dice_result", "dyn_dice_not_enough", "txt_no_game", "dyn_dice_require_bet", "dyn_dice_change_bet", "dyn_dice_place_bet", "dyn_dice_start_new_game", "dyn_dice_game_running",
        "dyn_setting_change_lang", "txt_setting_no_change", "txt_setting_choose_lang"
    ] as const;
    export type TKey = typeof keys[number] | TZone | CFDice.TType;

    const _langs: Record<TKey, Record<TZone, string>> = {
        vi: {
            vi: "Tiếng Việt",
            en: "Vietnamese"
        },
        en: {
            vi: "Tiếng Anh",
            en: "English"
        },
        txt_coin: {
            vi: "Xu",
            en: "Gold"
        },
        dyn_dice_no_opt_refund: {
            vi: "Bạn không cược gì nên được hoàn @refund @coin.\n> Số dư của bro: @wallet @coin",
            en: "You didn't bet anything, so you get @refund @coin back.\n> Your wallet balance: @wallet @coin"
        },
        dyn_dice_win: {
            vi: "@view về, bú x@rate = @amount @coin.\n> Số dư mới của bro: @wallet @coin",
            en: "@view win, you get x@rate = @amount @coin.\n> Your new wallet balance: @wallet @coin"
        },
        dyn_dice_lose: {
            vi: "@view về, cút luôn @bet @coin.\n> Số dư mới của bro: @wallet @coin",
            en: "@view lose, you lost @bet @coin.\n> Your new wallet balance: @wallet @coin"
        },
        dyn_dice_result: {
            vi: "Kết quả [@first - @second - @third] @view, Bú x@rate\n@msg",
            en: "Result [@first - @second - @third] @view, you get x@rate\n@msg"
        },
        dyn_dice_not_enough: {
            vi: "Bro chỉ có @wallet @coin < số cược là @bet, sao cược ?",
            en: "Bro only has @wallet @coin < bet amount @bet, how can you bet ?"
        },
        txt_no_game: {
            vi: 'Đang không có game nào chạy.',
            en: 'There is no game running.'
        },
        dyn_dice_require_bet: {
            vi: "Bro phải dùng '/dice {Số tiền}'để tham gia nhé.",
            en: "You must use '/dice {Amount}' to participate."
        },
        dyn_dice_change_bet: {
            vi: "Chuyển sang đâm @bet @coin vào @view",
            en: "Change to bet @bet @coin on @view"
        },
        dyn_dice_place_bet: {
            vi: "Đâm vào @bet @coin vào @view",
            en: "Place a bet of @bet @coin on @view"
        },
        dyn_dice_start_new_game: {
            vi: "Bắt đầu 1 game mới với mức cược là @bet @coin",
            en: "Start a new game with a bet of @bet @coin"
        },
        dyn_setting_change_lang: {
            vi: "Đã thay đổi ngôn ngữ sang @lang",
            en: "Language has been changed to @lang"
        },
        txt_setting_no_change: {
            vi: "Không có gì thay đổi.",
            en: "Nothing has changed."
        },
        txt_setting_choose_lang: {
            vi: "Chọn ngôn ngữ bạn muốn sử dụng.",
            en: "Choose the language you want to use."
        },
        txt_cancel: {
            vi: "Hủy",
            en: "Cancel"
        },
        dyn_dice_game_running: {
            vi: "Game đã đang chạy, bro hãy đâm @bet @coin đi.",
            en: "A game is currently running, please place a bet of @bet @coin."
        },
        odd: {
            vi: "Lẻ",
            en: "Odd"
        },
        storm: {
            vi: "Bão",
            en: "Storm"
        },
        even: {
            vi: "Chẵn",
            en: "Even"
        }
    }

    export type TOption = TKey | NSLanguage.IOption;
    export type TModifier = (data: string) => string;

    export type IOption =
        | { key: TKey; handler?: TModifier; raw?: never, replacer?: pString.IReplacer[] }
        | { raw: string; handler?: TModifier; key?: never, replacer?: pString.IReplacer[] }

    export function get(_key: TOption, _zone: Locale = Locale.Vietnamese) {
        switch(typeof _key) {
            case 'undefined': {
                return get({ raw: 'undefined' }, _zone);
            }
            case 'string': {
                return _langs[_key]?.[toZone(_zone)] ?? _key;
            }
            default: {
                const { key, handler, raw, replacer } = _key;

                const _txt = !!raw ? raw : get(key, _zone);
                const _str = _txt ? (handler ? handler(_txt) : _txt) : key;
                return replacer ? pString.replace(_str, replacer) : _str;
            }
        }
    }

    export function isZone(_zone: string): _zone is TZone {
        return zones.includes(_zone as TZone);
    }

    export function toZone(_locale: Locale): TZone {
        const lang = _locale.toLowerCase();

        if (lang.startsWith("vi")) return "vi";
        if (lang.startsWith("en")) return "en";

        return "vi";
    }
}
