export class UserDto {
    tag: string;
    password: string;

    constructor(tag: string, password: string){
        this.tag = tag;
        this.password = password;
    }
}