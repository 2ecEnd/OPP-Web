import type { TaskView } from "../TaskView.js";
import type { Canvas } from "./Canvas.js";
import { GeometryController } from "./GeometryController.js";

export class DragController{
    private canvas: Canvas
    public isDraggingObject: boolean;
    public draggedObject: HTMLElement | null;
    private draggedTask: TaskView | null | undefined;
    private objectLastX: number;
    private objectLastY: number;
    
    constructor(canvas: Canvas){
        this.canvas = canvas;
        this.isDraggingObject = false;
        this.draggedObject = null;
        this.draggedTask = null;
        this.objectLastX = 0;
        this.objectLastY = 0;

        this.initObjectsEvents();
    }


    initObjectsEvents(): void{
        this.canvas.canvas.addEventListener('mousedown', this.onObjectMouseDown.bind(this));
        this.canvas.canvas.addEventListener('mousemove', this.onObjectMouseMove.bind(this));
    }

    onObjectMouseDown(e: MouseEvent): void{
        if(this.canvas.dragModeIsActive) return;

        const target: HTMLElement | null = (e.target as HTMLElement).closest('.draggable');
        if (!target) return;

        e.preventDefault();
        e.stopPropagation();
        
        if (!this.canvas.linkController.linkingMode){
            this.isDraggingObject = true;
            this.objectLastX = e.clientX;
            this.objectLastY = e.clientY;
            this.draggedObject = target;
            this.canvas.linkController.editingLinks = [];

            this.draggedTask = this.canvas.taskViews.find(view => view.container.id === this.draggedObject!.id);
            if (!this.draggedTask) return;
            
            this.canvas.linkController.links.forEach(link => {
                if(link.startTask === this.draggedTask || link.endTask === this.draggedTask) this.canvas.linkController.editingLinks.push(link);
            });
        }
        else this.canvas.linkController.linkTasks(target);
    }

    onObjectMouseMove(e: MouseEvent): void{
        if(!this.isDraggingObject || this.canvas.dragModeIsActive || !this.draggedObject || !this.draggedTask) return;

        const deltaX = (e.clientX - this.objectLastX) / this.canvas.scale;
        const deltaY = (e.clientY - this.objectLastY) / this.canvas.scale;

        var x = parseInt(this.draggedObject.dataset.x!) + deltaX;
        var y = parseInt(this.draggedObject.dataset.y!) + deltaY;

        this.objectLastX = e.clientX;
        this.objectLastY = e.clientY;

        this.draggedObject.style.transform = `
            translate(${x}px, ${y}px)
        `;
        this.draggedObject.dataset.x = x.toString();
        this.draggedObject.dataset.y = y.toString();
        this.draggedTask.x = x;
        this.draggedTask.y = y;

        this.canvas.linkController.editingLinks.forEach(link => {
            const start = GeometryController.getCenter(link.startTask.container!);
            const end = GeometryController.getCenter(link.endTask.container!);
            const edgePoint = GeometryController.getEdgePoint(start, end, link.endTask.container!)

            if (this.draggedTask === link.startTask){
                const center = GeometryController.getCenter(this.draggedObject!);

                link.line.setAttribute('x1', center.x.toString());
                link.line.setAttribute('y1', center.y.toString());
                link.line.setAttribute('x2', edgePoint.x.toString());
                link.line.setAttribute('y2', edgePoint.y.toString());
            }
            else{
                link.line.setAttribute('x2', edgePoint.x.toString());
                link.line.setAttribute('y2', edgePoint.y.toString());
            }
        });
    }
}