class ApiService{
    constructor(){
        this.api = 'http://localhost:5000/api/Auth';
    }

    async register(email, password){
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

    async login(email, password){
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

                alert(`Успешный вход 
                        AccessToken: ${data.AccessToken}
                        RefreshToken: ${data.RefreshToken}`);
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

    async getUserData(){
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
                const userData = this.toCamelCase(await response.json());
                if (!userData.teams) userData.teams = [];
                if (!userData.subjects) userData.subjects = [];
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

    async saveUserData(user){
        try{
            const response = await fetch(`${this.api}/save`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id: user.id,
                    Subjects: user.subjects,
                    Teams: user.teams
                })
            });

            if (response.status === 200) {
                return response;
            } 
            else {
                alert('Ошибка');
            }
        }
        catch (error){
            console.error('Ошибка:', error);
            alert('Сетевая ошибка');
        }
    }

    toCamelCase(obj) {
        const convert = (item) => {
            if (Array.isArray(item)) {
                return item.map(convert);
            } else if (item !== null && typeof item === 'object') {
                const newObj = {};
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        const newKey = key.charAt(0).toLowerCase() + key.slice(1);
                        newObj[newKey] = convert(item[key]);
                    }
                }
                return newObj;
            }
            return item;
        };
        
        return convert(obj);
    }
}

const apiService = new ApiService();