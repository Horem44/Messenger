import { ConversationEntity } from "../entities";
import { ConversationRepository, WhereFilterOp } from "../repositories";

export class ConversationService {
  private readonly repository: ConversationRepository;

  constructor() {
    this.repository = new ConversationRepository();
  }

  public async getByMembersAsync(members: unknown) {
    const snapshot = await this.repository.getAsync("members", "==", members);

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data();
  }

  public async getAllByUserIdAsync(userId: unknown) {
    const snapshot = await this.repository.getAsync(
      "members",
      "array-contains",
      userId
    );

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs.map((doc) => doc.data());
  }

  public async addAsync(members: string[]) {
    const snapshot = (
      await this.repository.addAsync(
        Object.assign({}, new ConversationEntity(members))
      )
    ).get();
    return (await snapshot).data();
  }
}
