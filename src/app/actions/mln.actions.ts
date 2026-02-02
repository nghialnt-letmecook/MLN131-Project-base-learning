"use server";

import { verifySubmitToken } from "@/lib/mln.signing";
import {
  fetchLeaderboardServer,
  storeScoreServer,
  fetchChatbotServer,
  type LeaderboardEntry,
} from "@/lib/mln.server";

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return fetchLeaderboardServer();
}

export async function getSubmitToken(): Promise<{
  nonce: string;
  timestamp: number;
  token: string;
}> {
  const { createSubmitToken } = await import("@/lib/mln.signing");
  return createSubmitToken();
}

export async function storeScore(
  payload: { name: string; picture: string; count: number },
  nonce: string,
  timestamp: number,
  token: string
): Promise<unknown> {
  if (!verifySubmitToken(nonce, timestamp, token)) {
    throw new Error("Invalid or expired submit token");
  }
  return storeScoreServer(payload);
}

export async function sendChatMessage(payload: {
  sessionId: string;
  chatInput: string;
}): Promise<{ audioBase64: string }> {
  const buffer = await fetchChatbotServer(payload);
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(buffer).toString("base64")
      : btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return { audioBase64: base64 };
}
