import { User, UserEntity } from "../entities";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<UserEntity> {
  constructor() {
    super(User);
  }
}
