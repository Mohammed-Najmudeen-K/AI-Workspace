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

export const deleteConversation = async (id: number) => {
    await api.delete(`/conversations/${id}`);
};

export const renameConversation = async (
    id: number,
    title: string
) => {
    const res = await api.patch(`/conversations/${id}`, {
        title,
    });

    return res.data;
};

let currentController: AbortController | null = null;

export const stopStreaming = () => {
    currentController?.abort();
    currentController = null;
};

export const streamMessage = async (
    conversationId: number,
    message: string,
    onChunk: (chunk: string) => void
) => {
    stopStreaming();

    const controller = new AbortController();
    currentController = controller;

    const response = await fetch(
        "http://127.0.0.1:8014/chat/stream",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                conversation_id: conversationId,
                message,
            }),
            signal: controller.signal,
        }
    );

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) return;

            onChunk(decoder.decode(value, { stream: true }));
        }
    } catch (err: any) {
        if (err.name === "AbortError") {
            return;
        }
        throw err;
    } finally {
        currentController = null;
        reader.releaseLock();
    }
};