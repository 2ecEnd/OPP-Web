import type { Task } from "../Task.js";
import type { Canvas } from "./Canvas.js";
import { GeometryController, type Point } from "./GeometryController.js";

export interface LinkData{
    line: SVGLineElement,
    startTask: Task;
    endTask: Task;
}

export class LinkController{
    private canvas: Canvas
    public linkingMode: boolean;
    public deletinglinksMode: boolean;
    public linkingStartTask: Task | null;
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
    }

    enableDeletingLinksMode(task: Task): void{
        this.deletinglinksMode = true;
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

    startLinking(task: Task): void {
        this.linkingMode = true;
        this.linkingStartTask = task;
        this.canvas.viewport.style.cursor = 'crosshair';
        
        this.tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.tempLine.classList.add('temp-line');
        this.canvas.connectionsLayer.appendChild(this.tempLine);
    }

    updateTempLine(e: MouseEvent): void{
        if (!this.linkingMode || !this.linkingStartTask || !this.linkingStartTask.view.container || !this.tempLine) return;

        const start: Point = GeometryController.getCenter(this.linkingStartTask.view.container);

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

        const targetTask = this.canvas.subject.getTask(targetTaskDom.id)

        if(!this.validateLinking(this.linkingStartTask, targetTask!)){
            this.stopLinking();
            alert("Нельзя связать с этой задачей");
            return;
        }

        this.linkingStartTask.addDependency(targetTask!);

        this.canvas.connectionsLayer.appendChild(this.createLine(this.linkingStartTask, targetTask!));
        this.canvas.subject.changeData();
        this.stopLinking();
    }

    validateLinking(startTask: Task, endTask: Task): boolean{
        if(startTask.id === endTask.id) return false;
        if (endTask.dependsOn.some(taskId => taskId === startTask.id)) return false;
        if (startTask.dependsOn.some(taskId => taskId === endTask.id)) return false;

        const visited: string[] = [endTask.id];
        const stack: string[] = [...endTask.dependsOn];
        while(stack.length > 0){
            const currentTaskId: string = stack.pop()!;

            if(currentTaskId === startTask.id) return false;
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

    createLine(startTask: Task, endTask: Task): SVGElement{
        const svgNS = 'http://www.w3.org/2000/svg';
        const newLinkLine = document.createElementNS(svgNS, 'line');
        newLinkLine.classList.add('link-line');

        const start = GeometryController.getCenter(startTask.view.container!);
        const end = GeometryController.getCenter(endTask.view.container!);

        const edgePoint = GeometryController.getEdgePoint(start, end, endTask.view.container!);

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