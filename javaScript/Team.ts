import { TeamMember } from "./TeamMember";

export class Team{
    public name: string;
    public subjects: string[];
    public members: TeamMember[];
    public id: string;
    constructor(name: string, subjects: string[], members: TeamMember[], id: string | null = null){
        this.name = name;
        this.subjects = subjects;
        this.members = members;
        this.id = id ?? crypto.randomUUID();
    }

    removeMember(member: TeamMember){
        this.members = this.members.filter(m => m.id != member.id)
    }

    addMember(member: TeamMember){
        this.members.push(member)
    }

    changeMember(member: TeamMember){
        this.members.forEach(m => {
            if(m.id == member.id) {
                m.name = member.name
                m.surname = member.surname
                m.email = member.email
                m.specialization = member.specialization
                m.assignedTasks = member.assignedTasks
            }
        });
    }
}