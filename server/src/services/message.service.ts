import { MessageEntity } from "../entities";
import { MessageRepository } from "../repositories/message.repository";

export class MessageService {
  private readonly repository: MessageRepository;

  constructor() {
    this.repository = new MessageRepository();
  }

  public async getAllByConversationIdAsync(id: unknown) {
    const snapshot = await this.repository.getAsync("conversationId", "==", id);

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs.map((doc) => doc.data());
  }

  public async addAsync(
    conversationId: string,
    senderId: string,
    text: string,
    files: { url: string; type: string; name: string }[]
  ) {
    const messageEntity = new MessageEntity(conversationId, senderId, text, files);
    messageEntity.files = messageEntity.files.map(file => Object.assign({}, file));
    const snapshot = await this.repository.addAsync(
      Object.assign(
        {},
        messageEntity
      )
    );

    return (await snapshot.get()).data();
  }

  public async updateById(id: string, value: string) {
    const snapshot = await this.repository.getAsync("id", "==", id);
    return await snapshot.docs[0].ref.update({
      text: value,
    });
  }

  public async deleteById(id: string) {
    const snapshot = await this.repository.getAsync("id", "==", id);
    return await snapshot.docs[0].ref.delete();
  }

  public sortMessagesByDate(messages: MessageEntity[]) {
    messages.sort(
      ({ createdAt: a }, { createdAt: b }) =>
        this.convertToNumber(a) - this.convertToNumber(b)
    );
  }

  private convertToNumber(t: string) {
    return +t.replace(/:/g, "");
  }
}
