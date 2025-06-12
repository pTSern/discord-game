
export namespace NSFlex {
    export type TFunction<_TArgs = any[], _TReturn = any> = _TArgs extends any[] 
        ? (...args: _TArgs) => _TReturn 
        : (...args: _TArgs[]) => _TReturn;

    export type TConstructor<_TArgs = any, _TInstance = any, _TAbstract extends boolean = false> = _TAbstract extends false ? new (...args: _TArgs[]) => _TInstance : abstract new (...args: _TArgs[]) => _TInstance;

    export type TKey = string | symbol | number;
    export type TReadonly<_TType> = (readonly _TType[] | _TType[])

    export type TPrototype<TType> = { prototype: TType };
    export type TRecorder<_TKey extends TKey, _TValue = any> = Partial<Record<_TKey, _TValue>>
    export type TExtractKeyArray<TKeys extends TKey[], TValue = any> = { [K in TKeys[number]]: TValue }

    export type TExtractKey<_TObject extends object[], _TKeyof extends keyof _TObject[number], _TValue> = {
        [ Key in _TObject[number] as Key[_TKeyof] & string ]: _TValue
    }

    export type TStaticKeys<_TTarget> = {
        [_K in keyof _TTarget] : _TTarget[_K] extends Function ? _K : never
    }[keyof _TTarget];

    export type TKeyOf<_TTarget, _TCondition = any, _TExclude extends boolean = false> = {
        [K in keyof _TTarget]: 
            _TExclude extends true 
                ? (_TTarget[K] extends _TCondition ? never : K) 
                : (_TTarget[K] extends _TCondition ? K : never);
    }[keyof _TTarget];

    export type TArray<_TType> = _TType | _TType[];
    export type TStringRecord<_TKey extends string[], _TPartial extends boolean = false, _TReturn = string> = _TPartial extends true ? Partial<Record<_TKey[number], string>> : Record<_TKey[number], _TReturn>;

    export type TOptions<_TData, _TKey extends TKeyOf<_TData>> = {
        key: _TKey
        data: _TData[_TKey]
    }

    export type TArg<_TName extends string, _TType, _TArgs = any> = _TType | { [K in _TName]: _TType } | TFunction<_TArgs, _TType>;

}
