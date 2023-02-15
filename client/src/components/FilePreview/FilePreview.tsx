import React from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Box } from "@mui/material";
import classes from "./FilePreview.module.css";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  files: File[];
  onDeleteFile: (file: File) => void;
};

const allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];

const FilePreview: React.FC<Props> = ({ files, onDeleteFile }: Props) => {
  return (
    <Box
      sx={{
        height: "90px",
        padding: "5px",
        display: "flex",
        alignItems: "center",
        background: "transparent",
        overflowY: "scroll",
      }}
    >
      {files.map((file) => {
        if (allowedFileTypes.includes(file.type)) {
          const imgUrl = URL.createObjectURL(file);
          return (
            <div className={classes.preview_container}>
              <button
                className={classes.preview_close_btn}
                onClick={onDeleteFile.bind(this, file)}
              >
                <CloseIcon color="primary" />
              </button>
              <img
                className={classes.preview_img}
                key={Math.random()}
                src={imgUrl}
                alt="Selected img"
              />
            </div>
          );
        } else {
          return (
            <div className={classes.preview_container}>
              <button
                className={classes.preview_close_btn_file}
                onClick={onDeleteFile.bind(this, file)}
              >
                <CloseIcon color="primary" />
              </button>
              <InsertDriveFileIcon
                sx={{
                  marginRight: "1rem",
                }}
                fontSize="medium"
              />
              <span
                style={{
                  marginRight: "1rem",
                }}
              >
                {file.name}
              </span>
            </div>
          );
        }
      })}
    </Box>
  );
};

export default FilePreview;
