import { TeamMember } from "./TeamMember";
export class Team {
    name;
    subjects;
    members;
    id;
    constructor(name, subjects, members, id = null) {
        this.name = name;
        this.subjects = subjects;
        this.members = members;
        this.id = id ?? crypto.randomUUID();
    }
    removeMember(member) {
        this.members = this.members.filter(m => m.id != member.id);
    }
    addMember(member) {
        this.members.push(member);
    }
    changeMember(member) {
        this.members.forEach(m => {
            if (m.id == member.id) {
                m.name = member.name;
                m.surname = member.surname;
                m.email = member.email;
                m.specialization = member.specialization;
                m.assignedTasks = member.assignedTasks;
            }
        });
    }
}
//# sourceMappingURL=Team.js.map