import { NSFlex } from "flex";
import { pArray as pArray } from "./pArray";

export namespace pMath  {
    type TNumberUnit = 'INTEGER' | 'FLOAT'
    interface _TRange { min: number, max: number };

    namespace _random {
        let _seed: number = Date.now();

        export function random(): number {
            const a = 1664525;
            const c = 1013904223;
            const m = 2 ** 32;

            _seed = (a * this._seed + c) % m;

            return this._seed / m;
        }
    }

    export function random(min: number, max: number, type: TNumberUnit = "INTEGER", custom: boolean = false) {
        const _rand = custom ? _random.random() : Math.random();
        switch(type) {
            case "INTEGER": {
                return ( _rand * ( max - min + 1 ) >> 0 ) + min;
            }
            case "FLOAT": {
                return _rand * (max - min) + min;
            }
        }
    }

    export function range(value: number, opt: _TRange): number;
    export function range(value: number, min: number, max: number): number
    export function range(value: number, min: _TRange | number, max?: number) {
        if(typeof min != 'number') {
            max = min.max;
            min = min.min;
        }

        return Math.max(Math.min(value, Number(max)), min);
    }

    export function rand<T>(arr: NSFlex.TArray<T>, ...arrs: T[]) {
        arr = pArray.flatter(arr, ...arrs);
        const index = Math.floor(Math.random() * arr.length)
        return arr[index];
    }
}

