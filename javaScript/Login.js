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

        const api = 'http://localhost:5000/api/Auth';

        const email = document.getElementById('authenticationEmailInput').value;
        const password = document.getElementById('authenticationPasswordInput').value;

        try{
            const response = await fetch(`${api}/login`, {
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
                const data = await response.json();

                localStorage.setItem('AccessToken', data.AccessToken);
                localStorage.setItem('RefreshToken', data.RefreshToken);

                alert(`Успешный вход 
                        AccessToken: ${data.AccessToken}
                        RefreshToken: ${data.RefreshToken}`);
                this.form.reset();
                window.location.href = '../MainPage/screen.html';
            } 
            else {
                alert('Ошибка входа');
            }
        }
        catch (error){
            console.error('Ошибка:', error);
            alert('Сетевая ошибка');
        }
    }
}