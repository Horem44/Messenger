export class MessengerService {
  public createFormData(
    currentConversation: string,
    message: string,
    files: File[]
  ) {
    const formData = new FormData();

    formData.append("id", currentConversation);
    formData.append("text", message);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    return formData;
  }
}
