import { model, Schema } from "mongoose";

export namespace DBConfig {

    const _keys = [ 'InfyBtn' ] as const;
    export type TKeys = typeof _keys[number];

    export interface ISchema {
        key: string;
        value: any;
    }

    export interface IModel {
        set<_TValue>(key: TKeys, value: _TValue): Promise<ISchema>;
        get<_TValue>(key: TKeys): Promise<_TValue>;
    }

    const schema = new Schema(
        {
            key: { type: String, required: true, unique: true },
            value: { type: Schema.Types.Mixed, required: true },
        },
        {
            timestamps: true,
            statics: {
                async set(key: TKeys, value: any) {
                    return this.findOneAndUpdate( { key }, { value }, { upsert: true, new: true, setDefaultsOnInsert: true } )
                },
                async get(key: TKeys) {
                    const _config = await this.findOne( { key } )
                    return _config ? _config.value : null;
                }
            }
        }
    )

    export const Model = model<ISchema, IModel>( "Config", schema );
}
