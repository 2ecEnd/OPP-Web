import { AddTaskButton } from "./AddTaskButton";
import { AddTaskMenu } from "./AddTaskMenu";
import { Canvas } from "./Canvas/Canvas";
import { initUser, user } from "./User";

export var canvas: Canvas | null = null;
export var addTaskMenu: AddTaskMenu | null = null;
export var addTaskButton: AddTaskButton | null = null;

document.addEventListener('DOMContentLoaded', async function() {
    if(!user) await initUser();
    if(!user) return;
    
    const activeTab = toolbar.getActiveTab();
    const currentSubject = activeTab.type == "subject" ? await user.getSubjectById(activeTab.id) : new Subject("test", [], null, null);
    
    canvas = new Canvas(currentSubject);
    addTaskMenu = new AddTaskMenu(canvas);
    addTaskButton = new AddTaskButton(addTaskMenu);
})