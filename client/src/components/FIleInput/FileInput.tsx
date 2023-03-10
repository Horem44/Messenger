import React from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { messageActions } from "../../store/message-slice";
import classes from "./FileInput.module.css";

type Props = {
  onSetFile: (file: File) => void;
};

const FileInput: React.FC<Props> = ({ onSetFile }) => {
  const dispatch = useDispatch();
  const setFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSetFile(e.target.files![0]);
  };

  const isEditing = useSelector<RootState, boolean>(
    (state) => state.message.isEditing
  );

  const finishEditingHandler = () => {
    dispatch(messageActions.finishEditing());
  };

  return (
    <>
      {!isEditing && (
        <label htmlFor="upload-file">
          <input
            className={classes.file_input}
            id="upload-file"
            name="upload-file"
            type="file"
            onChange={setFile}
          />

          <Button component="span" aria-label="add">
            <AttachFileIcon fontSize="medium" />
          </Button>
        </label>
      )}
      {isEditing && (
        <Button
          component="span"
          aria-label="clear"
          onClick={finishEditingHandler}
        >
          <ClearIcon fontSize="medium" />
        </Button>
      )}
    </>
  );
};

export default FileInput;
