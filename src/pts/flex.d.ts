
declare namespace NSFlex {
    declare type TFunction<TArgs = any[], TReturn = any> = TArgs extends any[] 
      ? (...args: TArgs) => TReturn 
      : (...args: TArgs[]) => TReturn;

    declare type TConstructor<TArgs = any, TInstance = any, TAbstract extends boolean = false> = TAbstract extends false ? new (...args: TArgs[]) => TInstance : abstract new (...args: TArgs[]) => TInstance;

    declare type TFlexKey = string | symbol | number;
    declare type TFlexReadonlyArray<TType> = (readonly TType[] | TType[])

    declare type TPrototypeType<T> = { prototype: T };
    declare type TFlexRecorder<TKey extends TFlexKey, TValue = any> = Partial<Record<TKey, TValue>>
    declare type TExtractKeyArray<TKeys extends TFlexKey[], TValue = any> = { [K in TKeys[number]]: TValue }

    declare type TFlexExtractKey<TObject extends object[], TKeyof extends keyof TObject[number], TValue> = {
        [ Key in TObject[number] as Key[TKeyof] & string ]: TValue
    }

    declare type TStaticKeys<TTarget> = {
        [K in keyof TTarget] : TTarget[K] extends Function ? K : never
    }[keyof TTarget];

    declare type TKeyOf<TTarget, TCondition = any, TExclude extends boolean = false> = {
        [K in keyof TTarget]: 
            TExclude extends true 
                ? (TTarget[K] extends TCondition ? never : K) 
                : (TTarget[K] extends TCondition ? K : never);
    }[keyof TTarget];

    declare type TFlexStringRecord<TKey extends string[], TPartial extends boolean = false, TReturn = string> = TPartial extends true ? Partial<Record<TKey[number], string>> : Record<TKey[number], TReturn>;
    declare type TFlexData<T> = T | T[];

    declare type TFlexOption<TData, TKey extends TKeyOf<TData>> = {
        key: TKey
        data: TData[TKey]
    }

    declare type TFlexArg<TName extends string, TType> = TType | { [K in TName]: TType } | TFunction<any, TType>;

}
