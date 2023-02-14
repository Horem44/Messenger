import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Login from "./pages/Login/Login";
import Messenger from "./pages/Messenger/Messenger";
import Register from "./pages/Register/Register";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="messenger" element={<Messenger />} />
      </Routes>
    </div>
  );
}

export default App;
