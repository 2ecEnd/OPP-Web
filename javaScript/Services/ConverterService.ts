import { Task } from "../Task.js";
import type { User } from "../User.js";
import { Subject } from "../Subject.js";
import { Team } from "../Team.js";
import { TeamMember } from "../TeamMember.js";
import type {
    MemberDto,
    TaskDto,
    SubjectDto,
    TeamDto,
    UserDto
} from "../Dto/DtoTypes.js";
import { Status } from '../Enum/Enums.js';

export class ConverterService {
    static memberToDto(member: TeamMember): MemberDto {
        return {
            Id: member.id,
            Name: member.name,
            Surname: member.surname,
            Email: member.email ?? null,
            Specialization: member.specialization ?? null,
            AssignedTasks: member.assignedTasks
        };
    }
    
    static taskToDto(task: Task): TaskDto {
        return {
            Id: task.id,
            Title: task.title,
            Description: task.description,
            CreateTime: task.currentDate.toISOString(),
            DeadLine: task.deadline === null ? null : task.deadline.toISOString(),
            LeadTime: null,
            Status: task.status,
            PosX: task.x,
            PosY: task.y,
            SubTasks: task.dependsOn,
            AssignedTasks: task.assignedTasks
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
            Email: null,
            Subjects: user.subjects.map(subject => this.subjectToDto(subject)),
            Teams: user.teams.map(team => this.teamToDto(team))
        };
    }

    static dtoToTask(taskDto: TaskDto): Task{
        return new Task(
            taskDto.Id, 
            taskDto.Title, 
            taskDto.Description, 
            taskDto.DeadLine == null ? false : true, 
            taskDto.DeadLine == null ? null : new Date(taskDto.DeadLine),
            new Date(taskDto.CreateTime),
            taskDto.PosX,
            taskDto.PosY,
            taskDto.SubTasks,
            taskDto.AssignedTasks,
            taskDto.Status as Status
        );
    }

    static dtoToMember(memberDto: MemberDto): TeamMember{
        return new TeamMember(
            memberDto.Name,
            memberDto.Surname,
            memberDto.Email,
            memberDto.Specialization,
            memberDto.AssignedTasks,
            memberDto.Id
        )
    }

    static dtoToSubject(subjectDto: SubjectDto): Subject {
        return new Subject(
            subjectDto.Id, 
            subjectDto.Name,
            subjectDto.Tasks.map(taskDto => ConverterService.dtoToTask(taskDto)), 
            subjectDto.TeamId
        );
    }

    static dtoToTeam(teamDto: TeamDto): Team {
        return new Team(
            teamDto.Name, 
            teamDto.Subjects,
            teamDto.Members.map(memberDto => ConverterService.dtoToMember(memberDto)), 
            teamDto.Id,
        );
    }
}