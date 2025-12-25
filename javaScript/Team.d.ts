import { TeamMember } from "./TeamMember";
export declare class Team {
    name: string;
    subjects: string[];
    members: TeamMember[];
    id: string;
    constructor(name: string, subjects: string[], members: TeamMember[], id?: string | null);
    removeMember(member: TeamMember): void;
    addMember(member: TeamMember): void;
    changeMember(member: TeamMember): void;
}
//# sourceMappingURL=Team.d.ts.map