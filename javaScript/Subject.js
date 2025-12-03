class Subject{
    constructor(name, tasks){
        this.tasks = tasks;
        this.name = name;
        this.id = crypto.randomUUID();

        this.container = null;
        this.moreVertButton = null;
        this.changeSubjectButton = null;
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


    createDom(){
        const newElement = document.createElement('div');
        newElement.classList.add('contentItem');
        newElement.innerHTML = `
            <div class="miniature"></div>
            <div class="subject-info">
                <p>Название: ${sthis.name}</p>
                <p>Команда: </p>
            </div>
        `
        newElement.setAttribute('data-type', 'subject');
        newElement.setAttribute('data-id', this.id);
    }
}

const subjectTest = new Subject("test", []);