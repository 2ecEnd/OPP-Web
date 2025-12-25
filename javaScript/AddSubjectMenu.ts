import type { Subject } from "./Subject"

class AddSubjectMenu{
    private container: HTMLElement
    private closeMenuButton: HTMLElement
    private form: HTMLFormElement
    private overlay: HTMLElement
    private type: string
    private currentSubject: Subject | null
    constructor(){
        this.container = document.getElementById('add-subject-menu')!;
        this.closeMenuButton = document.getElementById('close-subject-menu-button')!;
        this.form = document.getElementById('add-subject-form')! as HTMLFormElement;
        this.overlay = document.getElementById('overlay')!;

        this.type = "";
        this.currentSubject = null;

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
        if(this.type === "edit" && this.currentSubject) this.changeSubject(this.currentSubject, name);

        this.form.reset();
        submitButton.innerHTML = "Добавить";

        this.closeSelf();
    }

    changeSubject(subject: Subject, name: string){
        subject.changeSubject(name);
    }

    fillTheForm(){
        const name = this.form.querySelector('#subjectFormTitleInput')! as HTMLInputElement;
        const submitButton = this.form.querySelector('#subjectFormSubmitButton')!;

        name.value = this.currentSubject?.name ?? "";
        console.log(this.currentSubject)

        submitButton.innerHTML = "Изменить";
    }

    showSelf(type: string, currentSubject: Subject){
        this.container.classList.add('active');
        this.overlay.classList.add('active');

        this.type = type;
        this.currentSubject = currentSubject;

        if(this.type === "edit") this.fillTheForm();
    }

    closeSelf(){
        this.container.classList.remove('active');
        this.overlay.classList.remove('active');
    }
}

export const addSubjectMenu = new AddSubjectMenu();