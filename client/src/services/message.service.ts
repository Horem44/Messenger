import { ApiClient } from "./api.client";

export class MessageService {
  private readonly apiClient: ApiClient = new ApiClient();
  private readonly conversationUrlPart = "message/";

  public getAllByConversationId(id: string) {
    return this.apiClient.get(this.conversationUrlPart + id);
  }

  public send(messageData: any) {
    return this.apiClient.postFormData(this.conversationUrlPart + "send", messageData);
  }

  public update(messageId: string, text: string) {
    return this.apiClient.post(this.conversationUrlPart + "update", {
      messageId,
      text,
    });
  }

  public delete(messageId: string) {
    return this.apiClient.delete(this.conversationUrlPart + messageId);
  }
}
