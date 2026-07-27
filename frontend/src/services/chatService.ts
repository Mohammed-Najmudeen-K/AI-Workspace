import api from "../api/api";

export const createConversation = async (title: string) => {
    const response = await api.post("/conversations", {
        title,
    });

    return response.data;
};

export const getConversations = async () => {
    const response = await api.get("/conversations");
    return response.data;
};

export const sendMessage = async (
    conversationId: number,
    message: string
) => {
    const response = await api.post("/chat", {
        conversation_id: conversationId,
        message,
    });

    return response.data;
};

export const getConversation = async (id: number) => {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
};