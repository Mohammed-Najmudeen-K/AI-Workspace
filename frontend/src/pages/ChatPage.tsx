import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";

import {
    createConversation,
    getConversation,
    getConversations,
    sendMessage,
} from "../services/chatService";

const ChatPage = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<number | null>(null);

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const data = await getConversations();
    setConversations(data);
  };

  const handleConversationClick = async (id: number) => {
    const conversation = await getConversation(id);

    setSelectedConversation(id);

    setMessages(conversation.messages);
  };

  const handleNewChat = async () => {
    const chat = await createConversation("New Chat");

    setConversations((prev) => [...prev, chat]);

    setSelectedConversation(chat.id);

    setMessages([]);
  };

  const handleSend = async (text: string) => {
  if (!selectedConversation) return;

  await sendMessage(selectedConversation, text);

  const updated = await getConversation(selectedConversation);

  setMessages(updated.messages);
  };

  return (
  <div
    style={{
      display: "flex",
      height: "100vh",
    }}
  >
    <Sidebar
      conversations={conversations}
      onNewChat={handleNewChat}
      onSelect={handleConversationClick}
    />

    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatWindow messages={messages} />

      <ChatInput onSend={handleSend} />
    </div>
  </div>
);
};

export default ChatPage;