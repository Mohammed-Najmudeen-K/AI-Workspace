import { useState } from "react";

type ChatInputProps = {
  onSend: (text: string) => void;
};

function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);

    setText("");
  };

  return (
    <div className="chat-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />

      <button onClick={handleSend}>
        Send
      </button>
    </div>
  );
}

export default ChatInput;