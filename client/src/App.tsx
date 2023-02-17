import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Login from "./pages/Login/Login";
import Messenger from "./pages/Messenger/Messenger";
import Register from "./pages/Register/Register";
import { authActions } from "./store/auth-slice";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getAuthentication = async () => {
      const url = "http://localhost:8080/auth/";
      const res = await fetch(url, {
        credentials: 'include',
      });

      if(res.status === 401){
        console.log('No auth');
        navigate('login');
        return;
      }

      const currentUser = await res.json();

      dispatch(authActions.login());
      dispatch(authActions.setCurrentUser({
        id: currentUser.userId,
        tag: currentUser.tag,
      }));

      navigate('messenger');
    };

    getAuthentication();
  }, [dispatch, navigate])

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
