import { Status } from './Enum/Enums.js';
import { addTaskMenu, canvas } from "./InitEditor.js";
import { user } from "./User.js";
export class TaskView {
    x;
    y;
    container = document.createElement('div');
    model;
    constructor(model) {
        this.x = model.x;
        this.y = model.y;
        this.model = model;
    }
    changeStatusView(status) {
        const indicator = this.container.querySelector('.status-indicator');
        switch (status) {
            case Status.DONE:
                indicator.style.backgroundColor = 'green';
                break;
            case Status.IN_PROGRESS:
                indicator.style.backgroundColor = 'orange';
                break;
            case Status.NOT_ACCEPTED:
                indicator.style.backgroundColor = 'firebrick';
                break;
        }
        this.closeAllMenus();
    }
    changeDataView() {
        this.container.querySelector('.title p').textContent = this.model.title;
        this.container.querySelector('.description p').textContent = this.model.description;
        this.container.querySelector('.dead-line p').textContent =
            `Дедлайн: ${this.model.deadline?.toString().replace('T', ' ')}`;
        this.closeAllMenus();
    }
    openContextMenu() {
        const moreVertButton = this.container.querySelector('.more-vert-button');
        const contextMenu = this.container.querySelector('.task-context-menu');
        const statusMenu = this.container.querySelector('.task-status-menu');
        const responsibleMenu = this.container.querySelector('.task-responsible-menu');
        moreVertButton.classList.toggle('active');
        contextMenu.classList.toggle('active');
        statusMenu.classList.remove('active');
        responsibleMenu.classList.remove('active');
    }
    openStatusMenu() {
        this.closeAllMenus();
        this.openContextMenu();
        const statusMenu = this.container.querySelector('.task-status-menu');
        statusMenu.classList.toggle('active');
    }
    openResponsibleMenu() {
        this.closeAllMenus();
        this.openContextMenu();
        const responsibleMenu = this.container.querySelector('.task-responsible-menu');
        responsibleMenu.classList.toggle('active');
    }
    closeAllMenus() {
        const statusMenu = this.container?.querySelector('.task-status-menu');
        const contextMenu = this.container?.querySelector('.task-context-menu');
        const responsibleMenu = this.container?.querySelector('.task-responsible-menu');
        statusMenu?.classList.remove('active');
        contextMenu?.classList.remove('active');
        responsibleMenu?.classList.remove('active');
        const moreVertButton = this.container?.querySelector('.more-vert-button');
        moreVertButton?.classList.remove('active');
    }
    openEditMenu() {
        addTaskMenu.showSelf("edit", this.model.title, this.model.description, this.model.hasDeadline, this.model.deadline, (title, description, hasDeadline, deadline) => {
            this.model.changeTask(title, description, hasDeadline, deadline);
            this.changeDataView();
        });
    }
    startLinking() {
        this.closeAllMenus();
        canvas.linkController.startLinking(this);
    }
    enableDeletingLinksMode() {
        this.closeAllMenus();
        canvas.linkController.enableDeletingLinksMode(this.model);
    }
    deleteActionHandler(e) {
        this.model.deleteTask();
        this.deleteView();
    }
    createContextMenu() {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'task-context-menu task-menu';
        const actions = [
            { text: 'Изменить', handler: this.openEditMenu.bind(this) },
            { text: 'Удалить', handler: this.deleteActionHandler.bind(this) },
            { text: 'Добавить зависимость', handler: this.startLinking.bind(this) },
            { text: 'Удалить зависимость', handler: this.enableDeletingLinksMode.bind(this) },
            { text: 'Изменить статус', handler: this.openStatusMenu.bind(this) },
            { text: 'Добавить ответственного', handler: this.openResponsibleMenu.bind(this) }
        ];
        actions.forEach(({ text, handler }) => {
            const button = document.createElement('button');
            button.textContent = text;
            if (handler) {
                button.addEventListener('click', handler);
            }
            contextMenu.appendChild(button);
        });
        return contextMenu;
    }
    createStatusMenu() {
        const statuses = [
            { text: 'Выполнено', value: Status.DONE },
            { text: 'В процессе', value: Status.IN_PROGRESS },
            { text: 'Не принято', value: Status.NOT_ACCEPTED }
        ];
        const statusMenu = document.createElement('div');
        statusMenu.classList.add('task-status-menu', 'task-menu');
        statuses.forEach(({ text, value }) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', () => {
                this.model.setStatus(value);
                this.changeStatusView(value);
            });
            statusMenu.appendChild(button);
        });
        return statusMenu;
    }
    createResponsibleMenu() {
        const responsibleMenu = document.createElement('div');
        responsibleMenu.className = 'task-responsible-menu task-menu';
        const currSubject = user.subjects.find(s => s.tasks.find(t => t.id === this.model.id));
        var availablePeople = user.teams.find(t => t.id === currSubject?.teamId)?.members || [];
        const select = document.createElement('select');
        select.className = 'responsible-select';
        select.name = 'select';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Выберите ответственного';
        defaultOption.selected = true;
        select.appendChild(defaultOption);
        availablePeople.forEach(person => {
            const option = document.createElement('option');
            option.value = person.id.toString();
            option.textContent = person.name + ' ' + person.surname;
            option.dataset.personName = person.name;
            select.appendChild(option);
        });
        select.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
        select.addEventListener('change', async (e) => {
            if (select.value) {
                availablePeople = user.teams.find(t => t.id === currSubject?.teamId)?.members || [];
                const selectedOption = select.options[select.selectedIndex];
                const selectedPerson = availablePeople.find(p => p.id.toString() == select.value);
                this.model.addAssignedTask(selectedPerson.id);
                selectedPerson?.addAssignedTask(this.model.id);
                const assignedPersonBlock = this.container.querySelector('.assigned-person p');
                if (assignedPersonBlock) {
                    var assigned = assignedPersonBlock.textContent.substring(15).split(", ");
                    const personName = `${selectedPerson.name} ${selectedPerson.surname}`;
                    const personIndex = assigned.indexOf(personName);
                    if (personIndex !== -1) {
                        assigned.splice(personIndex, 1);
                    }
                    else {
                        assigned.push(personName);
                    }
                    assignedPersonBlock.textContent = `Ответственный: ${assigned.join(", ")}`;
                }
                await user.makeChange();
            }
        });
        responsibleMenu.appendChild(select);
        return responsibleMenu;
    }
    createDom() {
        const newTask = document.createElement('div');
        this.container = newTask;
        const currSubject = user.subjects.find(s => s.tasks.find(t => t.id === this.model.id));
        var availablePeople = user.teams.find(t => t.id === currSubject?.teamId)?.members || [];
        var assigned = [];
        for (var i = 0; i < availablePeople.length; i++) {
            if (this.model.assignedTasks.includes(availablePeople[i].id)) {
                assigned.push(availablePeople[i].name + " " + availablePeople[i].surname);
            }
        }
        newTask.className = 'draggable task';
        newTask.id = this.model.id;
        newTask.innerHTML = `
            <div class="status-indicator"></div>
            <div class="title task-block">
                <p>${this.model.title}</p>
            </div>
            <div class="description task-block">
                <p>${this.model.description}</p>
            </div>
            <div class="create-time task-block">
                <p>Дата добавления: ${this.model.currentDate.toLocaleString('ru-RU')}</p>
            </div>
            <div class="assigned-person task-block">
                <p>Ответственный: ${"" + assigned.join(", ")}
                </p>
            </div>
            <div class="dead-line task-block">
                <p>Дедлайн: ${this.model.deadline == null ? "отсутствует" : this.model.deadline.toLocaleString('ru-RU')}</p>
            </div>
            <div class="more-vert-button">
                <img src="images/More vertical.svg" alt="">
            </div>
        `;
        newTask.appendChild(this.createContextMenu());
        newTask.appendChild(this.createStatusMenu());
        newTask.appendChild(this.createResponsibleMenu());
        newTask.querySelector('.more-vert-button').addEventListener('click', this.openContextMenu.bind(this));
        this.container.style.transform = `
            translate(${this.x}px, ${this.y}px)
        `;
        this.container.dataset.x = this.x.toString();
        this.container.dataset.y = this.y.toString();
        this.changeStatusView(this.model.status);
        console.log(this.model.status);
        return newTask;
    }
    deleteView() {
        this.container.remove();
        canvas.subject.deleteTask(this.model.id);
    }
}
//# sourceMappingURL=TaskView.js.map