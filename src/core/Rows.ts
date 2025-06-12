import { ButtonStyle } from "discord.js";
import { NSActionRowBuilder } from "../helper/ActionRowBuilder";

export namespace NSRows {
    const _test = NSActionRowBuilder.button([
        {
            id: "test",
            label: "Test",
            style: ButtonStyle.Primary
        }

    ])
    export const buttons = {
        test: _test
    }
}
