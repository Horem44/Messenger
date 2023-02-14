import React from 'react'
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Button } from "@mui/material";

type Props = {
  onSetFile: (file: File) => void; 
}

const FileInput:React.FC<Props> = ({onSetFile}) => {
  const setFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    onSetFile(e.target.files![0]);
  }

  return (
    <label htmlFor="upload-photo">
        <input
          style={{ display: "none" }}
          id="upload-photo"
          name="upload-photo"
          type="file"
          onChange={setFile}
        />

        <Button component="span" aria-label="add">
          <AttachFileIcon fontSize='medium'/>
        </Button>
      </label>
  )
}

export default FileInput