
import Database from 'better-sqlite3';
import { SQDaily } from './Daily';
import { SQUser } from './User';

export namespace SQCore {
    const _db = new Database('./database.db')
    //_db.pragma('foreign_keys = ON');

    export function prepare() {
        SQUser.prepare(_db);
        //SQDaily.prepare(_db);
    }
}

