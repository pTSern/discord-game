import { NSFlex } from "flex";
import { pArray } from "./pArray";
import { pMath } from "./pMath";
import { pNumber } from "./pNumber";

export namespace pString {

    export interface IReplacer {
        find: string;
        replacer: string;
        time?: number;
    }

    export function uuid() {
        const _first = pMath.random(1000, 9999);
        const _second = pMath.random(1000, 9999);
        return `${_first}_${Date.now()}_${_second}`
    }

    namespace _money {
        export type TMoney = 'DOT' | "KMB"

        export interface IMoney {
            positive?: string;
            nagative?: string;
            dot?: string;
            fixed?: number;
            type: TMoney;
        }

        export function _convertor(value: number, radix: number, dot: string = ","): string {
            const _scaled = Math.round((value * 100) / radix);
            const _integer = Math.floor(_scaled / 100);
            const _decimal = _scaled % 100;

            if (_decimal === 0) return _integer.toString();
            if (_decimal < 10) return `${_integer}${dot}0${_decimal}`;
            if (_decimal % 10 === 0) return `${_integer}${dot}${_decimal / 10}`;

            return `${_integer}${dot}${_decimal}`;
        }

        export function kmb(_value: number, _dot: string = ",", _positive: string = "", _nagative: string = "-") {
            const _sign = _value < 0 ? _nagative : _positive;
            _value = Math.floor(Math.abs(_value));

            if ( _value >= 1E9 ) return `${_sign}${_convertor(_value, 1E9, _dot)}B`;
            if ( _value >= 1E6 ) return `${_sign}${_convertor(_value, 1E6, _dot)}M`;
            if ( _value >= 1E3 ) return `${_sign}${_convertor(_value, 1E3, _dot)}K`;

            return `${_sign}${_value}`;

        }

        export function dot(_value: number, _dot: string = '.', _fixed: number = 0, _positive: string = "", _nagative: string = "-"): string {
            const _sign = _value < 0 ? _nagative : _positive;
            return `${_sign}${_value.toFixed(_fixed).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
        }
    }

    export function money(_value: number, _option: _money.IMoney): string {
        if(!pNumber.isValid(_value)) return '';

        const { positive, nagative, type, dot, fixed } = _option;

        switch(type) {
            case "DOT": {
                return _money.dot(_value, dot, fixed, positive, nagative);
            }
            case "KMB": {
                return _money.kmb(_value, dot, positive, nagative);
            }
        }
    }

    export function replace(root: string, replace: NSFlex.TArray<IReplacer>, ...replaces: IReplacer[]): string {
        replaces = pArray.flatter(replace, ...replaces);

        return replaces.reduce( (result, { find, replacer, time }) => {
            time = time || 0;
            if (time > 0) {
                for(let i = 0; i < time; i ++) result = result.replace(find, replacer);
            } else {
                result = result.replace(new RegExp(find, 'g'), replacer);
            }
            return result;
        }, String(root));
    }
}

