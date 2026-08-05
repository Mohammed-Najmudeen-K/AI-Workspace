import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
  loading: boolean;
  isStreaming: boolean;
  onStop: () => void;
};

function ChatInput({
  onSend,
  loading,
  isStreaming,
  onStop,
}: Props) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;

    onSend(text);

    setText("");
  };

  return (
    <div className="chat-input">
      <input
        className="chat-input__field"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isStreaming) {
            send();
          }
        }}
        placeholder="Type a message or ask a question..."
        disabled={isStreaming}
      />

      {isStreaming ? (
        <button
          onClick={onStop}
          className="chat-input__button chat-input__button--stop"
        >
          Stop
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={send}
          className="chat-input__button"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      )}
    </div>
  );
}

export default ChatInput;