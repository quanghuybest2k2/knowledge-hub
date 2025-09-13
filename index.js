import dotenv from "dotenv";
import { MezonClient } from "mezon-sdk";
import fs from "fs/promises";
import path from "path";
import http from "http";

dotenv.config();

const PORT = process.env.PORT || 3000;
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("✅ Bot is running!\n");
  })
  .listen(PORT, () => {
    console.log(`🌐 Healthcheck server running on port ${PORT}`);
  });

const NOTE_FILE = path.join(process.cwd(), "data", "note.md");
const SOL_FILE = path.join(process.cwd(), "data", "solution.md");

// Parse Markdown into structured data
async function loadMarkdown(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    // Split notes by "# " heading
    const blocks = raw.split(/^# /m).filter(Boolean);

    return blocks.map((block, i) => {
      const lines = block.trim().split("\n");
      const title = lines.shift()?.trim() || `Item ${i + 1}`;
      const content = lines.join("\n").trim();
      return {
        id: i + 1,
        title,
        content,
      };
    });
  } catch (err) {
    return { error: err };
  }
}

function formatList(items, limit = 10) {
  if (!items || items.error)
    return { text: "No file or invalid data.", items: [] };
  if (items.length === 0) return { text: "No entries found.", items: [] };

  const shown = items.slice(0, limit);
  const lines = shown.map((it, idx) => `${idx + 1}. [${it.id}] ${it.title}`);
  let text = `Found ${items.length} entries:\n` + lines.join("\n");
  if (items.length > limit)
    text += `\n...and ${
      items.length - limit
    } more. Use "!note show <index>" or "!solution show <index>" to view details.`;
  return { text, items: shown };
}

async function main() {
  const client = new MezonClient(process.env.APPLICATION_TOKEN);
  await client.login();

  client.onChannelMessage(async (event) => {
    try {
      const content = event?.content?.t;
      if (!content) return;

      const trimmed = content.trim();
      const lower = trimmed.toLowerCase();

      const channel = await client.channels.fetch(event.channel_id);
      const message = await channel.messages.fetch(event.message_id);

      // HELP
      if (lower === "!help") {
        const helpText = [
          "**Memo Bot — Commands:**",
          "`!note list` — list notes (from note.md)",
          "`!note show <index>` — show note detail",
          "`!solution list` — list solutions (from solution.md)",
          "`!solution show <index>` — show solution detail",
          "`!help` — show this help",
        ].join("\n");
        await message.reply({ t: helpText });
        return;
      }

      // NOTE LIST
      if (lower === "!note list") {
        const notes = await loadMarkdown(NOTE_FILE);
        if (notes.error) {
          await message.reply({
            t: `❗ Cannot load note.md: ${notes.error.message}`,
          });
          return;
        }
        const { text } = formatList(notes);
        await message.reply({ t: text });
        return;
      }

      // SOLUTION LIST
      if (lower === "!solution list") {
        const sols = await loadMarkdown(SOL_FILE);
        if (sols.error) {
          await message.reply({
            t: `❗ Cannot load solution.md: ${sols.error.message}`,
          });
          return;
        }
        const { text } = formatList(sols);
        await message.reply({ t: text });
        return;
      }

      // NOTE SHOW
      if (lower.startsWith("!note show")) {
        const idx = parseInt(trimmed.split(/\s+/)[2], 10) - 1;
        if (isNaN(idx)) {
          await message.reply({
            t: "Usage: `!note show <index>` — use index from `!note list`.",
          });
          return;
        }
        const notes = await loadMarkdown(NOTE_FILE);
        if (notes.error) {
          await message.reply({
            t: `❗ Cannot load note.md: ${notes.error.message}`,
          });
          return;
        }
        const found = notes[idx];
        if (!found) {
          await message.reply({ t: `❗ Note not found.` });
          return;
        }
        await message.reply({
          t: `📘 Note [${found.id}] ${found.title}\n\n${found.content}`,
        });
        return;
      }

      // SOLUTION SHOW
      if (lower.startsWith("!solution show")) {
        const idx = parseInt(trimmed.split(/\s+/)[2], 10) - 1;
        if (isNaN(idx)) {
          await message.reply({
            t: "Usage: `!solution show <index>` — use index from `!solution list`.",
          });
          return;
        }
        const sols = await loadMarkdown(SOL_FILE);
        if (sols.error) {
          await message.reply({
            t: `❗ Cannot load solution.md: ${sols.error.message}`,
          });
          return;
        }
        const found = sols[idx];
        if (!found) {
          await message.reply({ t: `❗ Solution not found.` });
          return;
        }
        await message.reply({
          t: `🛠 Solution [${found.id}] ${found.title}\n\n${found.content}`,
        });
        return;
      }

      if (trimmed.startsWith("!")) {
        await message.reply({
          t: `❓ Unknown command "${trimmed}". Use \`!help\` to see available commands.`,
        });
      }
    } catch (err) {
      console.error("Handler error:", err);
    }
  });

  console.log("🤖 Knowledge bot (Markdown) started!");
}

main().catch((err) => console.error("Startup error:", err));
