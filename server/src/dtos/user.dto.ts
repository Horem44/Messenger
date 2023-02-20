export class UserDto {
    public tag: string;
    public id: string;

    constructor(tag: string, id: string){
        this.tag = tag;
        this.id = id;
    }
}