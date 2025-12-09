class Subject{
    constructor(name, tasks){
        this.tasks = tasks;
        this.name = name;
        this.id = crypto.randomUUID();

        this.view = new SubjectView();
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

class SubjectView{
    constructor(model){
        this.model = model;
        this.container = null;
    }

    init(){

    }

    createDom(){
        const newElement = document.createElement('div');
        this.container = newElement;

        newElement.classList.add('contentItem');
        newElement.innerHTML = `
            <div class="miniature"></div>
            <div class="subject-info">
                <p>Название: ${this.model.name}</p>
                <p>Команда: </p>
            </div>
        `
        newElement.setAttribute('data-type', 'subject');
        newElement.setAttribute('data-id', this.model.id);
    }
}

const subjectTest = new Subject("test", []);