import { type ChangeEvent, useEffect, useState } from "react";

import {
  getDocuments,
  uploadDocument,
  deleteDocument,
} from "../services/documentService";

function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    const docs = await getDocuments();
    setDocuments(docs);
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    await uploadDocument(e.target.files[0]);
    loadDocuments();
  };

  return (
    <div className="documents-page">
      <header className="documents-header">
        <div>
          <h2>Knowledge Base</h2>
          <p>Upload documents and manage your library for smarter AI answers.</p>
        </div>
      </header>

      <section className="upload-section">
        <label className="upload-label" htmlFor="document-upload">
          Select a document to upload
        </label>
        <input
          id="document-upload"
          type="file"
          onChange={handleUpload}
          className="upload-input"
        />
      </section>

      <section className="document-list">
        {documents.length === 0 ? (
          <div className="empty-state">
            <h3>No documents yet</h3>
            <p>Upload files to add them to your knowledge base.</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="document-card">
              <div>
                <div className="document-name">{doc.filename}</div>
                <div className="document-meta">
                  {doc.uploaded_at
                    ? new Date(doc.uploaded_at).toLocaleString()
                    : "Uploaded document"}
                </div>
              </div>

              <button
                className="document-action"
                onClick={async () => {
                  await deleteDocument(doc.id);
                  loadDocuments();
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default DocumentsPage;