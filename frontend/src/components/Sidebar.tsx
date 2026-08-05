import { useState } from "react";

import AppNav from "./AppNav";

type SidebarProps = {
  conversations: any[];
  onNewChat: () => void;
  selectedConversation: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onRename: (id: number, title: string) => void;
};

function Sidebar({
  conversations,
  selectedConversation,
  onNewChat,
  onSelect,
  onDelete,
  onRename,
}: SidebarProps) {

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [search, setSearch] = useState("");

  return (
    <div className="sidebar">

      <AppNav variant="sidebar" />

      <button
        className="new-chat-btn"
        onClick={onNewChat}
      >
        + New Chat
      </button>


      <input
        type="text"
        placeholder="🔍 Search conversations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          margin: "10px 0",
          borderRadius: "8px",
          border: "1px solid #ddd",
          outline: "none",
          boxSizing: "border-box",
        }}
      />


      <div className="conversation-list">
        {conversations
          .filter((chat) =>
            chat.title
              .toLowerCase()
              .includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat.id}
              className={`conversation ${
                selectedConversation === chat.id ? "selected" : ""
              }`}
            >
              {editingId === chat.id ? (
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      if (editTitle.trim()) {
                        await onRename(chat.id, editTitle.trim());
                      }
                      setEditingId(null);
                    }

                    if (e.key === "Escape") {
                      setEditingId(null);
                    }
                  }}
                  onBlur={() => setEditingId(null)}
                  className="conversation-input"
                />
              ) : (
                <span
                  onClick={() => onSelect(chat.id)}
                  className="conversation-title"
                >
                  {chat.title}
                </span>
              )}

              <button
                onClick={() => {
                  setEditingId(chat.id);
                  setEditTitle(chat.title);
                }}
                className="conversation-action"
              >
                ✏️
              </button>

              <button
                onClick={() => onDelete(chat.id)}
                className="conversation-action delete"
              >
                🗑️
              </button>
            </div>
          ))}
      </div>

    </div>
  );
}

export default Sidebar;