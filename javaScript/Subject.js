class Subject{
    constructor(name, tasks, id, teamId){
        this.tasks = tasks;
        this.name = name;
        this.id = id? id : crypto.randomUUID();
        this.teamId = teamId;

        this.view = new SubjectView(this);
    }

    changeData(){
        user.changeSubjectData(this.id, this);
    }

    addTask(task){
        this.tasks.push(task);
        this.changeData();
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

        user.changeSubjectData(this.id, this);
    }

    changeSubject(newName){
        user.changeSubject(this.id, newName);
        this.name = newName;
        this.view.updateView();
    }

    deleteSubject(e){
        e.stopPropagation();

        this.view.container.remove();
        user.removeSubject(this.id);
    }

    getTask(id){
        return this.tasks.find(task => task.id === id);
    }

    getView(){
        return this.view;
    }
}

class SubjectView{
    constructor(model){
        this.model = model;
        this.container = null;

        this.createView();
    }

    openContextMenu(e) {
        e.stopPropagation();

        const moreVertButton = this.container.querySelector('.more-vert-button');
        const contextMenu = this.container.querySelector('.subject-context-menu');
        
        moreVertButton.classList.toggle('active');
        contextMenu.classList.toggle('active');
    }

    openEditMenu(e){
        e.stopPropagation();

        addSubjectMenu.showSelf("edit", this.model);
    }

    createContextMenu() {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'subject-context-menu subject-menu';
        
        const actions = [
            { text: 'Изменить', handler: this.openEditMenu.bind(this) },
            { text: 'Удалить', handler: this.model.deleteSubject.bind(this.model) }
        ];

        actions.forEach(({ text, handler}) => {
            const button = document.createElement('button');
            button.textContent = text;
            
            if (handler) {
                button.addEventListener('click', handler);
            }
            
            contextMenu.appendChild(button);
        });

        return contextMenu;
    }

    createView(){
        const newElement = document.createElement('div');
        this.container = newElement;

        newElement.classList.add('contentItem');
        newElement.classList.add('subjectItem');
        newElement.innerHTML = `
            <div class="miniature"></div>
            <div class="subject-info">
                <p>Название: ${this.model.name}</p>
                <p>Команда: </p>
            </div>
            <div class="more-vert-button">
                <img src="../images/More vertical.svg" alt="">
            </div>
        `
        newElement.setAttribute('data-type', 'subject');
        newElement.setAttribute('data-id', this.model.id);

        newElement.appendChild(this.createContextMenu());

        newElement.querySelector('.more-vert-button').addEventListener('click', 
            this.openContextMenu.bind(this));
    }

    updateView(){
        this.container.querySelector('.subject-info').children[0].textContent = this.model.name;
    }
}

const subjectTest = new Subject("test", [], null, null);