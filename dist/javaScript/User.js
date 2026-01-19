import { Team } from "./Team.js";
import { Subject } from "./Subject.js";
import { apiService, ApiService } from './Services/ApiService.js';
import { ConverterService } from './Services/ConverterService.js';
import { Role } from './Enum/Enums.js';
export class User {
    id;
    subjects;
    teams;
    role;
    apiService;
    DEBOUNCE_TIME = 0;
    BATCH_LIMIT = 10;
    countOfChanges = 0;
    timer = null;
    subjectsService = new UserSubjectsService(this);
    teamsService = new UserTeamsService(this);
    constructor(id, subjectsDtos = [], teamsDtos = [], apiService) {
        this.id = id;
        this.subjects = subjectsDtos.map(ConverterService.dtoToSubject);
        this.teams = teamsDtos.map(ConverterService.dtoToTeam);
        this.role = Role.ADMIN;
        this.apiService = apiService;
    }
    async makeChange() {
        this.countOfChanges += 1;
        if (this.countOfChanges >= this.BATCH_LIMIT) {
            this.save();
            return;
        }
        this.resetTimer();
    }
    resetTimer() {
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
            if (this.countOfChanges > 0) {
                await this.save();
            }
        }, this.DEBOUNCE_TIME);
    }
    async save() {
        await this.apiService.saveUserData(ConverterService.userToDto(this));
        this.countOfChanges = 0;
    }
    async updateUserData() {
        const newData = await this.apiService.getUserData();
        if (!newData)
            return;
        this.id = newData.Id;
        this.subjects = newData.Subjects.map(ConverterService.dtoToSubject);
        this.teams = newData.Teams.map(ConverterService.dtoToTeam);
        const userName = document.getElementsByClassName("userName")[0];
        if (userName)
            userName.innerHTML = `${newData.Email}`;
    }
}
class UserSubjectsService {
    user;
    constructor(user) {
        this.user = user;
    }
    async addSubject(subject) {
        if (!this.user.subjects)
            this.user.subjects = [];
        this.user.subjects.push(subject);
        await this.user.makeChange();
        return subject.id;
    }
    async removeSubject(subjectId) {
        this.user.subjects = this.user.subjects.filter(subject => subject.id !== subjectId);
        await this.user.makeChange();
    }
    async getSubjects() {
        await this.user.updateUserData();
        return this.user.subjects;
    }
    async getSubjectById(subjectId) {
        await this.user.updateUserData();
        return this.user.subjects.find(subject => subject.id === subjectId);
    }
    async changeSubject(subjectId, name) {
        const subject = await this.getSubjectById(subjectId);
        if (!subject)
            return;
        subject.name = name;
        await this.user.makeChange();
    }
    async changeSubjectData(subjectId, subjectData) {
        const subject = await this.getSubjectById(subjectId);
        if (!subject)
            return;
        subject.tasks = subjectData.tasks;
        subject.teamId = subjectData.teamId;
        await this.user.makeChange();
    }
}
class UserTeamsService {
    user;
    constructor(user) {
        this.user = user;
    }
    async addTeam(team) {
        if (!this.user.teams)
            this.user.teams = [];
        this.user.teams.push(team);
        await this.user.makeChange();
        return team.id;
    }
    async removeTeam(teamId) {
        this.user.teams = this.user.teams.filter(team => team.id !== teamId);
        await this.user.makeChange();
    }
    async getTeams() {
        await this.user.updateUserData();
        return this.user.teams;
    }
    async getTeamById(teamId) {
        await this.user.updateUserData();
        return this.user.teams.find(team => team.id === teamId);
    }
    async changeTeam(teamId, name) {
        const team = await this.getTeamById(teamId);
        if (!team)
            return;
        team.name = name;
        await this.user.makeChange();
    }
}
export var user;
export async function initUser() {
    const userData = await apiService.getUserData();
    if (userData == null) {
        console.log(`Required user not found`);
        user = new User('guest', [], [], apiService);
    }
    else {
        user = new User(userData.Id, userData.Subjects, userData.Teams, apiService);
    }
}
initUser();
//# sourceMappingURL=User.js.map