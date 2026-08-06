import { useEffect, useRef, useState, type RefObject } from "react";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import { deleteConversation, getConversations, createConversation, getConversation, streamMessage, stopStreaming, renameConversation } from "../services/chatService";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  reaction?: "like" | "dislike" | null;
};

const ChatPage = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(512);
  const [topK, setTopK] = useState(5);
  const chatWindowRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    void loadConversations();
  }, []);

  const loadConversations = async () => {
    const data = await getConversations();
    setConversations(data);
  };

  const scrollToBottom = (behavior: "smooth" | "auto" = "smooth") => {
    chatWindowRef.current?.scrollTo({
      top: chatWindowRef.current.scrollHeight,
      behavior,
    });
  };

  const handleScroll = () => {
    const node = chatWindowRef.current;

    if (!node) return;

    const nearBottom = node.scrollHeight - (node.scrollTop + node.clientHeight) < 140;
    setShowScrollButton(!nearBottom);

    if (nearBottom) {
      shouldAutoScrollRef.current = true;
    }
  };

  useEffect(() => {
    const node = chatWindowRef.current;

    if (!node) return;

    node.addEventListener("scroll", handleScroll);

    return () => node.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom("smooth");
    }
  }, [messages, loading, isStreaming]);

  const handleRename = async (id: number, title: string) => {
    await renameConversation(id, title);
    await loadConversations();
  };

  const handleConversationClick = async (id: number) => {
    const conversation = await getConversation(id);

    setSelectedConversation(id);
    setMessages(conversation.messages);
    shouldAutoScrollRef.current = true;
    setShowScrollButton(false);
  };

  const handleNewChat = async () => {
    const chat = await createConversation("New Chat");

    setConversations((prev) => [...prev, chat]);
    setSelectedConversation(chat.id);
    setMessages([]);
    shouldAutoScrollRef.current = true;
    setShowScrollButton(false);
  };

  const handleDelete = async (id: number) => {
    await deleteConversation(id);
    await loadConversations();

    if (selectedConversation === id) {
      setSelectedConversation(null);
      setMessages([]);
      shouldAutoScrollRef.current = true;
      setShowScrollButton(false);
    }
  };

  const appendAssistantChunk = (prev: ChatMessage[], chunk: string) => {
    const updated = [...prev];

    if (updated.length === 0 || updated[updated.length - 1].role !== "assistant") {
      updated.push({ role: "assistant", content: chunk, reaction: null });
      return updated;
    }

    updated[updated.length - 1] = {
      ...updated[updated.length - 1],
      content: updated[updated.length - 1].content + chunk,
    };

    return updated;
  };

  const handleSend = async (text: string) => {
    if (!selectedConversation) return;

    shouldAutoScrollRef.current = true;
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
        reaction: null,
      },
      {
        role: "assistant",
        content: "",
        reaction: null,
      },
    ]);

    setLoading(true);
    setIsStreaming(true);

    try {
      await streamMessage(selectedConversation, text, (chunk) => {
        setMessages((prev) => appendAssistantChunk(prev, chunk));
      });

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

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReact = (index: number, reaction: "like" | "dislike" | null) => {
    setMessages((prev) =>
      prev.map((message, messageIndex) => {
        if (messageIndex !== index) return message;

        const nextReaction = message.reaction === reaction ? null : reaction;

        return {
          ...message,
          reaction: nextReaction,
        };
      })
    );
  };

  const handleRegenerate = async (index: number) => {
    if (!selectedConversation) return;

    const targetMessage = messages[index];

    if (!targetMessage || targetMessage.role !== "assistant") return;

    let userIndex = -1;

    for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
      if (messages[cursor].role === "user") {
        userIndex = cursor;
        break;
      }
    }

    if (userIndex === -1) return;

    const previousMessages = messages.slice(0, userIndex);
    const regeneratedUserMessage = messages[userIndex];

    setMessages([
      ...previousMessages,
      {
        role: "user",
        content: regeneratedUserMessage.content,
        reaction: null,
      },
      {
        role: "assistant",
        content: "",
        reaction: null,
      },
    ]);
    shouldAutoScrollRef.current = true;

    setLoading(true);
    setIsStreaming(true);

    try {
      await streamMessage(selectedConversation, regeneratedUserMessage.content, (chunk) => {
        setMessages((prev) => appendAssistantChunk(prev, chunk));
      });

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

  const handleClearConversation = () => {
    setMessages([]);
    setShowSettings(false);
  };

  const handleClearAllChats = async () => {
    try {
      const remaining = conversations.filter((chat) => chat.id !== selectedConversation);
      setConversations(remaining);
      setSelectedConversation(null);
      setMessages([]);
      setShowSettings(false);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedTitle =
    conversations.find((chat) => chat.id === selectedConversation)?.title ||
    "New conversation";

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
          <div className="chat-header__actions">
            <button type="button" className="theme-toggle" onClick={() => setShowSettings((prev) => !prev)}>
              ⚙️ Settings
            </button>
            <div className="conversation-count">
              {conversations.length} chat{conversations.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        {showSettings && (
          <div className="settings-panel">
            <div className="settings-panel__section">
              <h3>AI</h3>
              <label className="settings-control">
                <span>Temperature</span>
                <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} />
                <strong>{temperature.toFixed(1)}</strong>
              </label>
              <label className="settings-control">
                <span>Max Tokens</span>
                <input type="range" min="128" max="2048" step="64" value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} />
                <strong>{maxTokens}</strong>
              </label>
              <label className="settings-control">
                <span>Top-K Retrieval</span>
                <input type="range" min="1" max="10" step="1" value={topK} onChange={(e) => setTopK(Number(e.target.value))} />
                <strong>{topK}</strong>
              </label>
            </div>

            <div className="settings-panel__section">
              <h3>Chat</h3>
              <button type="button" className="settings-action" onClick={handleClearConversation}>
                Clear conversation
              </button>
              <button type="button" className="settings-action settings-action--danger" onClick={handleClearAllChats}>
                Clear all chats
              </button>
            </div>
          </div>
        )}

        <ChatWindow
          messages={messages}
          loading={loading}
          isStreaming={isStreaming}
          containerRef={chatWindowRef as RefObject<HTMLDivElement | null>}
          showScrollButton={showScrollButton}
          onCopy={handleCopy}
          onReact={handleReact}
          onRegenerate={handleRegenerate}
          onScrollToBottom={() => {
            shouldAutoScrollRef.current = true;
            setShowScrollButton(false);
            scrollToBottom("smooth");
          }}
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