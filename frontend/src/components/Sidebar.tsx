type SidebarProps = {
  conversations: any[];
  onNewChat: () => void;
  onSelect: (id: number) => void;
};

function Sidebar({
  conversations,
  onNewChat,
  onSelect,
}: SidebarProps) {
  return (
    <div className="sidebar">
      <button className="new-chat-btn" onClick={onNewChat}>
        + New Chat
      </button>

      {conversations.map((chat) => (
        <div
          key={chat.id}
          className="conversation"
          onClick={() => onSelect(chat.id)}
        >
          {chat.title}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;