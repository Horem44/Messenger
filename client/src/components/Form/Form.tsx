import { Box, Button, FormControl, TextField } from "@mui/material";
import React, { useReducer, useRef } from "react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const tagRegExp = /^[a-z0-9]+$/i;

type Props = {
  type: "login" | "register";
};

interface validationState {
  isEmailValid: boolean;
  isPasswordValid: boolean;
  isTagValid: boolean;
}

const initialValidationState: validationState = {
  isEmailValid: true,
  isPasswordValid: true,
  isTagValid: true,
};

interface action {
  type:
    | "EMAIL_IS_NOT_VALID"
    | "PASSWORD_IS_NOT_VALID"
    | "TAG_IS_NOT_VALID"
    | "EMAIL_IS_VALID"
    | "PASSWORD_IS_VALID"
    | "TAG_IS_VALID";
}

const validationReducer = (state: validationState, action: action) => {
  switch (action.type) {
    case "EMAIL_IS_VALID":
      return { ...state, isEmailValid: true };
    case "PASSWORD_IS_VALID":
      return { ...state, isPasswordValid: true };
    case "TAG_IS_VALID":
      return { ...state, isTagValid: true };
    case "EMAIL_IS_NOT_VALID":
      return { ...state, isEmailValid: false };
    case "PASSWORD_IS_NOT_VALID":
      return { ...state, isPasswordValid: false };
    case "TAG_IS_NOT_VALID":
      return { ...state, isTagValid: false };
    default:
      return state;
  }
};

const Form: React.FC<Props> = ({ type }: Props) => {
  const [validationState, dispatch] = useReducer(
    validationReducer,
    initialValidationState
  );

  const emailInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const isFormValid = (
    email: string,
    password: string,
    tag: string | undefined
  ) => {
    if (email.trim().length === 0 || !emailRegExp.test(email)) {
      dispatch({ type: "EMAIL_IS_NOT_VALID" });
      return false;
    } else {
      dispatch({ type: "EMAIL_IS_VALID" });
    }

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

  const submitHandler = () => {
    const email = emailInputRef.current!.value;
    const password = passwordInputRef.current!.value;
    const tag = tagInputRef.current?.value;

    const isValid = isFormValid(email, password, tag);

    console.log(isValid);
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
          <EmailIcon />
          <TextField
            id="email-input"
            type="email"
            error={!validationState.isEmailValid}
            helperText={!validationState.isEmailValid ? "Incorrect email" : ""}
            label="Email"
            inputRef={emailInputRef}
            sx={{
              width: "80%",
              marginLeft: "1rem",
            }}
          />
        </Box>

        {type === "register" && (
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
        )}

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
