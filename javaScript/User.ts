import { Task } from "./Task";
import { Team } from "./Team";
import { Subject } from "./Subject";

export enum Role {
    USER = 'Пользователь',
    ADMIN = 'Админ'
};

export class User{

    public id: string;
    public subjects: Subject[];
    public teams: Team[];
    private role: Role;

    constructor(id: string, subjects: Subject[] = [], teams: Team[] = []){
        this.id = id;
        this.subjects = [];
        this.teams = teams;
        this.role = Role.ADMIN;

        subjects.forEach(subject => {
            const tasks: Task[] = [];
            subject.tasks.forEach(task => {
                tasks.push(
                    new Task(task.id, task.title, task.description, task.deadline == null ? false : true, new Date(task.deadline), new Date(task.createTime), task.posX, task.posY, task.subTasks, task.assignedTasks)
                )
            });
            

            this.subjects.push(new Subject(subject.id, subject.name, tasks, subject.teamId));
        });
    }

    async saveUser(){
        await apiService.saveUserData(this);
    }

    async updateUserData(){
        const newData = await apiService.getUserData();

        this.id = newData.id;
        this.subjects = [];
        newData.subjects.forEach(subject => {
            const tasks = [];
            subject.tasks.forEach(task => {
                tasks.push(
                    new Task(task.id, task.title, task.description, task.deadLine == null ? false : true, new Date(task.deadLine), new Date(task.createTime), task.posX, task.posY, task.subTasks, task.assignedTasks)
                )
            });

            this.subjects.push(new Subject(subject.name, tasks, subject.id, subject.teamId));
        });

        this.teams = [];
        newData.teams.forEach(team => {
            var members = [];
            team.members.forEach(member => {
                members.push(new TeamMember(member.name, member.surname, member.email, member.specialization, member.assignedTasks, member.id));
            });
            this.teams.push(new Team(team.name, team.subjects, members, team.id));
        });
    }

    async addTeam(team) {
        if (!this.teams) this.teams = [];

        this.teams.push(team);
        await this.saveUser();

        return team.id;
    }

    async addSubject(subject) {
        if (!this.subjects) this.subjects = [];

        this.subjects.push(subject);
        await this.saveUser();

        return subject.id;
    }

    async removeTeam(teamId) {
        this.teams = this.teams.filter(team => team.id !== teamId);
        await this.saveUser();
    }

    async removeSubject(subjectId) {
        this.subjects = this.subjects.filter(subject => subject.id !== subjectId);
        await this.saveUser();
    }

    async getTeams() {
        await this.updateUserData();
        return this.teams;
    }

    async getSubjects() {
        await this.updateUserData();
        return this.subjects;
    }

    async getTeamById(teamId){
        await this.updateUserData();
        return this.teams.find(team => team.id === teamId);
    }

    async getSubjectById(subjectId){
        await this.updateUserData();
        return this.subjects.find(subject => subject.id === subjectId);
    }

    async changeSubject(subjectId, name){
        const subject = await this.getSubjectById(subjectId);
        subject.name = name;
        await this.saveUser();
    }

    async changeSubjectData(subjectId, subjectData){
        const subject = await this.getSubjectById(subjectId);
        subject.tasks = subjectData.tasks;
        subject.teamId = subjectData.teamId;

        await this.saveUser();
    }

    async changeTeam(teamId, name){
        const team = await this.getTeamById(teamId);
        team.name = name;
        await this.saveUser();
    }

    async addMemberInTeam(team, member){
        for(var i = 0; i < this.teams.length; ++i){
            if(this.teams[i].id === team.id){
                this.teams[i].members.push(member);
                await this.saveUser();
                break;
            }
        }
    }

    async changeMemberInTeam(team, member){
        for(var i = 0; i < this.teams.length; ++i){
            if(this.teams[i].id === team.id){
                for(var j = 0; j < this.teams[i].members.length; ++j){
                    if(this.teams[i].members[j].id === member.id){
                        this.teams[i].members[j] = member;
                        break;
                    }
                }
                await apiService.saveUserData(user);
                break;
            }
        }
    }

    async removeMemberFromTeam(team, member){
        for(var i = 0; i < this.teams.length; ++i){
            if(this.teams[i].id === team.id){
                this.teams[i].members = this.teams[i].members.filter(m => m.id !== member.id);
                await this.saveUser();
                break;
            }
        }
    }

    async getTaskById(taskId){
        await this.updateUserData();
        for(var i = 0; i < this.subjects.length; ++i){
            for(var j = 0; j < this.subjects[i].tasks.length; j++)
            if(this.subjects[i].tasks[j].id === taskId){
                return this.subjects[i].tasks[j];
            }
        }
    }
}