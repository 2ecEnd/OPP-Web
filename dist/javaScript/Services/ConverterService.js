import { Task } from "../Task.js";
import { Subject } from "../Subject.js";
import { Team } from "../Team.js";
import { TeamMember } from "../TeamMember.js";
import { Status } from '../Enum/Enums.js';
export class ConverterService {
    static memberToDto(member) {
        return {
            Id: member.id,
            Name: member.name,
            Surname: member.surname,
            Email: member.email ?? null,
            Specialization: member.specialization ?? null,
            AssignedTasks: member.assignedTasks
        };
    }
    static taskToDto(task) {
        return {
            Id: task.id,
            Title: task.title,
            Description: task.description,
            CreateTime: task.currentDate.toISOString(),
            DeadLine: task.deadline == "отсутствует" ? null : task.deadline.toString(),
            LeadTime: null,
            Status: task.status,
            PosX: task.x,
            PosY: task.y,
            SubTasks: task.dependsOn,
            AssignedTasks: task.assignedTasks
        };
    }
    static subjectToDto(subject) {
        return {
            Id: subject.id,
            Name: subject.name,
            TeamId: subject.teamId ?? null,
            Tasks: subject.tasks.map(task => this.taskToDto(task))
        };
    }
    static teamToDto(team) {
        return {
            Id: team.id,
            Name: team.name,
            Subjects: team.subjects ?? [],
            Members: team.members.map(member => this.memberToDto(member))
        };
    }
    static userToDto(user) {
        return {
            Id: user.id,
            Subjects: user.subjects.map(subject => this.subjectToDto(subject)),
            Teams: user.teams.map(team => this.teamToDto(team))
        };
    }
    static dtoToTask(taskDto) {
        return new Task(taskDto.Id, taskDto.Title, taskDto.Description, taskDto.DeadLine == null ? false : true, taskDto.DeadLine == null ? "Отсутствует" : new Date(taskDto.DeadLine), new Date(taskDto.CreateTime), taskDto.PosX, taskDto.PosY, taskDto.SubTasks, taskDto.AssignedTasks, taskDto.Status);
    }
    static dtoToMember(memberDto) {
        return new TeamMember(memberDto.Name, memberDto.Surname, memberDto.Email, memberDto.Specialization, memberDto.AssignedTasks, memberDto.Id);
    }
    static dtoToSubject(subjectDto) {
        return new Subject(subjectDto.Id, subjectDto.Name, subjectDto.Tasks.map(taskDto => ConverterService.dtoToTask(taskDto)), subjectDto.TeamId);
    }
    static dtoToTeam(teamDto) {
        return new Team(teamDto.Name, teamDto.Subjects, teamDto.Members.map(memberDto => ConverterService.dtoToMember(memberDto)), teamDto.Id);
    }
}
//# sourceMappingURL=ConverterService.js.map