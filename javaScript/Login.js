class Login{
    constructor(){
        this.container = document.getElementById('authentication-form-container');
        this.form = document.getElementById('authentication-form');

        this.init();
    }

    init(){
        this.form.addEventListener('submit', this.login.bind(this));
    }

    toggleVisibility(){
        this.container.classList.toggle('active');
    }

    async login(e){
        e.preventDefault();

        const email = document.getElementById('authenticationEmailInput').value;
        const password = document.getElementById('authenticationPasswordInput').value;

        if(await apiService.login(email, password)) this.form.reset();
    }
}