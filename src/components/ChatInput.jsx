import { useEffect, useRef, useState } from "react";

function ChatInput({
  onSend,
  disabled,
  visionMode,
  onStop,
  document,
  onDocumentUploaded,
  onDocumentRemoved,
}) {
  const [value, setValue] = useState("");
  const [image, setImage] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(document || null);
  const [documentLoading, setDocumentLoading] = useState(false);

  const textareaRef = useRef(null);
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  useEffect(() => {
    setSelectedDocument(document || null);
  }, [document]);

  const handleChange = (event) => {
    setValue(event.target.value);

    const textarea = textareaRef.current;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setImage({
      file,
      previewUrl,
    });
  };

  const handleDocumentChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setDocumentLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("http://localhost:8000/upload-document", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Document upload response:", data);

      if (data.status !== "processed") {
        throw new Error(data.error || "Document processing failed");
      }

      const uploadedDocument = {
        documentId: data.document_id,
        filename: data.filename,
        fileType: data.file_type,
        chunks: data.chunks,
      };

      setSelectedDocument(uploadedDocument);

      onDocumentUploaded(uploadedDocument);
    } catch (error) {
      console.error("Document upload failed:", error);

      alert(error.message || "Failed to upload document.");
    } finally {
      setDocumentLoading(false);

      if (documentInputRef.current) {
        documentInputRef.current.value = "";
      }
    }
  };

  const handleSend = () => {
    if (!value.trim() || disabled || documentLoading) {
      return;
    }

    if (visionMode && !image) {
      return;
    }

    onSend(
      value.trim(),
      image?.file,
      image?.previewUrl,
      selectedDocument?.documentId,
    );

    setValue("");
    setImage(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-container">
      <div className="input-box">
        {visionMode && (
          <div className="image-attachment">
            {image ? (
              <div className="selected-image">
                <img
                  src={image.previewUrl}
                  alt="Selected attachment"
                  className="attachment-thumbnail"
                />

                <div className="attachment-info">
                  <span>{image.file.name}</span>
                </div>

                <button
                  type="button"
                  className="remove-attachment"
                  onClick={() => {
                    URL.revokeObjectURL(image.previewUrl);

                    setImage(null);

                    if (imageInputRef.current) {
                      imageInputRef.current.value = "";
                    }
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="attach-button"
                onClick={() => imageInputRef.current?.click()}
              >
                📎 Attach image
              </button>
            )}

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </div>
        )}

        {!visionMode && (
          <div className="document-attachment">
            {documentLoading ? (
              <div className="selected-document document-uploading">
                <div className="document-spinner" />

                <div className="attachment-info">
                  <strong>Uploading document...</strong>
                  <small>Please wait</small>
                </div>
              </div>
            ) : selectedDocument ? (
              <div className="selected-document">
                <span className="document-icon">📄</span>

                <div className="attachment-info">
                  <span>{selectedDocument.filename}</span>

                  <small>Document ready</small>
                </div>

                <button
                  type="button"
                  className="remove-attachment"
                  onClick={onDocumentRemoved}
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="attach-button"
                disabled={disabled}
                onClick={() => documentInputRef.current?.click()}
              >
                📎 Attach document
              </button>
            )}

            <input
              ref={documentInputRef}
              type="file"
              accept=".pdf,.docx,.xlsx,.pptx"
              onChange={handleDocumentChange}
              disabled={documentLoading}
              hidden
            />
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            visionMode
              ? "Ask something about this image..."
              : selectedDocument
                ? "Ask something about this document..."
                : "Ask anything..."
          }
          rows={1}
          disabled={disabled || documentLoading}
        />

        <div className="input-actions">
          <span className="input-hint">
            Enter to send · Shift + Enter for new line
          </span>

          {disabled ? (
            <button
              type="button"
              className="stop-button"
              onClick={onStop}
              title="Stop generation"
            >
              ■
            </button>
          ) : (
            <button
              type="button"
              className="send-button"
              disabled={
                !value.trim() || documentLoading || (visionMode && !image)
              }
              onClick={handleSend}
            >
              ↑
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
