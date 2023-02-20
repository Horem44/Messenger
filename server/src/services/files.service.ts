import { storage } from "../../configs";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { MessageFileDto } from "../dtos/message.dto";

interface FirebaseMetadata {
  contentType: string;
}

export class FileService {
  public async uploadFilesAsync(files: Express.Multer.File[]) {
    const imagePromises = Array.from(files, (file) => this.uploadFileAsync(file));

    return await Promise.all(imagePromises);
  }

  private async uploadFileAsync(file: Express.Multer.File) {
    const storageRef = ref(storage, `files/${file!.originalname}`);

    const metadata: FirebaseMetadata = {
      contentType: file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );

    const url = await getDownloadURL(snapshot.ref);

    return new MessageFileDto(url, file.mimetype, file.originalname);
  }
}
