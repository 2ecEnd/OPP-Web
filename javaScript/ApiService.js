class ApiService{
    constructor(){
        //this.api = 'https://localhost:7000/api/Auth';
        this.api = 'http://localhost:5000/api/Auth';
        //this.api = 'https://opp-back.onrender.com/api/Auth';
        this.saved = true;
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

                // alert(`Успешный вход 
                //         AccessToken: ${data.AccessToken}
                //         RefreshToken: ${data.RefreshToken}`);
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
            if(this.saved){
                this.saved = false;
                const subjectsData = [];
                user.subjects.forEach(subject => {
                    const tasksData = [];
                    subject.tasks.forEach(task => {
                        tasksData.push(
                            {
                                Id: task.id,
                                Title: task.title,
                                Description: task.description,
                                CreateTime: task.currentDate.toISOString(),
                                DeadLine: task.deadline == "отсутствует" ? null : task.deadline,
                                LeadTime: null,
                                Status: task.status,
                                PosX: task.x,
                                PosY: task.y,
                                SuperTaskId: null,
                                SubTasks: task.dependsOn,
                                AssignedTasks: []
                            }
                        )
                    });
                    

                    subjectsData.push(
                        {
                            Id: subject.id,
                            Name: subject.name,
                            TeamId: subject.teamId ? subject.teamId : null,
                            Tasks: tasksData
                        }
                    );
                });

                const teamsData = [];
                user.teams.forEach(team => {
                    const membersData = [];
                    team.members.forEach(member =>{
                        membersData.push(
                            {
                                Id: member.id,
                                Name: member.name,
                                Surname: member.surname,
                                Email: member.email ? member.email : null,
                                Specialization: member.specialization ? member.specialization : null,
                                AssignedTasks: []
                            }
                        );
                    })
                    teamsData.push(
                        {
                            Id: team.id,
                            Name: team.name,
                            Subjects: team.subjects ? team.subjects : [],
                            Members: membersData
                        }
                    );
                });

                console.log("save")

                const response = await fetch(`${this.api}/save`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Id: user.id,
                        Subjects: subjectsData,
                        Teams: teamsData
                    })
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
