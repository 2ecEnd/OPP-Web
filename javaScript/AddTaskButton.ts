import type { AddTaskMenu } from "./AddTaskMenu.js";
import { DOMService } from "./Services/DOMService.js";

export class AddTaskButton{
    private menu: AddTaskMenu;
    private button: HTMLElement;

    constructor(menu: AddTaskMenu){
        this.button = DOMService.getElementById<HTMLElement>('add-task-button');
        this.menu = menu;

        this.init();
    }

    init(){
        this.button.addEventListener('click', this.openMenu.bind(this));
    }

    openMenu(){
        this.menu.showSelf("create", null);
    }
}