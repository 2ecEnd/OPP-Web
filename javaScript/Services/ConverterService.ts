import type { Task } from "../Task";
import type { User } from "../User";
import type { Subject } from "../Subject";
import type { Team } from "../Team";
import type { TeamMember } from "../TeamMember";
import type {
    MemberDto,
    TaskDto,
    SubjectDto,
    TeamDto,
    UserDto
} from "../Dto/DtoTypes";

export class ConverterService {
    static memberToDto(member: TeamMember): MemberDto {
        return {
            Id: member.id,
            Name: member.name,
            Surname: member.surname,
            Email: member.email ?? null,
            Specialization: member.specialization ?? null,
            AssignedTasks: []
        };
    }
    
    static taskToDto(task: Task): TaskDto {
        return {
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
        };
    }
    
    static subjectToDto(subject: Subject): SubjectDto {
        return {
            Id: subject.id,
            Name: subject.name,
            TeamId: subject.teamId ?? null,
            Tasks: subject.tasks.map(task => this.taskToDto(task))
        };
    }
    
    static teamToDto(team: Team): TeamDto {
        return {
            Id: team.id,
            Name: team.name,
            Subjects: team.subjects ?? [],
            Members: team.members.map(member => this.memberToDto(member))
        };
    }
    
    static userToDto(user: User): UserDto {
        return {
            Id: user.id,
            Subjects: user.subjects.map(subject => this.subjectToDto(subject)),
            Teams: user.teams.map(team => this.teamToDto(team))
        };
    }
}