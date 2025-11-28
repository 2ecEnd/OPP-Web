var user = null;

async function getUserData(){

    const api = 'http://localhost:5000/api/Auth';

    try{
        const response = await fetch(`${api}/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 201) {
            const userData = await response.json();
            if (!userData.Teams) userData.Teams = [];
            if (!userData.Subjects) userData.Subjects = [];
            return userData;
        } 
        else {
            alert('Ошибка');
        }
    }
    catch (error){
        console.error('Ошибка:', error);
        alert('Сетевая ошибка');
    }
}

user = getUserData();

async function saveUserData(){

    const api = 'http://localhost:5000/api/Auth';

    try{
        const response = await fetch(`${api}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: user
            })
        });

        if (response.status === 201) {
            return response;
        } 
        else {
            alert('Ошибка');
        }
    }
    catch (error){
        console.error('Ошибка:', error);
        alert('Сетевая ошибка');
    }
}

async function addTeam(teamName) {
    if(user == null){
        user = await getUserData();
    }
    if(user == null){
        return;
    }

    if (!user.Teams) user.Teams = [];

    var newTeam = { Id: crypto.randomUUID(), Name: teamName, Subjects: [], Members: [] };
    user.Teams.push(newTeam);
    await saveUserData();

    return newTeam.Id;
}

async function addSubject(subjectName) {
    if(user == null){
        user = await getUserData();
    }
    if(user == null){
        return;
    }

    if (!user.Subjects) user.Subjects = [];

    var newSubject = { Id: crypto.randomUUID(), Name: subjectName, TeamId: null, Tasks: [] };
    user.Subjects.push(newSubject);
    await saveUserData();

    return newSubject.Id;
}

async function removeTeam(teamId) {
    if(user == null){
        user = await getUserData();
    }
    if(user == null){
        return;
    }
    user.Teams = user.Teams.filter(team => team.Id !== teamId);
    await saveUserData();
}

async function removeSubject(subjectId) {
    if(user == null){
        user = await getUserData();
    }
    if(user == null){
        return;
    }
    user.Subjects = user.Subjects.filter(subject => subject.Id !== subjectId);
    await saveUserData();
}

async function getTeams() {
    user = await getUserData();
    return user.Teams;
}

async function getSubjects() {
    user = await getUserData();
    return user.Subjects;
}