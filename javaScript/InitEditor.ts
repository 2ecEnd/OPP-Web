import { AddTaskButton } from "./AddTaskButton";
import { AddTaskMenu } from "./AddTaskMenu";
import { Canvas } from "./Canvas/Canvas";
import { Subject } from "./Subject";
import { initUser, user } from "./User";

export var canvas: Canvas;
export var addTaskMenu: AddTaskMenu;
export var addTaskButton: AddTaskButton;

document.addEventListener('DOMContentLoaded', async function() {
    if(!user) await initUser();
    if(!user) return;
    
    const activeTab = toolbar.getActiveTab();
    let currentSubject = activeTab.type == "subject" ? await user.subjectsService.getSubjectById(activeTab.id) : new Subject("test", '', undefined, null);

    if (!currentSubject) {
        console.log(`Required subject not found in InitEditor`);
        currentSubject = new Subject("test", '', undefined, null)
    }
    
    canvas = new Canvas(currentSubject);
    addTaskMenu = new AddTaskMenu(canvas);
    addTaskButton = new AddTaskButton(addTaskMenu);
})