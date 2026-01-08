import { Team } from "../javaScript/Team.js";
import { user } from "../javaScript/User.js";
import { createTeamView } from "./teamView.js";
import { TabManager } from "./TabManager.js";
import { Subject } from "../javaScript/Subject.js";
import { SubjectView } from "../javaScript/SubjectView.js";

export class AddDialog{
  private addButton = document.querySelector('.addButton');
  private modalOverlay = document.getElementById('modalOverlay') as HTMLDivElement;
  private modalInput = document.getElementById('modalInput') as HTMLInputElement;
  private createBtn = document.getElementById('createBtn');
  private cancelBtn = document.getElementById('cancelBtn');
  constructor(tabManager: TabManager){

    this.addButton?.addEventListener('click', this.openModal.bind(this));

    this.cancelBtn?.addEventListener('click', this.closeModal.bind(this));
      this.createBtn?.addEventListener('click', async () => {
        const name = this.modalInput.value.trim();
        if (name && user) {

            const activeItem = document.querySelector('.selectedActionPanelItem');
            
            const activeItemText = activeItem?.querySelector('.actionPanelItemText')?.textContent ?? "";
        
            const contentArea = document.querySelector('.contentArea');
        
            if (activeItemText === 'Teams'){
            const newTeam = new Team(name, [], []);
            const teamId = await user.teamsService.addTeam(newTeam);

            const newElement = createTeamView('team', teamId);
            newElement.textContent = name;

            const buttons = document.createElement('div');
            buttons.style.display = 'flex';
            buttons.style.flexDirection = 'row';
            buttons.style.justifyContent = 'space-around';

            newElement.setAttribute('data-type', 'team');
            newElement.setAttribute('data-id', teamId);

            const delBtn = document.createElement('div');
            delBtn.textContent = "X";
            delBtn.style.color = "white";
            delBtn.style.fontSize = '32px'
            delBtn.addEventListener('mouseup', async function() {
                await user.teamsService.removeTeam(teamId);
                tabManager.closeTab('team', teamId);
                contentArea?.removeChild(newElement);
            });

              const changeBtn = document.createElement('div');
              changeBtn.textContent = "R";
              changeBtn.style.color = "white";
              changeBtn.style.fontSize = '32px'

              buttons.appendChild(delBtn);
              buttons.appendChild(changeBtn);
              newElement.appendChild(buttons);
              contentArea?.appendChild(newElement);
            }
            else if (activeItemText === 'Subjects'){
              const newSubject = new Subject(null, name, [], null);
              await user.subjectsService.addSubject(newSubject);
              contentArea?.appendChild(new SubjectView(newSubject).container);
            }

            this.closeModal();
        }
    });

    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  openModal() {
    if(!this.modalOverlay || !this.modalInput) return;
      this.modalOverlay.style.display = 'flex';
      this.modalInput.focus();
  }

  closeModal() {
    if(!this.modalOverlay || !this.modalInput) return;
      this.modalOverlay.style.display = 'none';
      this.modalInput.value = '';
  }

  
}