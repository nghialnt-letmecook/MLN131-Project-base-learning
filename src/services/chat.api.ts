import { sendChatMessage } from "@/app/actions/mln.actions";
import { ChatSession } from "@/types/chat.type";

export const createChatSession = async (
  data: ChatSession
): Promise<HTMLAudioElement> => {
  const { audioBase64 } = await sendChatMessage(data);
  const binary = atob(audioBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const audioBlob = new Blob([bytes], { type: "audio/mpeg" });
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.playbackRate = 1.2;
  audio.play();
  return audio;
};
