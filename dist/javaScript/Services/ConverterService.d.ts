import { Task } from "../Task";
import type { User } from "../User";
import { Subject } from "../Subject";
import { Team } from "../Team";
import { TeamMember } from "../TeamMember";
import type { MemberDto, TaskDto, SubjectDto, TeamDto, UserDto } from "../Dto/DtoTypes";
export declare class ConverterService {
    static memberToDto(member: TeamMember): MemberDto;
    static taskToDto(task: Task): TaskDto;
    static subjectToDto(subject: Subject): SubjectDto;
    static teamToDto(team: Team): TeamDto;
    static userToDto(user: User): UserDto;
    static dtoToTask(taskDto: TaskDto): Task;
    static dtoToMember(memberDto: MemberDto): TeamMember;
    static dtoToSubject(subjectDto: SubjectDto): Subject;
    static dtoToTeam(teamDto: TeamDto): Team;
}
//# sourceMappingURL=ConverterService.d.ts.map