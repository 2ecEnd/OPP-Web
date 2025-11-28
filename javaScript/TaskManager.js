class TaskManager{
    constructor(){
        this.tasks = [];
    }

    addTask(task){
        this.tasks.push(task);
    }

    deleteTask(id){
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    getTask(id){
        return this.tasks.find(task => task.id === id);
    }
}

const taskManager = new TaskManager();