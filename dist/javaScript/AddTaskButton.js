import { DOMService } from "./Services/DOMService.js";
export class AddTaskButton {
    menu;
    button;
    constructor(menu) {
        this.button = DOMService.getElementById('add-task-button');
        this.menu = menu;
        this.init();
    }
    init() {
        this.button.addEventListener('click', this.openMenu.bind(this));
    }
    openMenu() {
        this.menu.showSelfToCreate();
    }
}
//# sourceMappingURL=AddTaskButton.js.map