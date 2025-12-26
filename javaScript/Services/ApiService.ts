import type {
    UserDto
} from "../Dto/DtoTypes";

export class ApiService{
    private api: string;
    private saved: boolean;

    constructor() {
        //this.api = 'http://localhost:5000/api/Auth';
        //this.api = 'https://localhost:7000/api/Auth';
        this.api = 'https://opp-back.onrender.com/api/Auth';
        this.saved = true;
    }

    async register(email: string, password: string): Promise<boolean>{
        try{
            const response = await fetch(`${this.api}/register`, {
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

                alert('Регистрация успешна');
                window.location.href = '../MainPage/screen.html';
                return true;
            } 
            else {
                alert('Ошибка регистрации');
            }
        }
        catch (error){
            console.error('Ошибка:', error);
            alert('Сетевая ошибка');
        }

        return false;
    }

    async login(email: string, password: string): Promise<boolean>{
        try{
            const response = await fetch(`${this.api}/login`, {
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

                // alert(`Успешный вход 
                //         AccessToken: ${data.AccessToken}
                //         RefreshToken: ${data.RefreshToken}`);
                window.location.href = '../MainPage/screen.html';
                return true;
            } 
            else {
                alert('Ошибка входа');
            }
        }
        catch (error){
            console.error('Ошибка:', error);
            alert('Сетевая ошибка');
        }

        return false;
    }
    
    async logout(): Promise<boolean>{
        try{
            const response = await fetch(`${this.api}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    RefreshToken: localStorage.getItem('RefreshToken')
                })
            });
            
            if (response.status === 200) {
                localStorage.removeItem('AccessToken');
                localStorage.removeItem('RefreshToken');

                window.location.href = '../../pages/registrationPage.html';
                return true;
            } 
            else {
                alert('Ошибка выхода');
            }
        }
        catch (error){
            console.error('Ошибка:', error);
            alert('Сетевая ошибка');
        }

        return false;
    }

    async getUserData(): Promise<UserDto | undefined>{
        const token = localStorage.getItem('AccessToken');

        try{
            const response = await fetch(`${this.api}/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.status === 200) {
                const userData: UserDto = await response.json();
                
                return userData;
            } 
            else {
                window.location.href = '../pages/registrationPage.html';
                alert('Ошибка');
            }
        }
        catch (error){
            console.error('Ошибка:', error);
            alert('Сетевая ошибка');
        }
    }

    async saveUserData(user: UserDto){
        try{
            if(this.saved){
                this.saved = false;

                const response = await fetch(`${this.api}/save`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user)
                });

                if (response.status === 200) {
                    this.saved = true;
                    return response;
                } 
                else {
                    this.saved = true;
                    alert('Ошибка');
                }
            }
        }
        catch (error){
            this.saved = true;
            console.error('Ошибка:', error);
            alert('Сетевая ошибка');
        }
    }
}

export const apiService = new ApiService();