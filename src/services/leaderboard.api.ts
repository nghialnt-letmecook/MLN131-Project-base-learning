import api from "@/lib/api";

export interface LeaderboardEntry {
  name: string;
  picture: string;
  count: number;
}

export const submitLeaderboard = async (data: LeaderboardEntry) => {
  try {
    const response = await api.post("/haokhikhangchien/leaderboard", data, {
      headers: {
        test: "186a0fcc-9956-4b4e-b337-2cb86363954c",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting to leaderboard:", error);
    throw error;
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await api.get("/haokhikhangchien/leaderboard", {
      headers: {
        test: "186a0fcc-9956-4b4e-b337-2cb86363954c",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
};
