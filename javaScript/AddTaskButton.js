class AddTaskButton{
    constructor(){
        this.button = document.getElementById('add-task-button');
        this.contextMenu = null;

        this.init();
    }

    init(){
        this.button.addEventListener('click', this.openContextMenu.bind(this));
        this.contextMenu = new AddTaskContextMenu();
    }

    openContextMenu(){
        this.contextMenu.showSelf();
    }
}

const addTaskButton = new AddTaskButton();