export class DateService {
  public static getTime() {
    const date = new Date();
    return date.toTimeString().split(" ")[0];
  }
}
