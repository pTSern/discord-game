import Database from "better-sqlite3";
import { SQInterfaces } from "./Interfaces";

export namespace SQUser {
    interface _IArgs {
        db: Database.Database | null;
        users: Record<string, _User>;
    }

    export interface IData {
        uuid: string;
        coins: number;
    }

    const _args: _IArgs = { db: null, users: {} }

    class _User implements IData {
        static create(_data: IData): _User {
            const { users } = _args;
            const { uuid, coins } = _data;

            if(!!users[uuid]) return users[uuid];

            const _user = new _User();

            _user._uuid = uuid;
            _user._coins = coins;

            users[uuid] = _user;
            return _user;
        }

        addCoins(amount: number): SQInterfaces.IResponse {
            const { db } = _args;
            const _target = this.coins + amount;
            if(_target < 0) return { status: false, error: "Not enough coins." };

            this._coins = _target;

            db.prepare(`UPDATE users SET coins = ? WHERE uuid = ?`).run(this._coins, this._uuid);
            return { status: true };
        }

        protected _uuid: string;
        protected _coins: number;

        get uuid(): string { return this._uuid; }
        get coins(): number { return this._coins; }
    }

    export function prepare(db: Database.Database) {
        _args.db = db;
        _args.db.prepare(`
            CREATE TABLE IF NOT EXISTS daily (
                uuid TEXT PRIMARY KEY,
                coins DOUBLE NOT NULL DEFAULT 0
            );
        `).run();
    }

    export function get(uuid: string): _User {
        const { db } = _args;
        const _stmt = db.prepare(`SELECT * FROM users WHERE uuid = ?`)
        const _row = _stmt.get(uuid) as IData;

        return _User.create(_row);
    }
}
