import { UserEntity } from "../entities";
import { UserRepository } from "../repositories";
import * as argon from "argon2";

export class UserService {
  private readonly repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  public async getByMemberIdAsync(memberId: string) {
    const snapshot = await this.repository.getAsync("id", "==", memberId);

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data();
  }

  public async getByTagAsync(tag: string) {
    const snapshot = await this.repository.getAsync("tag", "==", tag);

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data();
  }

  public async getAllByIdsAsync(ids: string[]) {
    const snapshot = await this.repository.getAsync("id", "in", ids);

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs.map((doc) => doc.data());
  }

  public async getAllExceptOneAsync(id: string) {
    const snapshot = await this.repository.getAsync("id", "!=", id);

    return snapshot.docs.map((doc) => doc.data());
  }

  public async addAsync(password: string, tag: string) {
    const hash = await argon.hash(password);
    const snapshot = (
      await this.repository.addAsync(
        Object.assign({}, new UserEntity(hash, tag))
      )
    ).get();

    return (await snapshot).data();
  }
}
