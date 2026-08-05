import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ChatPage from "./pages/ChatPage";
import DocumentsPage from "./pages/DocumentsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
