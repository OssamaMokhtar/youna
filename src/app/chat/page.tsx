import { Metadata } from "next";
import ChatInterface from "@/components/ChatInterface";

export const metadata: Metadata = {
  title: "Chat with Youna — Your AI Wellness Companion",
  description: "Have a conversation with Youna. Your AI companion that learns your personality and supports your emotional wellness.",
};

export default function ChatPage() {
  return <ChatInterface />;
}
