import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import CallCenter from "./components/CallCenter";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<CallCenter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
