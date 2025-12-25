import { addSubjectMenu } from "./AddSubjectMenu.js";
export class SubjectView {
    model;
    container;
    constructor(model) {
        this.model = model;
        this.container = document.createElement('div');
        this.createView();
    }
    deleteActionHandler(e) {
        e.stopPropagation();
        this.model.deleteSubject();
        this.container.remove();
    }
    openContextMenu(e) {
        e.stopPropagation();
        const moreVertButton = this.container.querySelector('.more-vert-button');
        const contextMenu = this.container.querySelector('.subject-context-menu');
        moreVertButton.classList.toggle('active');
        contextMenu.classList.toggle('active');
    }
    openEditMenu(e) {
        e.stopPropagation();
        addSubjectMenu.showSelf("edit", this.model.name, (newName) => { this.updateView(newName); });
    }
    createContextMenu() {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'subject-context-menu subject-menu';
        const actions = [
            { text: 'Изменить', handler: this.openEditMenu.bind(this) },
            { text: 'Удалить', handler: this.deleteActionHandler.bind(this) }
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
    createView() {
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
        `;
        newElement.setAttribute('data-type', 'subject');
        newElement.setAttribute('data-id', this.model.id);
        newElement.appendChild(this.createContextMenu());
        newElement.querySelector('.more-vert-button').addEventListener('click', this.openContextMenu.bind(this));
    }
    updateView(newName) {
        this.model.changeSubject(newName);
        this.container.querySelector('.subject-info').children[0].textContent = newName;
    }
}
//# sourceMappingURL=SubjectView.js.map