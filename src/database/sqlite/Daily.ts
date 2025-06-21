import Database from "better-sqlite3";

export namespace SQDaily {
    interface _IArgs {
        db: Database.Database | null;
    }

    export interface IData {
        last: number;
        streak: number
    }

    const _args: _IArgs = { db: null }

    export function prepare(db: Database.Database) {
        _args.db = db;
        _args.db.prepare(`
            CREATE TABLE IF NOT EXISTS daily (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                last INTEGER NOT NULL DEFAULT 0,
                streak INTEGER NOT NULL DEFAULT 0,
                FORGEIGN KEY (uuid) REFERENCES users (uuid) ON DELETE CASCADE
            );
        `
        ).run();
    }
}
