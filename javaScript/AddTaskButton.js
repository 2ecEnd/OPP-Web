class AddTaskButton{
    constructor(){
        this.button = document.getElementById('add-task-button');
        this.menu = null;

        this.init();
    }

    init(){
        this.button.addEventListener('click', this.openMenu.bind(this));
        this.menu = addTaskMenu;
    }

    openMenu(){
        this.menu.showSelf("create", null);
    }
}

var addTaskButton = null;