import chromadb

client = chromadb.PersistentClient(
    path="app/chroma_db"
)

collection = client.get_collection("documents")

print("Collection count:", collection.count())

print(collection.peek())