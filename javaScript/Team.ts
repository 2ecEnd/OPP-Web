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
}