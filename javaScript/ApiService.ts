import type { Task } from "./Task";
import type { User } from "./User";
import type { Subject } from "./Subject";
import type { Team } from "./Team";
import type { TeamMember } from "./TeamMember";

interface MemberDto{
    Id: string;
    Name: string;
    Surname: string;
    Email: string | null;
    Specialization: string | null;
    AssignedTasks: string[];
}

interface TaskDto{
    Id: string;
    Title: string;
    Description: string;
    CreateTime: string;
    DeadLine: string | null | Date;
    LeadTime: string | null;
    Status: string;
    PosX: number;
    PosY: number;
    SubTasks: string[];
    AssignedTasks: string[];
}

interface SubjectDto{
    Id: string;
    Name: string;
    TeamId: string | null;
    Tasks: TaskDto[];
}

interface TeamDto{
    Id: string;
    Name: string;
    Subjects: string[];
    Members: MemberDto[];
}

interface UserDto{
    Id: string;
    Teams: TeamDto[];
    Subjects: SubjectDto[];
}

const memberToDto = (member: TeamMember): MemberDto => ({
    Id: member.id,
    Name: member.name,
    Surname: member.surname,
    Email: member.email ? member.email : null,
    Specialization: member.specialization ? member.specialization : null,
    AssignedTasks: []
})

const taskToDto = (task: Task): TaskDto => ({
    Id: task.id,
    Title: task.title,
    Description: task.description,
    CreateTime: task.currentDate.toISOString(),
    DeadLine: task.deadline == "отсутствует" ? null : task.deadline,
    LeadTime: null,
    Status: task.status,
    PosX: task.x,
    PosY: task.y,
    SubTasks: task.dependsOn,
    AssignedTasks: []
});

const subjectToDto = (subject: Subject): SubjectDto => ({
    Id: subject.id,
    Name: subject.name,
    TeamId: subject.teamId ? subject.teamId : null,
    Tasks: subject.tasks.map(taskToDto)
});

const teamToDto = (team: Team): TeamDto => ({
    Id: team.id,
    Name: team.name,
    Subjects: team.subjects ? team.subjects : [],
    Members: team.members.map(memberToDto)
})

const userToDto = (user: User): UserDto => ({
    Id: user.id,
    Subjects: user.subjects.map(subjectToDto),
    Teams: user.teams.map(teamToDto)
})

class ApiService{
    private api: string;
    private saved: boolean;

    constructor() {
        this.api = 'http://localhost:5000/api/Auth';
        // this.api = 'https://localhost:7000/api/Auth';
        // this.api = 'https://opp-back.onrender.com/api/Auth';
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

    async login(email: string, password: string): Promise<void>{
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

    async saveUserData(user: User){
        try{
            if(this.saved){
                this.saved = false;
                const saveData = userToDto(user);

                const response = await fetch(`${this.api}/save`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({saveData})
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