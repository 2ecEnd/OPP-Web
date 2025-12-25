export class Tab {
    type;
    id;
    name;
    constructor(type, id, name) {
        this.type = type;
        this.id = id;
        this.name = name;
    }
    copy() {
        return new Tab(this.type, this.id, this.name);
    }
}
//# sourceMappingURL=Tab.js.map