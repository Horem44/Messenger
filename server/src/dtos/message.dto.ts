export class MessageFileDto{
    url: string;
    type: string; 
    name: string;

    constructor(url: string, type: string, name: string){
        this.url = url;
        this.type = type;
        this.name = name;
    }
}
