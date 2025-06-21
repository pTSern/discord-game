
export namespace NSDiceIcon {
    const _list = [1, 2, 3, 4, 5, 6] as const;
    export type TIcon = (typeof _list)[number];

    export const list: Record<TIcon, string> = {
        1: "⚀",
        2: "⚁",
        3: "⚂",
        4: "⚃",
        5: "⚄",
        6: "⚅"
    }

    export function get(_icon: number): string {
        const { length } = _list;

        _icon = Math.max(1, Math.min(_icon, length)) as TIcon;

        return list[_icon];
    }
}
