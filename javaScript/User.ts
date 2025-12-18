import { Team } from "./Team";
import { Subject } from "./Subject";
import { ApiService } from './Services/ApiService';
import { ConverterService } from './Services/ConverterService';
import { Role } from './Enum/Enums';
import type { SubjectDto, TeamDto, UserDto } from "./Dto/DtoTypes";

export class User{
    public id: string;
    public subjects: Subject[];
    public teams: Team[];
    private role: Role;
    private apiService: ApiService;

    private readonly DEBOUNCE_TIME: number = 3000;
    private readonly BATCH_LIMIT: number = 10;
    private countOfChanges: number = 0;
    private timer: number | null = null;

    public subjectsService: UserSubjectsService = new UserSubjectsService(this);
    public teamsService: UserTeamsService = new UserTeamsService(this);

    constructor(id: string, subjectsDtos: SubjectDto[] = [], teamsDtos: TeamDto[] = [], apiService: ApiService){
        this.id = id;
        this.subjects = subjectsDtos.map(ConverterService.dtoToSubject);
        this.teams = teamsDtos.map(ConverterService.dtoToTeam);
        this.role = Role.ADMIN;
        this.apiService = apiService;
    }

    async makeChange(): Promise<void>{
        this.countOfChanges += 1;

        if (this.countOfChanges >= this.BATCH_LIMIT){
            this.save();
            return;
        }

        this.resetTimer();
    }

    private resetTimer(): void{
        if (this.timer) clearTimeout(this.timer);

        this.timer = setTimeout(async () => {
            if (this.countOfChanges > 0) {
                await this.save();
            }
        }, this.DEBOUNCE_TIME);
    }

    async save(): Promise<void>{
        await this.apiService.saveUserData(this);
        this.countOfChanges = 0;
    }

    async updateUserData(): Promise<void>{
        const newData: UserDto | undefined = await this.apiService.getUserData();
        if (!newData) return;

        this.id = newData.Id;
        this.subjects = newData.Subjects.map(ConverterService.dtoToSubject);
        this.teams = newData.Teams.map(ConverterService.dtoToTeam);
    }
}

class UserSubjectsService{
    private user: User;

    constructor(user: User){
        this.user = user;
    }

    async addSubject(subject: Subject): Promise<string> {
        if (!this.user.subjects) this.user.subjects = [];

        this.user.subjects.push(subject);
        await this.user.makeChange();

        return subject.id;
    }

    async removeSubject(subjectId: string): Promise<void> {
        this.user.subjects = this.user.subjects.filter(subject => subject.id !== subjectId);
        await this.user.makeChange();
    }

    async getSubjects(): Promise<Subject[]> {
        await this.user.updateUserData();
        return this.user.subjects;
    }

    async getSubjectById(subjectId: string): Promise<Subject | undefined>{
        await this.user.updateUserData();
        return this.user.subjects.find(subject => subject.id === subjectId);
    }

    async changeSubject(subjectId: string, name: string): Promise<void>{
        const subject = await this.getSubjectById(subjectId);
        if(!subject) return;

        subject.name = name;
        await this.user.makeChange();
    }

    async changeSubjectData(subjectId: string, subjectData: Subject): Promise<void>{
        const subject = await this.getSubjectById(subjectId);
        if(!subject) return;

        subject.tasks = subjectData.tasks;
        subject.teamId = subjectData.teamId;

        await this.user.makeChange();
    }
}

class UserTeamsService{
    private user: User;

    constructor(user: User){
        this.user = user;
    }

    async addTeam(team: Team): Promise<string> {
        if (!this.user.teams) this.user.teams = [];

        this.user.teams.push(team);
        await this.user.makeChange();

        return team.id;
    }

    async removeTeam(teamId: string): Promise<void> {
        this.user.teams = this.user.teams.filter(team => team.id !== teamId);
        await this.user.makeChange();
    }

    async getTeams(): Promise<Team[]> {
        await this.user.updateUserData();
        return this.user.teams;
    }

    async getTeamById(teamId: string): Promise<Team | undefined>{
        await this.user.updateUserData();
        return this.user.teams.find(team => team.id === teamId);
    }

    async changeTeam(teamId: string, name: string): Promise<void>{
        const team = await this.getTeamById(teamId);
        if(!team) return;

        team.name = name;
        await this.user.makeChange();
    }
}