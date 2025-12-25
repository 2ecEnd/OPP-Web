import type { Subject } from "../Subject.js";
import type { Task } from "../Task.js";
import { DragController } from "./DragController.js";
import { LinkController } from "./LinkController.js";
import { TaskView } from "../TaskView.js";

export class Canvas{
    public subject: Subject;
    public taskViews: TaskView[] = [];
    public viewport: HTMLElement;
    public canvas: HTMLElement;
    public connectionsLayer: HTMLElement;
    private x: number;
    private y: number;
    public scale: number;
    private minScale: number;
    private maxScale: number;
    private scaleStep: number;

    private dragController: DragController;
    public linkController: LinkController;

    public dragModeIsActive: boolean;
    private isDraggingCanvas: boolean;
    private lastX: number;
    private lastY: number;

    constructor(subject: Subject){
        this.subject = subject;
        this.viewport = document.getElementById('viewport')!;
        this.canvas = document.getElementById('canvas')!;
        this.connectionsLayer = document.getElementById('connections-layer')!;

        this.x = -2500;
        this.y = -2500;
        this.scale = 1;
        this.minScale = 0.1;
        this.maxScale = 3;
        this.scaleStep = 0.1;

        this.dragModeIsActive = false;
        this.isDraggingCanvas = false;
        this.lastX = 0;
        this.lastY = 0;

        this.dragController = new DragController(this);
        this.linkController = new LinkController(this);
    }

    initExistingTasks(): void{
        this.subject.tasks.forEach((task: Task) => {
            const newTaskView = new TaskView(task);
            this.taskViews.push(newTaskView);
            this.canvas.appendChild(newTaskView.createDom());
        });
        this.taskViews.forEach((taskView: TaskView) => {
            taskView.model.dependsOn.forEach((id: string) => {
                const endTaskView = this.taskViews.find(view => view.container.id === id)!;
                this.connectionsLayer.appendChild(this.linkController.createLine(taskView, endTaskView));
            });
        });
    }

    initCanvasEvents(): void{
        this.viewport.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.viewport.addEventListener('wheel', this.onWheel.bind(this));

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onWheel(e: WheelEvent): void {
        e.preventDefault();
        
        const delta: number = e.deltaY > 0 ? -1 : 1;
        
        this.zoom(delta, e.clientX, e.clientY);
    }

    zoom(delta: number, clientX: number, clientY: number) {
        const oldScale: number = this.scale;
        
        this.scale += delta * this.scaleStep;
        this.scale = Math.min(Math.max(this.scale, this.minScale), this.maxScale);
        
        if (oldScale === this.scale) return;
        
        const rect: DOMRect = this.viewport.getBoundingClientRect();
        const mouseX: number = clientX - rect.left;
        const mouseY: number = clientY - rect.top;
        
        const canvasX: number = (mouseX - this.x) / oldScale;
        const canvasY: number = (mouseY - this.y) / oldScale;
        
        this.x = mouseX - canvasX * this.scale;
        this.y = mouseY - canvasY * this.scale;
        
        this.updateTransform();
    }

    onKeyDown(e: KeyboardEvent){
        if (e.code === 'Space' && !this.dragModeIsActive){
            this.dragModeIsActive = true;
            this.viewport.style.cursor = 'grab';
        }
    }

    onKeyUp(e: KeyboardEvent){
        if (e.code === 'Space'){
            this.dragModeIsActive = false;
            this.isDraggingCanvas = false;
            this.viewport.style.cursor = 'default';
        }
    }

    onMouseDown(e: MouseEvent) {
        if(this.linkController.linkingMode) this.linkController.stopLinking();
        if(!this.dragModeIsActive) return;

        e.preventDefault();
        
        this.isDraggingCanvas = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.viewport.style.cursor = 'grabbing';
    }

    onMouseMove(e: MouseEvent) {
        if (!this.isDraggingCanvas || !this.dragModeIsActive) return;
        
        const deltaX: number = e.clientX - this.lastX;
        const deltaY: number = e.clientY - this.lastY;
        
        this.x += deltaX;
        this.y += deltaY;
        
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        
        this.updateTransform();
    }

    onMouseUp() {
        if(this.dragController.isDraggingObject){
            this.subject.changeData();
        }

        this.isDraggingCanvas = false;
        this.dragController.isDraggingObject = false;
        this.dragController.draggedObject = null;

        if(!this.dragModeIsActive) return;

        this.viewport.style.cursor = 'grab';
    }

    updateTransform() {
        this.canvas.style.transform = `
            translate(${this.x}px, ${this.y}px)
            scale(${this.scale})
        `;

        this.canvas.style.transformOrigin = '0 0';
    }
}