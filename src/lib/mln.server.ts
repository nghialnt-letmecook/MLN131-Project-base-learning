import { signPayload } from "./mln.signing";

const MLN_BASE = "http://n8n.aizy.io.vn:5678/motkhoivietnam";

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
  value: string;
}

export async function fetchLeaderboardServer(): Promise<LeaderboardEntry[]> {
  const key = process.env.MLN_LEADERBOARD_API_KEY;
  if (!key) throw new Error("MLN_LEADERBOARD_API_KEY is not set");
  const res = await fetch(`${MLN_BASE}/leaderboard`, {
    headers: { motkhoivietnam: key },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Leaderboard failed: ${res.status}`);
  const raw: LeaderboardRawItem[] = await res.json();
  if (!Array.isArray(raw)) return [];

  const entries: LeaderboardEntry[] = [];
  for (const item of raw) {
    if (typeof item?.value !== "string") continue;
    try {
      const parsed = JSON.parse(item.value) as LeaderboardEntry;
      if (
        typeof parsed?.name === "string" &&
        typeof parsed?.picture === "string" &&
        typeof parsed?.count === "number"
      ) {
        const picture = parsed.picture.trim();
        const imageSrc = picture.startsWith("/")
          ? picture
          : `/images/${picture.replace(/^images\//, "")}`;
        entries.push({
          name: parsed.name,
          picture,
          count: parsed.count,
          imageSrc,
        });
      }
    } catch {
      // skip invalid value
    }
  }
  return entries;
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

const CHATBOT_URL = "http://n8n.aizy.io.vn:5678/motkhoivietnam/chatbot";

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
