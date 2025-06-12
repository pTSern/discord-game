
import { CommandInteraction } from 'discord.js'

export async function dice(_interaction: CommandInteraction): Promise<void> {
    const { options } = _interaction;

    const _value = Number(options.get('value')?.value);
    const _amount = Math.abs(Number(options.get('amount')?.value));

    const _result = Math.random() * 6 >> 0;
    const _message = _value === _result ? `Em ${_interaction.user.username} cược ${_value} trùng với kết quả là ${_result} 🎲 => bú ${_amount * 2} coins!` :
        `Em ${_interaction.user.username} cược ${_amount} vào ${_value}, nhưng kết quả là ${_result} 🎲 và mất ${_amount} coins!`;
    await _interaction.reply(_message);

}
