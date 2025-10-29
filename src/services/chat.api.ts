import api from "@/lib/api";
import { ChatSession } from "@/types/chat.type";
import { refreshTokenIfNeeded, getToken } from "@/services/token.api";

export const createChatSession = async (data: ChatSession) => {
  let retryCount = 0;
  const maxRetries = 1;
  while (retryCount <= maxRetries) {
    try {
      const response = await api.post("/chat", data, {
        responseType: "arraybuffer", // hoặc "blob"
        headers: {
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
      });
      // chuyển ArrayBuffer -> Blob -> ObjectURL
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" }); // nếu server trả mp3
      console.log(response);

      const audioUrl = URL.createObjectURL(audioBlob);

      // phát audio
      const audio = new Audio(audioUrl);
      audio.play();
      // Nếu response là JSON và báo token expired thì retry
      let resData = response.data;
      try {
        if (typeof resData === "string") resData = JSON.parse(resData);
      } catch {}
      if (
        resData?.valid === "false" &&
        typeof resData?.reason === "string" &&
        resData.reason.includes("Token expired")
      ) {
        await refreshTokenIfNeeded(true);
        retryCount++;
        continue;
      }
      return response.data;
    } catch (error: any) {
      // Nếu lỗi do token expired, thử refresh và retry
      let resData = error?.response?.data;
      try {
        if (typeof resData === "string") resData = JSON.parse(resData);
      } catch {}
      if (
        resData?.valid === "false" &&
        typeof resData?.reason === "string" &&
        resData.reason.includes("Token expired")
      ) {
        await refreshTokenIfNeeded(true);
        retryCount++;
        continue;
      }
      throw error;
    }
  }
};
