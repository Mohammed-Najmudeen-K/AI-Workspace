import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  sender: "user" | "assistant";
  text: string;
  reaction?: "like" | "dislike" | null;
  onCopy: (text: string) => void;
  onRegenerate?: () => void;
  onReact?: (reaction: "like" | "dislike" | null) => void;
};

function MessageBubble({ sender, text, reaction, onCopy, onRegenerate, onReact }: Props) {
  const [copied, setCopied] = useState(false);
  const isUser = sender === "user";

  const handleCopy = async () => {
    await onCopy(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const toggleReaction = (value: "like" | "dislike") => {
    if (!onReact) return;
    onReact(reaction === value ? null : value);
  };

  return (
    <div className={`message-row ${isUser ? "user-row" : "assistant-row"}`}>
      <div className={`message ${isUser ? "user" : "assistant"}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              const content = String(children).replace(/\n$/, "");

              if (!inline && match) {
                return (
                  <div className="code-block">
                    <div className="code-block__header">
                      <span>{match[1]}</span>
                      <button type="button" className="code-block__copy" onClick={() => onCopy(content)}>
                        Copy
                      </button>
                    </div>
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {content}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>

        <div className="message-actions">
          <button type="button" className="message-action-chip" onClick={handleCopy}>
            {copied ? "Copied" : "Copy"}
          </button>

          {!isUser && (
            <>
              <button type="button" className="message-action-chip" onClick={onRegenerate}>
                Regenerate
              </button>
              <button
                type="button"
                className={`message-action-chip ${reaction === "like" ? "active" : ""}`}
                onClick={() => toggleReaction("like")}
              >
                👍
              </button>
              <button
                type="button"
                className={`message-action-chip ${reaction === "dislike" ? "active" : ""}`}
                onClick={() => toggleReaction("dislike")}
              >
                👎
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;