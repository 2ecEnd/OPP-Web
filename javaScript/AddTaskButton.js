class AddTaskButton{
    constructor(){
        this.button = document.getElementById('add-task-button');

        this.init();
    }

    init(){
        this.button.addEventListener('click', this.openContextMenu.bind(this))
    }

    openContextMenu(){
        
    }
}

const addTaskButton = new AddTaskButton();