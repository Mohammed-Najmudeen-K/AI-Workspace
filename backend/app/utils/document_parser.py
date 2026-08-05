import fitz
from docx import Document


class DocumentParser:

    @staticmethod
    def extract_text(file_path: str):

        if file_path.endswith(".pdf"):
            return DocumentParser._extract_pdf(file_path)

        if file_path.endswith(".docx"):
            return DocumentParser._extract_docx(file_path)

        if file_path.endswith(".txt"):
            return DocumentParser._extract_txt(file_path)

        raise Exception("Unsupported file")

    @staticmethod
    def _extract_pdf(file_path):

        doc = fitz.open(file_path)

        text = ""

        for page in doc:
            text += page.get_text()

        return text

    @staticmethod
    def _extract_docx(file_path):

        doc = Document(file_path)

        return "\n".join(
            paragraph.text
            for paragraph in doc.paragraphs
        )

    @staticmethod
    def _extract_txt(file_path):

        with open(
            file_path,
            "r",
            encoding="utf-8",
        ) as f:
            return f.read()