export interface MemberDto {
    Id: string;
    Name: string;
    Surname: string;
    Email: string | null;
    Specialization: string | null;
    AssignedTasks: string[];
}
export interface TaskDto {
    Id: string;
    Title: string;
    Description: string;
    CreateTime: string;
    DeadLine: string | null;
    LeadTime: string | null;
    Status: string;
    PosX: number;
    PosY: number;
    SubTasks: string[];
    AssignedTasks: string[];
}
export interface SubjectDto {
    Id: string;
    Name: string;
    TeamId: string | null;
    Tasks: TaskDto[];
}
export interface TeamDto {
    Id: string;
    Name: string;
    Subjects: string[];
    Members: MemberDto[];
}
export interface UserDto {
    Id: string;
    Email: string | null;
    Teams: TeamDto[];
    Subjects: SubjectDto[];
}
//# sourceMappingURL=DtoTypes.d.ts.map