class AddTaskContextMenu{
    constructor(){
        this.contextMenu = document.getElementById('add-task-context-menu');
        this.closeContextMenuButton = document.getElementById('close-context-menu-button');
        this.form = document.getElementById('add-task-context-menu');
        this.overlay = document.getElementById('overlay');
        this.canvas = canvas;

        this.init();
    }

    init(){
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.closeContextMenuButton.addEventListener('click', this.showSelf.bind(this));
    }

    handleSubmit(event){
        
    }

    showSelf(){
        this.contextMenu.classList.toggle('active');
        this.overlay.classList.toggle('active');
    }
}