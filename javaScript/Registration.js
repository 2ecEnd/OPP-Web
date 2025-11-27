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

        const api = 'http://localhost:5000/api/Auth';

        const email = document.getElementById('registrationEmailInput').value;
        const password = document.getElementById('registrationPasswordInput').value;

        try{
            const response = await fetch(`${api}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Email: email,
                    Password: password
                })
            });

            if (response.status === 201) {
                alert('Регистрация успешна');
                this.form.reset();
            } 
            else {
                alert('Ошибка регистрации');
            }
        }
        catch (error){
            console.error('Ошибка:', error);
            alert('Сетевая ошибка');
        }
    }
}
