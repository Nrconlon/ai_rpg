const Globals = require('../Globals.js');
const SlashCommandBase = require('../SlashCommandBase.js');

function parseTimeString(raw) {
  if (typeof raw !== 'string') {
    return null;
  }
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) {
    return null;
  }

  // Try HH:MM with optional am/pm
  const clockMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/);
  if (clockMatch) {
    let hours = Number.parseInt(clockMatch[1], 10);
    const minutes = Number.parseInt(clockMatch[2], 10);
    const meridiem = clockMatch[3] || null;

    if (meridiem === 'pm' && hours < 12) {
      hours += 12;
    } else if (meridiem === 'am' && hours === 12) {
      hours = 0;
    }

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null;
    }
    return (hours * 60) + minutes;
  }

  // Try plain number as total minutes
  if (/^\d+$/.test(trimmed)) {
    const value = Number.parseInt(trimmed, 10);
    if (value >= 0) {
      return value;
    }
  }

  return null;
}

class SetTimeCommand extends SlashCommandBase {
  static get name() {
    return 'set_time';
  }

  static get aliases() {
    return ['settime'];
  }

  static get description() {
    return 'Set the in-game time and/or day. Usage: /set_time 14:30 day=5';
  }

  static get args() {
    return [
      { name: 'time', type: 'string', required: false }
    ];
  }

  static async execute(interaction, args = {}) {
    Globals.ensureWorldTimeInitialized();

    const current = Globals.getWorldTimeContext();
    let newTimeMinutes = current.timeMinutes;
    let newDayIndex = current.dayIndex;
    let changedTime = false;
    let changedDay = false;

    // Parse time argument (positional)
    const rawTime = args.time;
    if (rawTime !== undefined && rawTime !== null) {
      const timeStr = String(rawTime).trim();
      // Skip if it looks like a key=value that leaked in positionally
      if (timeStr && !/^[a-z]+=/.test(timeStr)) {
        const parsed = parseTimeString(timeStr);
        if (parsed === null) {
          await interaction.reply({
            content: `Invalid time format: \`${timeStr}\`. Use \`HH:MM\`, \`H:MMam\`, \`H:MMpm\`, or a minute value.`,
            ephemeral: true
          });
          return;
        }
        newTimeMinutes = parsed;
        changedTime = true;
      }
    }

    // Parse day argument (key=value from client)
    if (args.day !== undefined && args.day !== null) {
      const dayValue = Number(args.day);
      if (!Number.isFinite(dayValue) || dayValue < 0 || !Number.isInteger(dayValue)) {
        await interaction.reply({
          content: `Invalid day index: \`${args.day}\`. Must be a non-negative integer.`,
          ephemeral: true
        });
        return;
      }
      newDayIndex = dayValue;
      changedDay = true;
    }

    if (!changedTime && !changedDay) {
      const lines = [
        '**Current World Time**',
        `- Time: **${current.timeLabel}** (${current.timeMinutes} minutes)`,
        `- Date: **${current.dateLabel}**`,
        `- Day Index: **${current.dayIndex}**`,
        `- Segment: **${current.segment}**`,
        `- Season: **${current.season}**`,
        '',
        '**Usage:**',
        '`/set_time 14:30` — set clock time',
        '`/set_time day=5` — set day index',
        '`/set_time 14:30 day=5` — set both',
        '`/set_time 480` — set time as minutes since midnight'
      ];
      await interaction.reply({ content: lines.join('\n'), ephemeral: false });
      return;
    }

    // Set the new time via hydrateWorldTime (handles normalization)
    Globals.hydrateWorldTime({
      worldTime: { dayIndex: newDayIndex, timeMinutes: newTimeMinutes }
    });

    const after = Globals.getWorldTimeContext();

    const changes = [];
    if (changedTime) {
      changes.push(`time → **${after.timeLabel}** (${after.timeMinutes} min)`);
    }
    if (changedDay) {
      changes.push(`day → **${after.dayIndex}**`);
    }

    const lines = [
      `World time updated: ${changes.join(', ')}`,
      `- Date: **${after.dateLabel}**`,
      `- Segment: **${after.segment}** · Season: **${after.season}**`
    ];

    await interaction.reply({ content: lines.join('\n'), ephemeral: false });
  }
}

module.exports = SetTimeCommand;
