class AddSubjectMenu{
    private container: HTMLElement
    private closeMenuButton: HTMLElement
    private form: HTMLFormElement
    private overlay: HTMLElement
    private type: string
    private currentName: string | null
    private changeSubjectAction: (newName: string) => void
    constructor(){
        this.container = document.getElementById('add-subject-menu')!;
        this.closeMenuButton = document.getElementById('close-subject-menu-button')!;
        this.form = document.getElementById('add-subject-form')! as HTMLFormElement;
        this.overlay = document.getElementById('overlay')!;

        this.type = "";
        this.currentName = null;
        this.changeSubjectAction = () => {};

        this.init();
    }

    init(){
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.closeMenuButton.addEventListener('click', this.closeSelf.bind(this));
    }

    handleSubmit(event: Event){
        event.preventDefault();

        const name = (this.form.querySelector('#subjectFormTitleInput')! as HTMLInputElement ).value;
        const submitButton = this.form.querySelector('#subjectFormSubmitButton')!;

        //if(this.type === "create") this.createSubject(name);
        if(this.type === "edit") this.changeSubject(name);

        this.form.reset();
        submitButton.innerHTML = "Добавить";

        this.closeSelf();
    }

    changeSubject(name: string){
        this.changeSubjectAction(name);
    }

    fillTheForm(){
        const name = this.form.querySelector('#subjectFormTitleInput')! as HTMLInputElement;
        const submitButton = this.form.querySelector('#subjectFormSubmitButton')!;

        name.value = this.currentName ?? "";
        console.log(this.currentName)

        submitButton.innerHTML = "Изменить";
    }

    showSelf(type: string, currentName: string, changeSubjectAction: (newName: string) => void){
        this.container.classList.add('active');
        this.overlay.classList.add('active');

        this.type = type;
        this.currentName = currentName;
        this.changeSubjectAction = changeSubjectAction;

        if(this.type === "edit") this.fillTheForm();
    }

    closeSelf(){
        this.container.classList.remove('active');
        this.overlay.classList.remove('active');
    }
}

export const addSubjectMenu = new AddSubjectMenu();