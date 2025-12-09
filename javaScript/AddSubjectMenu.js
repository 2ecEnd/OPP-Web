class AddSubjectMenu{
    constructor(){
        this.container = document.getElementById('add-subject-menu');
        this.closeMenuButton = document.getElementById('close-subject-menu-button');
        this.form = document.getElementById('add-subject-form');
        this.overlay = document.getElementById('overlay');

        this.type = "";
        this.currentSubject = null;

        this.init();
    }

    init(){
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.closeMenuButton.addEventListener('click', this.closeSelf.bind(this));
    }

    handleSubmit(event){
        event.preventDefault();

        const name = this.form.querySelector('#subjectFormTitleInput').value;
        const submitButton = this.form.querySelector('#subjectFormSubmitButton');

        if(this.type === "create") this.createSubject(name);
        else if(this.type === "edit") this.changeSubject(this.currentSubject, name);

        this.form.reset();
        submitButton.innerHTML = "Добавить";

        this.closeSelf();
    }

    changeSubject(subject, name){
        subject.changeSubject(name);
    }

    fillTheForm(){
        const name = this.form.querySelector('#subjectFormTitleInput');
        const submitButton = this.form.querySelector('#subjectFormSubmitButton');

        name.value = this.currentSubject.name;
        console.log(this.currentSubject)

        submitButton.innerHTML = "Изменить";
    }

    showSelf(type, currentSubject){
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

const addSubjectMenu = new AddSubjectMenu();