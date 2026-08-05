import chromadb

client = chromadb.PersistentClient(
    path="app/chroma_db"
)

collection = client.get_or_create_collection(
    name="documents"
)


class ChromaService:

    def add_chunk(
        self,
        document_id: int,
        chunk_id: int,
        text: str,
        embedding: list[float],
    ):
        collection.add(
            ids=[f"{document_id}_{chunk_id}"],
            documents=[text],
            embeddings=[embedding],
            metadatas=[
                {
                    "document_id": document_id,
                    "chunk_id": chunk_id,
                }
            ],
        )

    def search(
        self,
        embedding: list[float],
        top_k: int = 5,
    ):
        return collection.query(
            query_embeddings=[embedding],
            n_results=top_k,
        )

    def search_texts(
        self,
        query_embedding: list[float],
        top_k: int = 5,
    ):
        if collection.count() == 0:
            return []

        results = self.search(
            query_embedding,
            top_k,
        )

        docs = results["documents"][0]
        metas = results["metadatas"][0]

        output = []

        for doc, meta in zip(docs, metas):
            output.append(
                {
                    "text": doc,
                    "document_id": meta["document_id"],
                    "chunk_id": meta["chunk_id"],
                }
            )

        return output