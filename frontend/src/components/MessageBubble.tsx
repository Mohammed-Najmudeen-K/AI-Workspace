type Props = {
  sender: "user" | "ai";
  text: string;
};

function MessageBubble({ sender, text }: Props) {
  return (
    <div
      style={{
        textAlign: sender === "user" ? "right" : "left",
        margin: "10px",
      }}
    >
      <strong>{sender === "user" ? "You" : "AI"}:</strong>

      <p>{text}</p>
    </div>
  );
}

export default MessageBubble;