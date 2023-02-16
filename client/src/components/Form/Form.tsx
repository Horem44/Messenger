import { Box, Button, FormControl, TextField } from "@mui/material";
import React, { useReducer, useRef } from "react";
import LockIcon from "@mui/icons-material/Lock";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";

const tagRegExp = /^[a-z0-9]+$/i;

type Props = {
  type: "login" | "register";
};

interface validationState {
  isPasswordValid: boolean;
  isTagValid: boolean;
}

const initialValidationState: validationState = {
  isPasswordValid: true,
  isTagValid: true,
};

interface action {
  type:
    | "PASSWORD_IS_NOT_VALID"
    | "TAG_IS_NOT_VALID"
    | "PASSWORD_IS_VALID"
    | "TAG_IS_VALID";
}

const validationReducer = (state: validationState, action: action) => {
  switch (action.type) {
    case "PASSWORD_IS_VALID":
      return { ...state, isPasswordValid: true };
    case "TAG_IS_VALID":
      return { ...state, isTagValid: true };

    case "PASSWORD_IS_NOT_VALID":
      return { ...state, isPasswordValid: false };
    case "TAG_IS_NOT_VALID":
      return { ...state, isTagValid: false };
    default:
      return state;
  }
};

const Form: React.FC<Props> = ({ type }: Props) => {
  const dispatchAuth = useDispatch();
  const navigate = useNavigate();
  const [validationState, dispatch] = useReducer(
    validationReducer,
    initialValidationState
  );

  const tagInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const isFormValid = (password: string, tag: string | undefined) => {
    if (password.trim().length === 0 || password.length < 6) {
      dispatch({ type: "PASSWORD_IS_NOT_VALID" });
      return false;
    } else {
      dispatch({ type: "PASSWORD_IS_VALID" });
    }

    if (tag === undefined) {
      return true;
    }

    if (tag!.trim().length === 0 || !tagRegExp.test(tag!)) {
      dispatch({ type: "TAG_IS_NOT_VALID" });
      return false;
    } else {
      dispatch({ type: "TAG_IS_VALID" });
    }

    return true;
  };

  const submitHandler = async () => {
    const password = passwordInputRef.current!.value;
    const tag = tagInputRef.current?.value;

    const isValid = isFormValid(password, tag);

    if (!isValid) {
      return;
    }

    const path = type === "login" ? "login" : "register";

    const url = "http://localhost:8080/user/" + path;

    const userData = {
      tag,
      password,
    };

    try {
      const res = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (res.status !== 200) {
        const error = await res.json();
        console.log(error);
        throw new Error(error.message);
      }

      dispatchAuth(authActions.login());
      navigate("/messenger");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <FormControl
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "0",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid rgb(24,118,209)",
          borderRadius: "12px",
          padding: "4vw",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "4rem",
          }}
        >
          <AlternateEmailIcon />
          <TextField
            id="tag-input"
            type="text"
            label="Tag"
            error={!validationState.isTagValid}
            inputRef={tagInputRef}
            helperText={
              !validationState.isTagValid
                ? "Only letters and numbers allowed"
                : ""
            }
            sx={{
              width: "80%",
              marginLeft: "1rem",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "4rem",
          }}
        >
          <LockIcon />
          <TextField
            id="psw-input"
            type="password"
            label="Password"
            inputRef={passwordInputRef}
            error={!validationState.isPasswordValid}
            helperText={
              !validationState.isPasswordValid
                ? "Must be greater than 6 symbols"
                : ""
            }
            sx={{
              width: "80%",
              marginLeft: "1rem",
            }}
          />
        </Box>

        <Button onClick={submitHandler}>
          {type === "login" ? "Login" : "Register"}
        </Button>
      </FormControl>
    </Box>
  );
};

export default Form;
