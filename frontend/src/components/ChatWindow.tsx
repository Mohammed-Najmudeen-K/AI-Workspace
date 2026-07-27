import MessageBubble from "./MessageBubble";

type Message = {
  role: string;
  content: string;
};

type ChatWindowProps = {
  messages: Message[];
};

function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="chat-window">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          sender={message.role === "assistant" ? "ai" : "user"}
          text={message.content}
        />
      ))}
    </div>
  );
}

export default ChatWindow;