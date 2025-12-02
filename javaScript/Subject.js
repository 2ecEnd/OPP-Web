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
        const taskToDelete = this.tasks.find(task => task.id === id);
        canvas.links.forEach(link => {
            if (link.startTask === taskToDelete || link.endTask === taskToDelete){
                link.line.remove();
            }
        });

        canvas.links = canvas.links.filter(link => 
            link.startTask !== taskToDelete && link.endTask !== taskToDelete
        );

        this.tasks = this.tasks.filter(task => task.id !== id);

        this.tasks.forEach(task => {
            task.dependsOn.filter(t => t.id !== taskToDelete.id);
        });
    }

    getTask(id){
        return this.tasks.find(task => task.id === id);
    }
}

const subjectTest = new Subject("test", []);