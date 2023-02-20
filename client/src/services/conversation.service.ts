import { ApiClient } from "./api.client";

export class ConversationService {
  private readonly apiClient: ApiClient = new ApiClient();
  private readonly conversationUrlPart = "conversation/";

  public getAll(){
    return this.apiClient.get(this.conversationUrlPart + "all");
  }

  public create(id: string){
    return this.apiClient.post(this.conversationUrlPart + "new", {
        id: id,
    })
  }
}