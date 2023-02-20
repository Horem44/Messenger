import { Message, MessageEntity } from "../entities";
import { BaseRepository } from "./base.repository";

export class MessageRepository extends BaseRepository<MessageEntity> {
  constructor() {
    super(Message);
  }
}
