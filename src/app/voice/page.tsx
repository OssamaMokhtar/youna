import type { Metadata } from "next";
import VoiceChat from "@/components/VoiceChat";

export const metadata: Metadata = {
  title: "Voice Chat — Youna",
  description: "Talk with Youna using voice — speak naturally, hear Youna respond aloud.",
};

export default function VoiceChatPage() {
  return <VoiceChat />;
}
