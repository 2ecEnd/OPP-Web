export function createTeamView(teamType, teamId) {
    const newElement = document.createElement('div');
    newElement.classList.add('contentItem');
    newElement.style.display = 'flex';
    newElement.style.flexDirection = 'column';
    newElement.style.justifyContent = 'space-between';
    newElement.setAttribute('data-type', teamType);
    newElement.setAttribute('data-id', teamId);
    return newElement;
}
//# sourceMappingURL=teamView.js.map