export class Tab {
    public type: string;
    public id: string;
    public name: string;

    constructor(type: string, id: string, name: string) {
        this.type = type;
        this.id = id;
        this.name = name;
    }

    copy(): Tab {
        return new Tab(this.type, this.id, this.name);
    }
}