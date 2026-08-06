import type { RefObject } from "react";

import MessageBubble from "./MessageBubble";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  reaction?: "like" | "dislike" | null;
};

type ChatWindowProps = {
  messages: ChatMessage[];
  loading: boolean;
  isStreaming: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  showScrollButton: boolean;
  onCopy: (text: string) => void;
  onReact: (index: number, reaction: "like" | "dislike" | null) => void;
  onRegenerate: (index: number) => void;
  onScrollToBottom: () => void;
};

function ChatWindow({
  messages,
  loading,
  isStreaming,
  containerRef,
  showScrollButton,
  onCopy,
  onReact,
  onRegenerate,
  onScrollToBottom,
}: ChatWindowProps) {
  return (
    <div className="chat-window" ref={containerRef}>
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
              key={`${message.role}-${index}`}
              sender={message.role === "assistant" ? "assistant" : "user"}
              text={message.content}
              reaction={message.reaction}
              onCopy={onCopy}
              onReact={(reaction) => onReact(index, reaction)}
              onRegenerate={message.role === "assistant" ? () => onRegenerate(index) : undefined}
            />
          ))}

          {(loading || isStreaming) && (
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
              <span className="typing-text">Gemini is typing<span className="typing-cursor" /></span>
            </div>
          )}

          {showScrollButton && (
            <button type="button" className="scroll-to-bottom" onClick={onScrollToBottom}>
              ↓
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default ChatWindow;