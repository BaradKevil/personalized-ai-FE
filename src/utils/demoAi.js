// Demo AI — a small, honest stand-in for the future agent backend.
// It understands a handful of intents, can create tasks and memories,
// and replies with the product's voice ("I think…", "I'd recommend…").
// The chat UI streams the returned text character by character.
import { addDays, parse, startOfDay } from 'date-fns';
import { demoStore } from './demoStore';
import { dueLabel, formatDay, greetingFor, toISO } from './date';

const agentName = () => demoStore.getAgent().name || 'Novi';
const userName = () => demoStore.getUser().name?.split(' ')[0] || 'there';

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ---- helpers for parsing natural-language due dates ----
const weekdayMap = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };

const nextWeekday = (name) => {
    const target = weekdayMap[name.toLowerCase()];
    if (target === undefined) return null;
    const now = startOfDay(new Date());
    const today = now.getDay();
    let diff = target - today;
    if (diff <= 0) diff += 7;
    return addDays(now, diff);
};

const parseDueDate = (text) => {
    const lower = text.toLowerCase();
    if (/tomorrow/.test(lower)) return addDays(startOfDay(new Date()), 1);
    if (/tonight/.test(lower)) return addDays(startOfDay(new Date()), 0);
    if (/today/.test(lower)) return startOfDay(new Date());
    if (/next week/.test(lower)) return addDays(startOfDay(new Date()), 7);
    const weekdayMatch = lower.match(/next (sunday|monday|tuesday|wednesday|thursday|friday|saturday)/);
    if (weekdayMatch) return nextWeekday(weekdayMatch[1]);
    const inDays = lower.match(/in (\d+) days?/);
    if (inDays) return addDays(startOfDay(new Date()), Number(inDays[1]));
    const onDate = lower.match(/on (jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.? (\d{1,2})/i);
    if (onDate) {
        const parsed = parse(`${onDate[1]} ${onDate[2]}`, 'MMM d', new Date());
        if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    return null;
};

const stripIntent = (text, pattern) => text.replace(pattern, '').replace(/^\s*to\s*/i, '').trim();

// ---- intents ----
const greet = (text) => /^(hi|hello|hey|good morning|good afternoon|good evening|yo|hola)\b/i.test(text.trim());

const askName = (text) => /(your name|who are you|what are you)\b/i.test(text);

const askAboutUser = (text) => /(my name|what do you know|about me|remember me)\b/i.test(text);

const rememberIntent = (text) => /remember (that|i|my|we|the)/i.test(text);

const forgetIntent = (text) => /forget (the |that )?["']?([^"']+)/i.test(text);

const whatRemember = (text) => /(what do you remember|your memories|show memory|what memories)/i.test(text);

const taskCreateIntent = (text) =>
    /(remind me to|create (a )?task|add (a )?task|to-do|todo|need to|must |should )/i.test(text);

const taskListIntent = (text) => /(my tasks|task list|what('s| is) (on )?(my )?list|show (me )?tasks|tasks due|to-dos?)/i.test(text);

const planIntent = (text) => /(plan my day|help me focus|important today|my day|daily briefing|what should i)/i.test(text);

const thanksIntent = (text) => /(thank|thanks|thx)/i.test(text);

const helpIntent = (text) => /(what can you do|help me|how do you work|capabilities)/i.test(text);

// ---- reply builders ----
const taskListReply = () => {
    const open = demoStore.listTasks().filter((t) => !t.completed);
    if (open.length === 0) return "You're all caught up — nothing on your list right now. 🎉";
    const lines = open.map((t) => {
        const when = t.dueDate ? ` (${formatDay(t.dueDate)})` : '';
        const mark = t.priority === 'high' ? '**' : '';
        return `- ${mark}${t.title}${mark}${when}`;
    });
    return `Here's what's on your list:\n\n${lines.join('\n')}\n\nWant me to plan your day around the most important one?`;
};

const dayPlanReply = () => {
    const open = demoStore.listTasks().filter((t) => !t.completed);
    const dueToday = open.filter((t) => t.dueDate && formatDay(t.dueDate) === 'Today');
    const high = open.filter((t) => t.priority === 'high');
    const focus = high[0] || dueToday[0] || open[0];
    const lines = dueToday.slice(0, 3).map((t) => `- ${t.title}${t.dueDate ? ` — ${dueLabel(t.dueDate)}` : ''}`);

    if (!focus) {
        return "You have a clear day. That's a rare gift — maybe protect a block for something you've been putting off?";
    }
    return (
        `Here's what matters today:\n\n` +
        (lines.length ? `**Today's tasks**\n${lines.join('\n')}\n\n` : '') +
        `I'd start with **${focus.title}** — it${focus.priority === 'high' ? "'s your highest priority" : " has the nearest due date"}.\n\n` +
        `Would you like me to set aside a focus block for it?`
    );
};

const rememberReply = (text) => {
    if (demoStore.getSettings().memoryEnabled === false) {
        return "Memory is paused right now, so I'm not saving anything new. You can turn it back on in Settings → Memory.";
    }
    const content = stripIntent(text, /remember (that |i |my |we |the )?/i);
    if (!content) return "What would you like me to remember?";

    let category = 'Personal';
    if (/(prefer|like|enjoy|dislike|hate)/i.test(content)) category = 'Preferences';
    else if (/(goal|want to|plan to|aim to|dream)/i.test(content)) category = 'Goals';
    else if (/(exam|deadline|birthday|anniversary|important|doctor|appointment)/i.test(content)) category = 'Important';
    else if (/(work|job|startup|client|company|meeting|project)/i.test(content)) category = 'Work';

    demoStore.createMemory({ category, content });
    return `Got it — I'll remember that.${category !== 'Personal' ? ` I've filed it under **${category}**.` : ''}\n\nYou can say *forget that* any time, or manage memories in the Memory tab.`;
};

const forgetReply = (text) => {
    const match = text.match(/forget (the |that )?["']?([^"'.!?]+)/i);
    const fragment = (match?.[2] || '').trim();
    const removed = fragment ? demoStore.deleteMemoryByContent(fragment) : false;
    if (removed) return `Done — I've forgotten that. It won't come back up in our conversations.`;
    return "I don't think I had that stored. You can check the Memory tab to see what I know.";
};

const whatRememberReply = () => {
    const memories = demoStore.listMemories().slice(0, 5);
    if (memories.length === 0) return "I don't have any long-term memories yet. Tell me something like *remember that I prefer mornings* and I'll keep it.";
    return `Here's what I remember about you:\n\n${memories.map((m) => `- **${m.category}**: ${m.content}`).join('\n')}\n\nYou can edit or delete any of these in the Memory tab.`;
};

const createTaskReply = (text) => {
    const cleaned = stripIntent(text, /remind me to|create (a )?task( to)?|add (a )?task( to)?|to-do:|i need to|i must|i should/i);
    const title = cleaned.replace(/^to\s+/i, '').replace(/[.!?]+$/, '').trim();
    if (!title) {
        return "Sure — what would you like me to add? Tell me something like *remind me to call Rahul next Tuesday*.";
    }
    const due = parseDueDate(text);
    const priority = /(urgent|asap|important|immediately)/i.test(text) ? 'high' : /(sometime|whenever|eventually)/i.test(text) ? 'low' : 'medium';

    const task = demoStore.createTask({
        title: title.charAt(0).toUpperCase() + title.slice(1),
        priority,
        dueDate: due ? toISO(due) : null,
    });

    const when = task.dueDate ? ` for ${formatDay(task.dueDate)}${task.dueDate && /tonight/.test(text) ? ' evening' : ''}` : '';
    return `Done — I've added **${task.title}**${when}${priority === 'high' ? ' and marked it high priority' : ''}. ✅\n\nIt's in your Tasks tab. Want me to also plan when you'll do it?`;
};

const fallbackReply = () => {
    const open = demoStore.listTasks().filter((t) => !t.completed);
    const focus = open.find((t) => t.priority === 'high') || open[0];
    const extra = focus
        ? `\n\nI noticed **${focus.title}** is still on your list — want to tackle that?`
        : '\n\nYou look caught up. Anything you want to plan or remember?';

    return (
        `I'm running in **demo mode** right now, so I can't browse the web or use external services yet — but I'm already useful for your day-to-day.` +
        `\n\nI can:\n\n- *Remind me to call Rahul next Tuesday* → create tasks\n- *Remember that I prefer morning meetings* → build your memory\n- *Plan my day* → prioritise what's important\n- *What do you remember?* → show your memory` +
        extra
    );
};

const helpReply = () =>
    `Here's what I can do right now:\n\n- **Tasks** — say *remind me to …* with a time like *tomorrow* or *next Tuesday*\n- **Memory** — say *remember that I…* or *forget …*\n- **Planning** — say *plan my day* and I'll surface what matters\n- **Questions about you** — say *what do you remember?*\n\nI'm in demo mode for now; my full skills arrive with the Milo backend. What would you like to try?`;

const aboutUserReply = () => {
    const user = demoStore.getUser();
    const memories = demoStore.listMemories().slice(0, 3);
    const memLine = memories.length
        ? `\n\nI also keep ${memories.length} memories about you — like *${memories[0].content}*`
        : '';
    return `I know you as **${user.name}**, and you're building toward some good things.${memLine}\n\nTell me more whenever you like — I'll remember what matters.`;
};

// ---- main entry ----
export const planReply = (text) => {
    const trimmed = (text || '').trim();

    if (askName(trimmed)) {
        return {
            text: `I'm **${agentName()}** — your personal AI. Think of me as a calm, private chief of staff: I keep your tasks, goals and memories in one place and help you stay ahead.`,
            actions: [],
        };
    }
    if (askAboutUser(trimmed)) {
        return { text: aboutUserReply(), actions: [] };
    }
    if (whatRemember(trimmed)) {
        return { text: whatRememberReply(), actions: [] };
    }
    if (forgetIntent(trimmed)) {
        return { text: forgetReply(trimmed), actions: ['memories'] };
    }
    if (rememberIntent(trimmed)) {
        return { text: rememberReply(trimmed), actions: ['memories'] };
    }
    if (taskCreateIntent(trimmed)) {
        return { text: createTaskReply(trimmed), actions: ['tasks'] };
    }
    if (taskListIntent(trimmed)) {
        return { text: taskListReply(), actions: [] };
    }
    if (planIntent(trimmed)) {
        return { text: dayPlanReply(), actions: [] };
    }
    if (helpIntent(trimmed)) {
        return { text: helpReply(), actions: [] };
    }
    if (thanksIntent(trimmed)) {
        return { text: pick([
            `You're welcome, ${userName()}. Anything else I can help with?`,
            `Anytime. That's what I'm here for.`,
        ]), actions: [] };
    }
    if (greet(trimmed)) {
        return {
            text: `${greetingFor()}, ${userName()}. 👋\n\nWhat can I help you with today?`,
            actions: [],
        };
    }

    return { text: fallbackReply(), actions: [] };
};

// Demo stream helper: yields chunks of the reply so the UI can type it out.
export const streamReply = (text, onChunk) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += 3) chunks.push(text.slice(i, i + 3));
    let i = 0;
    return new Promise((resolve) => {
        const step = () => {
            if (i < chunks.length) {
                onChunk(chunks[i]);
                i += 1;
                setTimeout(step, 18 + Math.random() * 22);
            } else {
                resolve();
            }
        };
        setTimeout(step, 350);
    });
};
