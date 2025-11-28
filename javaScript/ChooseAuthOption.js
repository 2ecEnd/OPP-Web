class ChooseAuthOption{
    constructor(){
        this.container = document.getElementById('option-choice-container');
        this.loginOption = document.getElementById('option-authentication');
        this.registerOption = document.getElementById('option-registration');

        this.init();
    }
    
    init(){
        this.loginOption.addEventListener('click', this.openLoginMenu.bind(this));
        this.registerOption.addEventListener('click', this.openRegisterMenu.bind(this));

        this.registrationMenu = new Registration();
        this.loginMenu = new Login();
    }

    openLoginMenu(){
        this.toggleVisibility();
        this.loginMenu.toggleVisibility();
    }

    openRegisterMenu(){
        this.toggleVisibility();
        this.registrationMenu.toggleVisibility();
    }

    toggleVisibility(){
        this.container.classList.toggle('active');
    }
}

const chooseAuthOption = new ChooseAuthOption();