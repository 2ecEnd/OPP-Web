class User{
    constructor(id, subjects, teams){
        this.id = id;
        this.subjects = [];
        this.teams = teams;

        subjects.forEach(subject => {
            const tasks = [];
            subject.tasks.forEach(task => {
                tasks.push(
                    new Task(task.id, task.title, task.description, task.deadLine == null ? false : true, task.deadLine, new Date(task.createTime), task.posX, task.posY, task.subTasks, task.assignedTasks)
                )
            });
            this.subjects.push(new Subject(subject.name, tasks, subject.id, subject.teamId));
        });
    }

    async saveUser(){
        await apiService.saveUserData(this);
    }

    async updateUserData(){
        const newData = await apiService.getUserData();

        this.id = newData.id;
        this.subjects = [];
        newData.subjects.forEach(subject => {
            const tasks = [];
            subject.tasks.forEach(task => {
                tasks.push(
                    new Task(task.id, task.title, task.description, task.deadLine == null ? false : true, task.deadLine, new Date(task.createTime), task.posX, task.posY, task.subTasks, task.assignedTasks)
                )
            });

            this.subjects.push(new Subject(subject.name, tasks, subject.id, subject.teamId));
        });
        this.teams = newData.teams;
    }

    async addTeam(team) {
        if (!this.teams) this.teams = [];

        this.teams.push(team);
        await this.saveUser();

        return team.id;
    }

    async addSubject(subject) {
        if (!this.subjects) this.subjects = [];

        this.subjects.push(subject);
        await this.saveUser();

        return subject.id;
    }

    async removeTeam(teamId) {
        this.teams = this.teams.filter(team => team.id !== teamId);
        await this.saveUser();
    }

    async removeSubject(subjectId) {
        this.subjects = this.subjects.filter(subject => subject.id !== subjectId);
        await this.saveUser();
    }

    async getTeams() {
        this.updateUserData();
        return this.teams;
    }

    async getSubjects() {
        this.updateUserData();
        return this.subjects;
    }

    async getTeamById(teamId){
        await this.updateUserData();
        return this.teams.find(team => team.id === teamId);
    }

    async getSubjectById(subjectId){
        this.updateUserData();
        return this.subjects.find(subject => subject.id === subjectId);
    }

    async changeSubject(subjectId, name, teamId){
        const subject = await this.getSubjectById(subjectId);
        subject.name = name;
        subject.teamId = teamId;
        await this.saveUser();
    }

    async changeSubjectData(subjectId, subjectData){
        const subject = await this.getSubjectById(subjectId);
        subject.tasks = subjectData.tasks;
        subject.teamId = subjectData.teamId;

        await this.saveUser();
    }

    async addMemberInTeam(team, member){
        for(var i = 0; i < this.teams.length; ++i){
            if(this.teams[i].id === team.id){
                this.teams[i].members.push(member);
                await this.saveUser();
                break;
            }
        }
    }

    async changeMemberInTeam(team, member){
        for(var i = 0; i < this.teams.length; ++i){
            if(this.teams[i].id === team.id){
                for(var j = 0; j < this.teams[i].members.length; ++j){
                    if(this.teams[i].members[j].id === member.id){
                        this.teams[i].members[j] = member;
                        break;
                    }
                }
                await apiService.saveUserData(user);
                break;
            }
        }
    }

    async removeMemberFromTeam(team, member){
        for(var i = 0; i < this.teams.length; ++i){
            if(this.teams[i].id === team.id){
                this.teams[i].members = this.teams[i].members.filter(m => m.id !== member.id);
                await this.saveUser();
                break;
            }
        }
    }

    async getTaskById(taskId){
        this.updateUserData();
        for(var i = 0; i < this.subjects.length; ++i){
            for(var j = 0; j < this.subjects[i].tasks.length; j++)
            if(this.subjects[i].tasks[j].id === taskId){
                return this.subjects[i].tasks[j];
            }
        }
    }
}

var user = null;

async function initUser(){
    const userData = await apiService.getUserData();
    if(userData == null) return;

    user = new User(userData.id, userData.subjects, userData.teams);
}

initUser();