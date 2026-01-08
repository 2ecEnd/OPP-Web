import type { Task } from "../Task.js";
import type { TaskView } from "../TaskView.js";
import type { Canvas } from "./Canvas.js";
import { GeometryController, type Point } from "./GeometryController.js";

export interface LinkData{
    line: SVGLineElement,
    startTask: TaskView;
    endTask: TaskView;
}

export class LinkController{
    private canvas: Canvas
    public linkingMode: boolean;
    public deletinglinksMode: boolean;
    public linkingStartTask: TaskView | null;
    public tempLine: SVGElement | null;
    public links: LinkData[];
    public editingLinks: LinkData[];
    public selectedLink: HTMLElement | null;

    constructor(canvas: Canvas){
        this.canvas = canvas;
        this.linkingMode = false;
        this.deletinglinksMode = false;
        this.linkingStartTask = null;
        this.tempLine = null;

        this.links = [];
        this.editingLinks = [];
        this.selectedLink = null;

        this.initArrowMarker();
        this.initLinkingEvents();
    }
    
    initArrowMarker(): void {
        let svg = this.canvas.connectionsLayer;
        if (!svg) return;
        
        let defs = svg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svg.insertBefore(defs, svg.firstChild);
        }
        
        if (!defs.querySelector('#arrowhead')) {
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
            marker.id = 'arrowhead';
            marker.setAttribute('markerWidth', '10');
            marker.setAttribute('markerHeight', '7');
            marker.setAttribute('refX', '9');
            marker.setAttribute('refY', '3.5');
            marker.setAttribute('orient', 'auto');
            
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
            polygon.setAttribute('fill', '#ffffff');
            
            marker.appendChild(polygon);
            defs.appendChild(marker);
        }
    }

    initLinkingEvents(): void{
        document.addEventListener('mousemove', this.updateTempLine.bind(this));

        document.addEventListener('mousemove', (e) => {
            if (!this.deletinglinksMode) return;
            
            const linkElement: HTMLElement | null = (e.target as HTMLElement).closest('.link-line');
            if(!linkElement) return;

            this.highlightLink(linkElement);
        });

        document.addEventListener('mouseup', (e) => {
            if (!this.deletinglinksMode) return;
            
            const linkElement: SVGLineElement | null = (e.target as HTMLElement).closest('.link-line');
            if(!linkElement) return;

            this.deleteLink(linkElement);
            this.deletinglinksMode = false;
        });
    }

    enableDeletingLinksMode(task: Task): void{
        this.deletinglinksMode = true;
    }

    deleteLink(linkElement: SVGLineElement): void {
        for(let i = 0; i < this.links.length; i++){
            let l = this.links[i];
            if(l?.line == linkElement){
                l.startTask.model.deleteDependency(l.endTask.model);
                this.canvas.connectionsLayer.removeChild(linkElement);
                this.links.splice(i, 1);
                break;
            }
        }
        
    }

    highlightLink(linkElement: HTMLElement): void {
        document.querySelectorAll('.link-line').forEach((link: Element) => {
            (link as SVGElement).style.strokeWidth = '2';
            (link as SVGElement).style.stroke = '#ffffff';
        });
        
        if (linkElement) {
            linkElement.style.strokeWidth = '4';
            linkElement.style.stroke = '#ff4444';
            this.selectedLink = linkElement;
        } else {
            this.selectedLink = null;
        }
    }

    startLinking(task: TaskView): void {
        this.linkingMode = true;
        this.linkingStartTask = task;
        this.canvas.viewport.style.cursor = 'crosshair';
        
        this.tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.tempLine.classList.add('temp-line');
        this.canvas.connectionsLayer.appendChild(this.tempLine);
    }

    updateTempLine(e: MouseEvent): void{
        if (!this.linkingMode || !this.linkingStartTask || !this.tempLine) return;

        const start: Point = GeometryController.getCenter(this.linkingStartTask.container);

        const canvasRect = this.canvas.canvas.getBoundingClientRect();

        const mouseX = (e.clientX - canvasRect.left) / this.canvas.scale;
        const mouseY = (e.clientY - canvasRect.top) / this.canvas.scale;

        this.tempLine.setAttribute('x1', start.x.toString());
        this.tempLine.setAttribute('y1', start.y.toString());
        this.tempLine.setAttribute('x2', mouseX.toString());
        this.tempLine.setAttribute('y2', mouseY.toString());
    }

    linkTasks(targetTaskDom: HTMLElement): void{
        if (!this.linkingMode || !this.linkingStartTask) return;

        const targetTask = this.canvas.taskViews.find(taskView => taskView.container.id === targetTaskDom.id)

        if(!this.validateLinking(this.linkingStartTask, targetTask!)){
            this.stopLinking();
            alert("Нельзя связать с этой задачей");
            return;
        }

        this.linkingStartTask.model.addDependency(targetTask!.model);

        this.canvas.connectionsLayer.appendChild(this.createLine(this.linkingStartTask, targetTask!));
        this.canvas.subject.changeData();
        this.stopLinking();
    }

    validateLinking(startTask: TaskView, endTask: TaskView): boolean{
        if(startTask.model.id === endTask.model.id) return false;
        if (endTask.model.dependsOn.some(taskId => taskId === startTask.model.id)) return false;
        if (startTask.model.dependsOn.some(taskId => taskId === endTask.model.id)) return false;

        const visited: string[] = [endTask.model.id];
        const stack: string[] = [...endTask.model.dependsOn];
        while(stack.length > 0){
            const currentTaskId: string = stack.pop()!;

            if(currentTaskId === startTask.model.id) return false;
            visited.push(currentTaskId);

            const currentTask = this.canvas.subject.getTask(currentTaskId);
            currentTask!.dependsOn.forEach((id: string) => {
                if(!visited.some(x => x === id)){
                    stack.push(id);
                }
            });
        }

        return true;
    }

    createLine(startTask: TaskView, endTask: TaskView): SVGElement{
        const svgNS = 'http://www.w3.org/2000/svg';
        const newLinkLine = document.createElementNS(svgNS, 'line');
        newLinkLine.classList.add('link-line');

        const start = GeometryController.getCenter(startTask.container);
        const end = GeometryController.getCenter(endTask.container);

        const edgePoint = GeometryController.getEdgePoint(start, end, endTask.container);

        newLinkLine.setAttribute('x1', start.x.toString());
        newLinkLine.setAttribute('y1', start.y.toString());
        newLinkLine.setAttribute('x2', edgePoint.x.toString());
        newLinkLine.setAttribute('y2', edgePoint.y.toString());

        newLinkLine.setAttribute('marker-end', 'url(#arrowhead)');

        this.links.push({
            line: newLinkLine,
            startTask: startTask,
            endTask: endTask
        });
        return newLinkLine;
    }

    stopLinking(){
        this.linkingMode = false;
        this.linkingStartTask = null;
        this.canvas.viewport.style.cursor = 'default';

        this.tempLine!.remove();
        this.tempLine = null;
    }
}