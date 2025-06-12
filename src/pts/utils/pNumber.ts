

export namespace pNumber {
    export function isValid(_number: number) {
        return _number != undefined && _number != null && !isNaN(_number) && !isFinite(_number);
    }
}
