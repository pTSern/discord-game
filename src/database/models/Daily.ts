import { Schema } from "mongoose";

export namespace DBDaily {
    export interface ISchema {
        last: number;
        streak: number
    }

    export const schema = new Schema(
        {
            last: { type: Number, default: 0 },
            streak: { type: Number, default: 0 },
        },
        {
            _id: false
        }
    )
}
