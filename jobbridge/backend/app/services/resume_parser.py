"""Extract raw text from an uploaded PDF or DOCX resume file."""
import io
from pypdf import PdfReader
from docx import Document


def extract_text_from_file(filename: str, content: bytes) -> str:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(content))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    if lower.endswith(".docx"):
        doc = Document(io.BytesIO(content))
        return "\n".join(p.text for p in doc.paragraphs)
    # Fallback: assume plain text
    return content.decode("utf-8", errors="ignore")
