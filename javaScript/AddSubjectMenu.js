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
        const teamId = this.form.querySelector('#subjectFormTeamInput').value;
        const submitButton = this.form.querySelector('#subjectFormSubmitButton');

        if(this.type === "create") this.createSubject(name);
        else if(this.type === "edit") this.changeSubject(this.currentSubject, name, teamId);

        this.form.reset();
        submitButton.innerHTML = "Добавить";

        this.closeSelf();
    }

    changeSubject(subject, name, teamId){
        subject.changeSubject(name, teamId);
    }

    fillTheForm(){
        const name = this.form.querySelector('#subjectFormTitleInput');
        const submitButton = this.form.querySelector('#subjectFormSubmitButton');

        name.value = this.currentSubject.name;

        submitButton.innerHTML = "Изменить";
    }

    async showSelf(type, currentSubject){
        this.container.classList.add('active');
        this.overlay.classList.add('active');

        this.type = type;
        this.currentSubject = currentSubject;

        if(this.type === "edit") this.fillTheForm();

        if(user == null) await initUser();
        const teams = await user.getTeams();
        const select = this.form.querySelector('#subjectFormTeamInput');
        select.innerHTML = `<option value="">Выберите команду</option>`;

        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            select.appendChild(option);
        });
    }

    closeSelf(){
        this.container.classList.remove('active');
        this.overlay.classList.remove('active');
    }
}

const addSubjectMenu = new AddSubjectMenu();