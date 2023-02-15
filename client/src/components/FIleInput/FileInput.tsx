import React from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { messageActions } from "../../store/message-slice";

type Props = {
  onSetFile: (file: File) => void;
};

const FileInput: React.FC<Props> = ({ onSetFile }) => {
  const dispatch = useDispatch();
  const setFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
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
        <label htmlFor="upload-photo">
          <input
            style={{ display: "none" }}
            id="upload-photo"
            name="upload-photo"
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
