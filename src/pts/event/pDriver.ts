import { NSFlex } from "flex";
import { pArray } from "../utils";

export namespace NSEventDriver {
    export interface IHandler {
        _function: NSFlex.TFunction;
        _priority: number;
    }

    export interface IOption<TArgs = any, TReturn = any> {
        _function: NSFlex.TFunction<TArgs, TReturn>;
        _priority?: number;
        _this: any;
    }

    export type _TFlex<TArgs = any, TReturn = any> = NSFlex.TFunction | IOption<TArgs, TReturn>;
    export type TFlex<TEvent extends NSFlex.TKey> = [TEvent, NSFlex.TFunction, any, number?][];

    export interface IDriver<TEventType extends NSFlex.TKey> {
        add(event: TEventType, listener: NSFlex.TArray<_TFlex>, ...listeners: _TFlex[]): void
        remove(event: TEventType, listener: NSFlex.TArray<_TFlex>, ...listeners: _TFlex[]): void
        set(event: TEventType, listener: NSFlex.TArray<_TFlex>, ...listeners: _TFlex[]): void
        clear(event: TEventType): void
        invoke(event: TEventType, ...args: any[]): any[];
    }

    export interface IHOption<TEvent extends NSFlex.TKey, TSelf = any> {
        log?: boolean;
        alias?: string;

        key?: (key: any) => TEvent;
        after?: (self: TSelf) => void;
    }

    export class Handler<TEvent extends NSFlex.TKey> implements IDriver<TEvent> {
        public static create<TEvent extends NSFlex.TKey>(opt?: IHOption<TEvent, Handler<TEvent>>) {
            const ret = new Handler<TEvent>();
            ret._init(opt);
            return ret;
        }

        protected _init({ key = (_key: any) => _key as TEvent, log = false, alias = '[EventDriver]', after = () => {} } : IHOption<TEvent> = {}): void {
            this.__key_   = key;
            this.__log_   = log;
            this.__alias_ = alias;
            after(this);
        }

        protected __log_: boolean = false;
        protected __alias_: string = '[EventDriver]';
        protected __key_: (key: any) => TEvent = (key: any) => key as TEvent;
        protected __events_: Partial<Record<TEvent, IOption[]>> = {};

        protected _get(key: TEvent) {
            key = this.__key_(key);

            this.__events_ ??= {};
            this.__events_[key] ??= [];
            return this.__events_[key];
        }

        isEmpty(key: TEvent) {
            return this._get(key).length <= 0;
        }

        protected _set(key: TEvent, value: IOption[]) {
            key = this.__key_(key);

            this.__events_ ??= {};
            this.__events_[key] = value;
        }

        /**
        * @deprecated Use `this._map` instead. Cause Cocos build with lower js version which can not understand `yield`
        */
        protected *_yield(listener: _TFlex[]): Iterable<IOption> {
            for(const ret of listener) {
                yield ( typeof ret === 'function' )
                    ? { _function: ret, _priority: 0, _this: null }
                    : { _function: ret._function, _this: ret._this, _priority: ret._priority ?? 0 };
            }
        }

        protected _map(listener: _TFlex[]): IOption[] {
            return listener.map( ret => ( typeof ret === 'function' )
                    ? { _function: ret, _priority: 0, _this: null }
                    : { _function: ret._function, _this: ret._this, _priority: ret._priority ?? 0 }
            );
        }

        set(event: TEvent, listener: NSFlex.TArray<_TFlex>, ...listeners: _TFlex[]): void {
            this._set(event, []);
            this.add(event, listener, ...listeners);
        }

        add(event: TEvent, listener: NSFlex.TArray<_TFlex>, ...listeners: _TFlex[]): void {
            listeners = pArray.flatter(listener, ...listeners);

            const opts = this._get(event);
            opts.push(...this._map(listeners));
            opts.sort((a, b) => a._priority - b._priority);

            this.__log_ && console.log(`${this.__alias_} Log: Added Event >> ${String(event)}`);
        }

        remove(event: TEvent, listener: NSFlex.TArray<_TFlex>, ...listeners: _TFlex[]): void {
            listeners = pArray.flatter(listener, ...listeners);

            const map = this._map(listeners);
            const opts = this._get(event).filter( opt => {
                const index = map.findIndex( _opt => _opt._function === opt._function && _opt._this === opt._this )
                if(index < 0) return true;

                map.splice(index, 1);
                return false;
            })

            this._set(event, opts);
        }

        clear(event: TEvent): void {
            this._set(event, []);
        }

        invoke(event: TEvent, ...args: any[]): any[] {
            try {
                const list = this._get(event);

                const results = list.map(({ _this, _function }) => 
                    _this ? _function.call(_this, ...args) : _function(...args)
                );

                this.__log_ && console.log(`${this.__alias_} Log: Invoked ${String(event)} >> Functions Length >>`,  list.length);
                return results;
            } catch (e) {
                console.error(`${this.__alias_} Log: Error`, e);
                return []
            }
        }

        on(events: TFlex<TEvent>) {
            for(const [ _key, _function, _this, _priority ] of events) this.add(_key, { _function, _this, _priority });
        }

        off(events: TFlex<TEvent>) {
            for(const [ _key, _function, _this ] of events) this.remove(_key, { _function, _this });
        }
    }
}
