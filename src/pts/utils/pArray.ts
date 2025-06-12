import { NSFlex } from "flex";

type _TFinder<TType> = (curr: TType, prev: TType, value: TType) => boolean;
const _hSmallerFinder: _TFinder<number> = (curr, prev, value) => (curr <= value && curr > prev)

export namespace pArray {
    export function flatter<T>(target: NSFlex.TArray<T>, ...targets: T[]): T[] {
        if(target === undefined && targets.length <= 0) return[]
        //@ts-ignore
        return [target, ...targets].flat();
    }

    export function findSmallerNearest<T>(list: T[], prop: NSFlex.TKeyOf<T, number>, value: number, mechanic: _TFinder<number> = _hSmallerFinder) {
        return list.reduce((prev, curr) => {
            if(curr[prop] === undefined || typeof curr[prop] === 'number') {
                const _curr = curr[prop] as number;
                const _prev = prev ? prev[prop] as number : Number.NEGATIVE_INFINITY;
                if(mechanic(_curr, _prev, value)) return curr;
            }
            return prev;
        }, undefined as T | undefined)
    }

    export function shuffle<TType>(array: TType[]) {
        for(let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    export function extractEqually(arr: number[], data: number[][] = []): any {
        if(arr.every(a => a <= 0)) return data;

        const _min = this.min(arr, 0);
        const _root = arr.map(a => Math.max(a - _min, 0));
        const _left = arr.map(() => _min);
        data.push(_left);

        return this.extractEqually(_root, data);
    }

    export function min(arr: number[], above: number = 0) {
        arr = arr.filter( e => e > above );
        return Math.min(...arr);
    }
}

