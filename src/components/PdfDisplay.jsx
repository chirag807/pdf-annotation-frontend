import "../styles/pdf-display.css";

function PdfDisplay({ document }) {
  return (
    <div className="pdf-display">
      <div className="pdf-header flex gap-2">
        📚
        <h2 className="underline underline-offset-4">{document.title}</h2>
      </div>
      <div className="pdf-content">
        <iframe
          src={`/api/documents/${document._id}/file`}
          title={document.title}
          className="pdf-iframe"
        />
      </div>
    </div>
  );
}

export default PdfDisplay;
