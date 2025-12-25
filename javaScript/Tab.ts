export class Tab {
    public type: string;
    public id: string | null;
    public name: string | null;

    constructor(type: string, id: string | null, name: string | null) {
        this.type = type;
        this.id = id;
        this.name = name;
    }

    copy(): Tab {
        return new Tab(this.type, this.id, this.name);
    }
}