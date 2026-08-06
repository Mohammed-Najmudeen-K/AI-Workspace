import { type ChangeEvent, useEffect, useState } from "react";

import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  deleteAllDocuments,
} from "../services/documentService";

function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    void loadDocuments();
  }, []);

  const loadDocuments = async () => {
    const docs = await getDocuments();
    setDocuments(docs);
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "Unknown size";
    const units = ["B", "KB", "MB", "GB"];
    let value = size;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }

    return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  };

  const handleUpload = async (files: FileList | File[]) => {
    if (!files.length) return;

    setUploading(true);
    setUploadMessage("Uploading documents...");

    try {
      const fileArray = Array.from(files);
      await Promise.all(fileArray.map((file) => uploadDocument(file)));
      setUploadMessage(`${fileArray.length} document${fileArray.length > 1 ? "s" : ""} uploaded`);
      await loadDocuments();
    } catch (err) {
      console.error(err);
      setUploadMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    await handleUpload(e.target.files);
    e.target.value = "";
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (!e.dataTransfer.files?.length) return;
    await handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="documents-page">
      <header className="documents-header">
        <div>
          <h2>Knowledge Base</h2>
          <p>Upload documents and manage your library for smarter AI answers.</p>
        </div>
      </header>

      <section
        className={`upload-section ${dragActive ? "upload-section--active" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
      >
        <div className="upload-copy">
          <label className="upload-label" htmlFor="document-upload">
            Drop files here or select documents to upload
          </label>
          <p className="upload-hint">Multiple files are supported.</p>
        </div>

        <input
          id="document-upload"
          type="file"
          multiple
          onChange={onInputChange}
          className="upload-input"
        />

        <div className="upload-actions">
          <button
            type="button"
            className="document-action upload-action"
            onClick={() => document.getElementById("document-upload")?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Choose files"}
          </button>
          <button
            type="button"
            className="document-action"
            onClick={async () => {
              try {
                setUploading(true);
                setUploadMessage("Clearing documents...");
                await deleteAllDocuments();
                await loadDocuments();
                setUploadMessage("Knowledge base cleared");
              } catch (err) {
                console.error(err);
                setUploadMessage("Failed to clear documents.");
              } finally {
                setUploading(false);
              }
            }}
            disabled={uploading || documents.length === 0}
          >
            Clear all
          </button>
        </div>
      </section>

      {uploadMessage && (
        <p className={`upload-status ${uploading ? "upload-status--busy" : ""}`}>
          {uploadMessage}
        </p>
      )}

      <section className="document-list">
        {documents.length === 0 ? (
          <div className="empty-state">
            <h3>No documents yet</h3>
            <p>Upload files to add them to your knowledge base.</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="document-card__main">
                <div className="document-icon" aria-hidden="true">
                  {doc.filename?.toLowerCase().endsWith(".pdf") ? "📄" : doc.filename?.toLowerCase().endsWith(".docx") ? "📝" : doc.filename?.toLowerCase().endsWith(".txt") ? "📃" : "📁"}
                </div>
                <div>
                  <div className="document-name">{doc.filename}</div>
                  <div className="document-meta">
                    <span>{formatFileSize(doc.size || doc.file_size)}</span>
                    <span>•</span>
                    <span>
                      {doc.uploaded_at
                        ? new Date(doc.uploaded_at).toLocaleString()
                        : "Uploaded document"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="document-action"
                onClick={async () => {
                  await deleteDocument(doc.id);
                  await loadDocuments();
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