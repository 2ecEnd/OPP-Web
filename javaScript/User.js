class User{
    constructor(id, subjects, teams){
        this.id = id;
        this.subjects = subjects;
        this.teams = teams;
    }

    async updateUserData(){
        const newData = await apiService.getUserData();

        this.id = newData.Id;
        this.subjects = newData.Subjects;
        this.teams = newData.Teams;
    }

    async addTeam(team) {
        if (!this.teams) this.teams = [];

        this.teams.push(team);
        await apiService.saveUserData(this);

        return team.id;
    }

    async addSubject(subject) {
        if (!this.subjects) this.subjects = [];

        this.subjects.push(subject);
        await apiService.saveUserData(this);

        return subject.id;
    }

    async removeTeam(teamId) {
        this.teams = this.teams.filter(team => team.Id !== teamId);
        await apiService.saveUserData(this);
    }

    async removeSubject(subjectId) {
        this.subjects = this.subjects.filter(subject => subject.Id !== subjectId);
        await apiService.saveUserData(this);
    }

    async getTeams() {
        updateUserData();
        return this.teams;
    }

    async getSubjects() {
        updateUserData();
        return this.subjects;
    }

    async getTeamById(teamId){
        updateUserData();
        return this.teams.find(team => team.Id === teamId);
    }

    async getSubjectById(subjectId){
        updateUserData();
        return this.subjects.find(subject => subject.Id === subjectId);
    }
}

var user = null;

async function initUser(){
    const userData = await apiService.getUserData();
    if(userData == null) return;

    user = new User(userData.Id, userData.Subjects, userData.Teams);
}

initUser();