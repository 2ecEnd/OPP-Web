import { Team } from "./Team.js";
import { Subject } from "./Subject.js";
import { ApiService } from './Services/ApiService.js';
import type { SubjectDto, TeamDto } from "./Dto/DtoTypes.js";
export declare class User {
    id: string;
    subjects: Subject[];
    teams: Team[];
    private role;
    private apiService;
    private readonly DEBOUNCE_TIME;
    private readonly BATCH_LIMIT;
    private countOfChanges;
    private timer;
    subjectsService: UserSubjectsService;
    teamsService: UserTeamsService;
    constructor(id: string, subjectsDtos: SubjectDto[] | undefined, teamsDtos: TeamDto[] | undefined, apiService: ApiService);
    makeChange(): Promise<void>;
    private resetTimer;
    save(): Promise<void>;
    updateUserData(): Promise<void>;
}
declare class UserSubjectsService {
    private user;
    constructor(user: User);
    addSubject(subject: Subject): Promise<string>;
    removeSubject(subjectId: string): Promise<void>;
    getSubjects(): Promise<Subject[]>;
    getSubjectById(subjectId: string): Promise<Subject | undefined>;
    changeSubject(subjectId: string, name: string): Promise<void>;
    changeSubjectData(subjectId: string, subjectData: Subject): Promise<void>;
}
declare class UserTeamsService {
    private user;
    constructor(user: User);
    addTeam(team: Team): Promise<string>;
    removeTeam(teamId: string): Promise<void>;
    getTeams(): Promise<Team[]>;
    getTeamById(teamId: string): Promise<Team | undefined>;
    changeTeam(teamId: string, name: string): Promise<void>;
}
export declare var user: User;
export declare function initUser(): Promise<void>;
export {};
//# sourceMappingURL=User.d.ts.map