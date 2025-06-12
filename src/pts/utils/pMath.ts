import { NSFlex } from "flex";
import { pArray as pArray } from "./pArray";

export namespace pMath  {
    type TNumberUnit = 'INTEGER' | 'FLOAT'
    interface _TRange { min: number, max: number };

    export function random(min: number, max: number, type: TNumberUnit = "INTEGER") {
        switch(type) {
            case "INTEGER": {
                return ( Math.random() * ( max - min + 1 ) >> 0 ) + min;
            }
            case "FLOAT": {
                return Math.random() * (max - min) + min;
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

