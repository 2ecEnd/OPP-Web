export function createTeamView(teamType: string, teamId: string){
    const newElement = document.createElement('div');
    newElement.classList.add('contentItem');
    newElement.style.display = 'flex';
    newElement.style.flexDirection = 'column';
    newElement.style.justifyContent = 'space-between';
    newElement.setAttribute('data-type', teamType);
    newElement.setAttribute('data-id', teamId);
    return newElement;
}