class Subject{
    constructor(name, tasks){
        this.tasks = tasks;
        this.name = name;
        this.id = crypto.randomUUID();
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

const subjectTest = new Subject("test", []);