import { getSubmitToken } from "@/app/actions/mln.actions";
import PuzzleGame from "./GameClient";

export default async function GamePlayPage({
  params,
}: {
  params: Promise<{ img: string }>;
}) {
  const { img } = await params;
  const slug = typeof img === "string" ? img : Array.isArray(img) ? img[0] : "header.png";
  const submitToken = await getSubmitToken();
  return <PuzzleGame img={slug} submitToken={submitToken} />;
}
