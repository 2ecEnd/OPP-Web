document.addEventListener('DOMContentLoaded', async function() {
    if(!user) await initUser();

    const activeTab = toolbar.getActiveTab();
    const currentSubject = activeTab.type == "subject" ? await user.getSubjectById(activeTab.id) : new Subject("test", [], null, null);
    
    console.log(await user.getSubjectById(activeTab.id));
    canvas = new Canvas(currentSubject);
    addTaskMenu = new AddTaskMenu();
    addTaskButton = new AddTaskButton();
})