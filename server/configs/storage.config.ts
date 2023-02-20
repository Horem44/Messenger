import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
  } from "firebase/storage";

export const storage = getStorage();