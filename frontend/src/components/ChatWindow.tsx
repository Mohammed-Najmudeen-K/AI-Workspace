import { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble";

type ChatWindowProps = {
  messages: any[];
  loading: boolean;
  isStreaming: boolean;
};

function ChatWindow({
  messages,
  loading,
  isStreaming,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading, isStreaming]);

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="empty-state">
          <h2>🤖 AI Workspace</h2>
          <p>Start a new conversation or upload documents to build a knowledge base.</p>
          <p>Your AI chat supports streaming replies, markdown formatting, and code snippets.</p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              sender={message.role === "assistant" ? "assistant" : "user"}
              text={message.content}
            />
          ))}

          {(loading || isStreaming) && (
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
              <span>Gemini is typing...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}

export default ChatWindow;