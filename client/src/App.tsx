import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Login from "./pages/Login/Login";
import Messenger from "./pages/Messenger/Messenger";
import Register from "./pages/Register/Register";
import { authActions } from "./store/auth-slice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "./store";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector<RootState, boolean>((state) => state.auth.isAuth);
  const location = useLocation();

  useEffect(() => {
    const getAuthentication = async () => {
      if (
        location.pathname === "/register" ||
        location.pathname === "/login" ||
        location.pathname === "/"
      ) {
        return;
      }

      const url = "http://localhost:8080/auth/";
      const res = await fetch(url, {
        credentials: "include",
      });

      if (res.status === 401) {
        navigate("login");
        return;
      }

      const currentUser = await res.json();

      dispatch(authActions.login());
      dispatch(
        authActions.setCurrentUser({
          id: currentUser.userId,
          tag: currentUser.tag,
        })
      );

      navigate("messenger");
    };

    getAuthentication();
  }, []);

  return (
    <>
      <div className="App">
        <Header />
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {isAuth && <Route path="messenger" element={<Messenger />} />}
          {isAuth && <Route path="*" element={<Messenger />} />}
          {!isAuth && <Route path="*" element={<Login />} />}
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
    </>
  );
}

export default App;
