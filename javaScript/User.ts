import { Task } from "./Task";
import { TeamMember } from "./TeamMember";
import { Team } from "./Team";
import { Subject } from "./Subject";
import { apiService } from './Services/ApiService';

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
                    new Task(
                        task.id,
                        task.title,
                        task.description,
                        task.deadline == null ? false : true,
                        new Date(task.deadline),
                        new Date(task.createTime),
                        task.posX,
                        task.posY,
                        task.subTasks,
                        task.assignedTasks)
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
        if (!newData) return;

        this.id = newData.Id;
        this.subjects = [];
        newData.Subjects.forEach(subject => {
            const tasks: Task[] = [];
            subject.Tasks.forEach(task => {
                const deadline = task.DeadLine ? new Date(task.DeadLine) : null;
                tasks.push(
                    new Task(
                        task.Id,
                        task.Title,
                        task.Description,
                        task.DeadLine == null ? false : true,
                        deadline, new Date(task.CreateTime),
                        task.PosX,
                        task.PosY,
                        task.SubTasks,
                        task.AssignedTasks)
                )
            });

            this.subjects.push(new Subject(subject.Id, subject.Name, tasks, subject.TeamId));
        });

        this.teams = [];
        newData.Teams.forEach(team => {
            var members: TeamMember[] = [];
            team.Members.forEach(member => {
                members.push(
                    new TeamMember(
                        member.Name,
                        member.Surname,
                        member.Email,
                        member.Specialization,
                        member.AssignedTasks,
                        member.Id));
            });
            this.teams.push(
                new Team(
                    team.Name,
                    team.Subjects,
                    members,
                    team.Id
                )
            );
        });
    }

    async addTeam(team: Team) {
        if (!this.teams) this.teams = [];

        this.teams.push(team);
        await this.saveUser();

        return team.id;
    }

    async addSubject(subject: Subject) {
        if (!this.subjects) this.subjects = [];

        this.subjects.push(subject);
        await this.saveUser();

        return subject.id;
    }

    async removeTeam(teamId: string) {
        let size = this.teams.length;
        this.teams = this.teams.filter(team => team.id !== teamId);
        if(size != this.teams.length) await this.saveUser();
    }

    async removeSubject(subjectId: string) {
        let size = this.subjects.length;
        this.subjects = this.subjects.filter(subject => subject.id !== subjectId);
        if(size != this.subjects.length) await this.saveUser();
    }

    async getTeams(): Promise<Team[]> {
        await this.updateUserData();
        return this.teams;
    }

    async getSubjects(): Promise<Subject[]> {
        await this.updateUserData();
        return this.subjects;
    }

    async getTeamById(teamId: string): Promise<Team | undefined>{
        await this.updateUserData();
        return this.teams.find(team => team.id === teamId);
    }

    async getSubjectById(subjectId: string): Promise<Subject | undefined>{
        await this.updateUserData();
        return this.subjects.find(subject => subject.id === subjectId);
    }

    async changeSubject(subjectId: string, name: string){
        const subject = await this.getSubjectById(subjectId);
        if(subject) {
            subject.name = name;
            await this.saveUser();
        }
    }

    async changeSubjectData(subjectId: string, subjectData){
        const subject = await this.getSubjectById(subjectId);
        if(subject) {
            subject.tasks = subjectData.tasks;
            subject.teamId = subjectData.teamId;
            await this.saveUser();
        }
    }

    async changeTeam(teamId: string, name: string){
        const team = await this.getTeamById(teamId);
        if (team){
            team.name = name;
            await this.saveUser();
        }
    }

    async addMemberInTeam(team: Team, member: TeamMember){
        for(var i = 0; i < this.teams.length; ++i){
            if(!this.teams[i]) continue;
            
            if(this.teams[i].id === team.id){
                this.teams[i].members.push(member);
                await this.saveUser();
                break;
            }
        }
    }

    async changeMemberInTeam(team: Team, member: TeamMember){
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

    async removeMemberFromTeam(team: Team, member: TeamMember){
        for(var i = 0; i < this.teams.length; ++i){
            if(this.teams[i].id === team.id){
                this.teams[i].members = this.teams[i].members.filter(m => m.id !== member.id);
                await this.saveUser();
                break;
            }
        }
    }

    async getTaskById(taskId: string){
        await this.updateUserData();
        for(var i = 0; i < this.subjects.length; ++i){
            for(var j = 0; j < this.subjects[i].tasks.length; j++)
            if(this.subjects[i].tasks[j].id === taskId){
                return this.subjects[i].tasks[j];
            }
        }
    }
}