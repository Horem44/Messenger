import React from 'react'
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Button } from "@mui/material";

type Props = {}

function FileInput() {
  return (
    <label htmlFor="upload-photo">
        <input
          style={{ display: "none" }}
          id="upload-photo"
          name="upload-photo"
          type="file"
        />

        <Button component="span" aria-label="add">
          <AttachFileIcon fontSize='medium'/>
        </Button>
      </label>
  )
}

export default FileInput