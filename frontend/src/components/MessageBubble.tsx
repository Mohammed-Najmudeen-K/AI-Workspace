import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  sender: "user" | "assistant";
  text: string;
};

function MessageBubble({ sender, text }: Props) {
  const isUser = sender === "user";

  return (
    <div className={`message-row ${isUser ? "user-row" : "assistant-row"}`}>
      <div className={`message ${isUser ? "user" : "assistant"}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");

              if (!inline && match) {
                return (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
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
      </div>
    </div>
  );
}

export default MessageBubble;