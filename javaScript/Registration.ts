import type { ApiService } from "./Services/ApiService";
import { DOMService } from "./Services/DOMService";

export class Registration{
    private container: HTMLElement;
    private form: HTMLFormElement;
    private apiService: ApiService;

    constructor(apiService: ApiService){
        this.container = DOMService.getElementById('registration-form-container');
        this.form = DOMService.getElementById('registration-form') as HTMLFormElement;
        this.apiService = apiService;

        this.init();
    }

    init(): void{
        this.form.addEventListener('submit', this.register.bind(this));
    }

    toggleVisibility(): void{
        this.container.classList.toggle('active');
    }

    async register(e: Event): Promise<void>{
        e.preventDefault();

        const email = (DOMService.getElementById('registrationEmailInput') as HTMLInputElement).value;
        const password = (DOMService.getElementById('registrationPasswordInput') as HTMLInputElement).value;

        if(await this.apiService.register(email, password)) this.form.reset();
    }
}
