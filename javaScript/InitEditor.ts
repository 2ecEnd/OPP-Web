import { AddTaskButton } from "./AddTaskButton.js";
import { AddTaskMenu } from "./AddTaskMenu.js";
import { Canvas } from "./Canvas/Canvas.js";
import { Subject } from "./Subject.js";
import { ToolBar } from "./ToolBar.js";
import { initUser, user } from "./User.js";

export var canvas: Canvas;
export var addTaskMenu: AddTaskMenu;
export var addTaskButton: AddTaskButton;

document.addEventListener('DOMContentLoaded', async function() {
    if(!user) await initUser();
    if(!user) return;
    
    const activeTab = new ToolBar().getActiveTab();
    let currentSubject = activeTab?.type == "subject" ? await user.subjectsService.getSubjectById(activeTab!.id!) : new Subject("test", '', undefined, null);

    if (!currentSubject) {
        console.log(`Required subject not found in InitEditor`);
        currentSubject = new Subject("test", '', undefined, null)
    }
    
    canvas = new Canvas(currentSubject);
    addTaskMenu = new AddTaskMenu(canvas);
    addTaskButton = new AddTaskButton(addTaskMenu);
})