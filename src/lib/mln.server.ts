import { signPayload } from "./mln.signing";

const MLN_BASE = "http://n8n.aizy.io.vn:5678/webhook/motkhoivietnam";

export interface LeaderboardEntry {
  name: string;
  picture: string;
  count: number;
  imageSrc: string;
}

interface LeaderboardRawItem {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  count: string | number;
  picture: string;
}

export async function fetchLeaderboardServer(): Promise<LeaderboardEntry[]> {
  try {
    const key = process.env.MLN_LEADERBOARD_API_KEY;
    if (!key) {
      console.error("MLN_LEADERBOARD_API_KEY is not set (undefined or empty)");
      return [];
    } else {
      console.log(`MLN_LEADERBOARD_API_KEY loaded: ${key.substring(0, 4)}...`);
    }

    const res = await fetch(`${MLN_BASE}/leaderboard`, {
      headers: { motkhoivietnam: key },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error(`Leaderboard API failed: ${res.status}`);
      return [];
    }

    const raw = await res.json();
    if (!Array.isArray(raw)) {
      console.error("Leaderboard API did not return an array", raw);
      return [];
    }

    const entries: LeaderboardEntry[] = [];
    for (const item of raw) {
      if (!item) continue;

      const name = String(item.name || "").trim();
      const picture = String(item.picture || "").trim();
      const countRaw = item.count;

      if (name && picture && (typeof countRaw === "number" || (typeof countRaw === "string" && countRaw.trim() !== ""))) {
        const count = typeof countRaw === "number" ? countRaw : parseInt(countRaw, 10);

        if (isNaN(count)) continue;

        const imageSrc = picture.startsWith("/")
          ? picture
          : `/images/${picture.replace(/^images\//, "")}`;

        entries.push({
          name,
          picture,
          count,
          imageSrc,
        });
      }
    }
    return entries;
  } catch (error) {
    console.error("Error in fetchLeaderboardServer:", error);
    return [];
  }
}

export async function storeScoreServer(payload: {
  name: string;
  picture: string;
  count: number;
}): Promise<unknown> {
  const key = process.env.MLN_STORE_API_KEY;
  if (!key) throw new Error("MLN_STORE_API_KEY is not set");
  const body = JSON.stringify(payload);
  const signature = signPayload(body);
  const res = await fetch(`${MLN_BASE}/store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      motkhoivietnam: key,
      "X-Payload-Signature": signature,
    },
    body,
  });
  if (!res.ok) throw new Error(`Store score failed: ${res.status}`);
  return res.json();
}

const CHATBOT_URL = "http://n8n.aizy.io.vn:5678/webhook/motkhoivietnam/chatbot";

export async function fetchChatbotServer(payload: {
  sessionId: string;
  chatInput: string;
}): Promise<ArrayBuffer> {
  const key = process.env.MLN_LEADERBOARD_API_KEY;
  if (!key) throw new Error("MLN_LEADERBOARD_API_KEY is not set");
  const res = await fetch(CHATBOT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      motkhoivietnam: key,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Chatbot failed: ${res.status}`);
  return res.arrayBuffer();
}
