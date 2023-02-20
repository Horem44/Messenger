import { WhereFilterOp } from ".";
import { Conversation, ConversationEntity } from "../entities";
import { BaseRepository } from "./base.repository";

export class ConversationRepository extends BaseRepository<ConversationEntity> {
  constructor() {
    super(Conversation);
  }
}
