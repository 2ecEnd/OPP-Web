class Registration{
    constructor(){
        this.container = document.getElementById('registration-form-container');
        this.form = document.getElementById('registration-form');

        this.init();
    }

    init(){
        this.form.addEventListener('submit', this.register.bind(this));
    }

    toggleVisibility(){
        this.container.classList.toggle('active');
    }

    async register(e){
        e.preventDefault();

        const email = document.getElementById('registrationEmailInput').value;
        const password = document.getElementById('registrationPasswordInput').value;

        if(await apiService.register(email, password)) this.form.reset();
    }
}
