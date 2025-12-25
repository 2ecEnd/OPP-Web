import type { ApiService } from "./Services/ApiService";
export declare class Registration {
    private container;
    private form;
    private apiService;
    constructor(apiService: ApiService);
    init(): void;
    toggleVisibility(): void;
    register(e: Event): Promise<void>;
}
//# sourceMappingURL=Registration.d.ts.map