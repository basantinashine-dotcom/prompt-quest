// Each change gets its own storage key, so tabs never overwrite a shared list.
// Keep this function self-contained for the downloadable HTML file.
export function createHabitStore(storage: Storage | null) {
  type Habit = { id: string; name: string; color: string; days: string[] };
  type Change = {
    kind: 'add' | 'remove' | 'check' | 'color';
    id: string;
    name?: string;
    color?: string;
    day?: string;
    checked?: boolean;
  };
  type Event = Change & { at: number; eventId: string };
  const prefix = 'prompt-quest-habit-event-v2:';
  let memory: Habit[] = [],
    latest = 0,
    persistent = !!storage;
  const validColor = (color: unknown): color is string =>
    typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color);
  function apply(habits: Habit[], event: Change) {
    const habit = habits.find((h) => h.id === event.id);
    if (
      event.kind === 'add' &&
      !habit &&
      typeof event.name === 'string' &&
      event.name.trim()
    )
      habits.push({
        id: event.id,
        name: event.name.slice(0, 80),
        color: validColor(event.color) ? event.color : '#23804c',
        days: [],
      });
    if (event.kind === 'remove') return habits.filter((h) => h.id !== event.id);
    if (habit && event.kind === 'color' && validColor(event.color))
      habit.color = event.color;
    if (
      habit &&
      event.kind === 'check' &&
      typeof event.day === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(event.day)
    ) {
      habit.days = habit.days.filter((day) => day !== event.day);
      if (event.checked === true) habit.days.push(event.day);
    }
    return habits;
  }
  function read() {
    if (!persistent || !storage) return memory;
    try {
      let habits: Habit[] = [];
      try {
        const old = JSON.parse(
          storage.getItem('prompt-quest-habits-v1') || '[]',
        );
        if (Array.isArray(old))
          habits = old
            .filter(
              (h) =>
                h &&
                typeof h.id === 'string' &&
                typeof h.name === 'string' &&
                Array.isArray(h.days),
            )
            .map((h) => ({
              id: h.id,
              name: h.name.slice(0, 80),
              color: validColor(h.color) ? h.color : '#23804c',
              days: h.days.filter(
                (day: unknown) =>
                  typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day),
              ),
            }));
      } catch {
        /* Recover valid events even if legacy data is corrupt. */
      }
      const events: Event[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (!key?.startsWith(prefix)) continue;
        try {
          const event = JSON.parse(storage.getItem(key) || 'null');
          if (
            event &&
            typeof event.id === 'string' &&
            typeof event.eventId === 'string' &&
            Number.isFinite(event.at)
          )
            events.push(event);
        } catch {
          /* Ignore a damaged entry rather than losing the whole list. */
        }
      }
      events.sort((a, b) => a.at - b.at || a.eventId.localeCompare(b.eventId));
      for (const event of events) {
        habits = apply(habits, event);
        latest = Math.max(latest, event.at);
      }
      memory = habits;
    } catch {
      persistent = false;
    }
    return memory;
  }
  function change(change: Change) {
    read();
    const eventId =
      globalThis.crypto?.randomUUID?.() ??
      Date.now().toString(36) +
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2);
    const event: Event = {
      ...change,
      eventId,
      at: Math.max(Date.now(), latest + 1),
    };
    latest = event.at;
    if (persistent && storage) {
      try {
        storage.setItem(prefix + eventId, JSON.stringify(event));
        return read();
      } catch {
        persistent = false;
      }
    }
    memory = apply(memory, event);
    return memory;
  }
  return { read, change, isPersistent: () => persistent, prefix };
}
