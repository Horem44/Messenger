import { CollectionReference, WhereFilterOp } from ".";
import { Conversation } from "../entities";
import firebase from "firebase/compat";

export class BaseRepository<T> {
  private readonly model;

  constructor(model: CollectionReference<T>) {
    this.model = model;
  }

  public async getAsync(
    field: string,
    predicate: WhereFilterOp,
    value: unknown
  ) {
    return this.model.where(field, predicate, value).get();
  }

  public async addAsync(entity: T) {
    return this.model.add(entity);
  }
}
