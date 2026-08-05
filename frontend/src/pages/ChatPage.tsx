import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import { deleteConversation} from "../services/chatService";
import {
  createConversation,
  getConversation,
  getConversations,
  streamMessage,
  stopStreaming,
  renameConversation,
} from "../services/chatService";

const ChatPage = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
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

  const handleRename = async (
    id: number,
    title: string
) => {
    await renameConversation(id, title);

    await loadConversations();
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
  const handleDelete = async (id: number) => {
    await deleteConversation(id);

    await loadConversations();

    if (selectedConversation === id) {
        setSelectedConversation(null);
        setMessages([]);
    }
};

const handleSend = async (text: string) => {
  if (!selectedConversation) return;

  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      content: text,
    },
    {
      role: "assistant",
      content: "",
    },
  ]);

  setLoading(true);
  setIsStreaming(true);

  try {
    await streamMessage(
      selectedConversation,
      text,
      (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content:
              updated[updated.length - 1].content + chunk,
          };

          return updated;
        });
      }
    );

    await loadConversations();
  } catch (err: any) {
    if (err.name !== "AbortError") {
      console.error(err);
    }
  } finally {
    setLoading(false);
    setIsStreaming(false);
  }
};

const handleStop = () => {
  stopStreaming();
  setIsStreaming(false);
  setLoading(false);

  setMessages((prev) => {
    if (prev.length === 0) return prev;

    const last = prev[prev.length - 1];

    if (last.role === "assistant" && last.content === "") {
      return prev.slice(0, -1);
    }

    return prev;
  });
};

  const selectedTitle =
    conversations.find((chat) => chat.id === selectedConversation)
      ?.title || "New conversation";

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        onNewChat={handleNewChat}
        selectedConversation={selectedConversation}
        onSelect={handleConversationClick}
        onDelete={handleDelete}
        onRename={handleRename}
      />

      <div className="chat-area">
        <div className="chat-header">
          <div>
            <h2>{selectedConversation ? selectedTitle : "Welcome back"}</h2>
            <p>
              {selectedConversation
                ? "Continue your conversation or ask a new question."
                : "Create a new chat to ask the AI anything."}
            </p>
          </div>
          <div className="conversation-count">
            {conversations.length} chat{conversations.length === 1 ? "" : "s"}
          </div>
        </div>

        <ChatWindow
          messages={messages}
          loading={loading}
          isStreaming={isStreaming}
        />

        <ChatInput
          onSend={handleSend}
          loading={loading}
          isStreaming={isStreaming}
          onStop={handleStop}
        />
      </div>
    </div>
  );
};


export default ChatPage;