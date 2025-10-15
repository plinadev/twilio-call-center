import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import apiClient from "./config/apiClient";

function App() {
  const handleLogin = async ({
    name,
    phone,
  }: {
    name: string;
    phone: string;
  }) => {
    await apiClient.post("/login", {
      to: phone,
      username: name,
    });
  };
  const handleVerify = async ({
    phone,
    code,
  }: {
    phone: string;
    code: string;
  }) => {
    await apiClient.post(`/verify?code=${code}`, {
      to: phone,
    });
  };
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={<Login onSubmit={handleLogin} onVerifyCode={handleVerify} />}
        />
      </Routes>
      ;
    </BrowserRouter>
  );
}

export default App;
