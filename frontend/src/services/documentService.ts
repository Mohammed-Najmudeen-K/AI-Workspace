import api from "../api/api";

export const getDocuments = async () => {
    const res = await api.get("/documents");
    return res.data;
};

export const uploadDocument = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    const res = await api.post(
        "/documents/upload",
        formData
    );

    return res.data;
};

export const deleteDocument = async (id: number) => {
    await api.delete(`/documents/${id}`);
};

export const deleteAllDocuments = async () => {
    const res = await api.delete("/documents");
    return res.data;
};