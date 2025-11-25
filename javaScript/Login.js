class Login{
    constructor(){
        this.container = document.getElementById('authentication-form-container');
    }

    toggleVisibility(){
        this.container.classList.toggle('active');
    }
}