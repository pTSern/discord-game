import { model, Schema } from "mongoose";
import { DBDaily } from "./Daily";

export namespace DBUser {
    export interface ISchema {
        uuid: string;
        coins: number;
        daily: DBDaily.ISchema;

        addCoins(amount: number, save?: boolean): Promise<boolean>;
    }

    export interface IModel {
        get(uuid: string): Promise<ISchema>;
    }

    const user = new Schema( {
        uuid: { type: String, required: true, unique: true },
        coins: { type: Number, default: 0 },
        daily: { type: DBDaily.schema, default: {  } },
    }, {
        methods: {
            async addCoins(this: any, amount: number, save: boolean = true) {
                const _target = this.coins + amount;
                if(_target < 0) return false;

                this.coins = _target;
                save && await this.save();
                return true;
            },
        },
        statics: {
            async get(uuid: string) {
                const user = await this.findOne({ uuid });
                if(!user) return await this.create({ uuid });

                return user;
            }
        }
    } )

    export const Model = model<ISchema, IModel>( "User", user);
}
