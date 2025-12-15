class Canvas{
    static LinkData = class {
        constructor(line, startTask, endTask){
            this.line = line;
            this.startTask = startTask;
            this.endTask = endTask;
        }
    }

    constructor(subject){
        this.subject = subject;

        this.viewport = document.getElementById('viewport');
        this.canvas = document.getElementById('canvas');
        this.connectionsLayer = document.getElementById('connections-layer');
        
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

        this.objectLastX = 0;
        this.objectLastY = 0;

        this.isDraggingObject = false;
        this.linkingMode = false;

        this.draggedObject = null;
        this.draggedTask = null;
        this.linkingStartTask = null;
        this.tempLine = null;

        this.links = [];
        this.editingLinks = [];
        
        this.init();
    }

    init() {
        this.initCanvasEvents();
        this.initObjectsEvents();
        this.updateTransform();
        this.initLinkingEvents();
        this.initExistingTasks();
        this.initArrowMarker();
    }

    initArrowMarker() {
        let svg = this.connectionsLayer;
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

    initExistingTasks(){
        this.subject.tasks.forEach(task => {
            this.canvas.appendChild(task.createDom());
        });
    }

    initLinkingEvents(){
        document.addEventListener('mousemove', this.updateTempLine.bind(this));
    }

    initCanvasEvents(){
        this.viewport.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.viewport.addEventListener('wheel', this.onWheel.bind(this));

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    initObjectsEvents(){
        this.canvas.addEventListener('mousedown', this.onObjectMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onObjectMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onWheel(e) {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -1 : 1;
        
        this.zoom(delta, e.clientX, e.clientY);
    }

    zoom(delta, clientX, clientY) {
        const oldScale = this.scale;
        
        this.scale += delta * this.scaleStep;
        this.scale = Math.min(Math.max(this.scale, this.minScale), this.maxScale);
        
        if (oldScale === this.scale) return;
        
        const rect = this.viewport.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        
        const canvasX = (mouseX - this.x) / oldScale;
        const canvasY = (mouseY - this.y) / oldScale;
        
        this.x = mouseX - canvasX * this.scale;
        this.y = mouseY - canvasY * this.scale;
        
        this.updateTransform();
    }

    onKeyDown(e){
        if (e.code === 'Space' && !this.dragModeIsActive){
            this.dragModeIsActive = true;
            this.viewport.style.cursor = 'grab';
        }
    }

    onKeyUp(e){
        if (e.code === 'Space'){
            this.dragModeIsActive = false;
            this.isDraggingCanvas = false;
            this.viewport.style.cursor = 'default';
        }
    }

    onObjectMouseDown(e){
        if(this.dragModeIsActive) return;

        const target = e.target.closest('.draggable');
        if (!target) return;

        e.preventDefault();
        e.stopPropagation();
        
        if (!this.linkingMode){
            this.isDraggingObject = true;
            this.objectLastX = e.clientX;
            this.objectLastY = e.clientY;
            this.draggedObject = target;
            this.editingLinks = [];

            this.draggedTask = this.subject.getTask(this.draggedObject.id);
            if (!this.draggedTask) return;
            
            this.links.forEach(link => {
                if(link.startTask === this.draggedTask || link.endTask === this.draggedTask) this.editingLinks.push(link);
            });
        }
        else this.linkTasks(target);
    }

    onObjectMouseMove(e){
        if(!this.isDraggingObject || this.dragModeIsActive || !this.draggedObject) return;

        const deltaX = (e.clientX - this.objectLastX) / this.scale;
        const deltaY = (e.clientY - this.objectLastY) / this.scale;

        var x = parseInt(this.draggedObject.dataset.x) + deltaX;
        var y = parseInt(this.draggedObject.dataset.y) + deltaY;

        this.objectLastX = e.clientX;
        this.objectLastY = e.clientY;

        this.draggedObject.style.transform = `
            translate(${x}px, ${y}px)
        `;
        this.draggedObject.dataset.x = x;
        this.draggedObject.dataset.y = y;

        this.editingLinks.forEach(link => {
            const start = this.getCenter(link.startTask.container);
            const end = this.getCenter(link.endTask.container);
            const edgePoint = this.getEdgePoint(start, end, link.endTask.container)

            if (this.draggedTask === link.startTask){
                const center = this.getCenter(this.draggedObject);

                link.line.setAttribute('x1', center.x);
                link.line.setAttribute('y1', center.y);
                link.line.setAttribute('x2', edgePoint.x);
                link.line.setAttribute('y2', edgePoint.y);
            }
            else{
                link.line.setAttribute('x2', edgePoint.x);
                link.line.setAttribute('y2', edgePoint.y);
            }
        });
    }

    onMouseDown(e) {
        if(this.linkingMode) this.stopLinking();
        if(!this.dragModeIsActive) return;

        e.preventDefault();
        
        this.isDraggingCanvas = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.viewport.style.cursor = 'grabbing';
    }

    onMouseMove(e) {
        if (!this.isDraggingCanvas || !this.dragModeIsActive) return;
        
        const deltaX = e.clientX - this.lastX;
        const deltaY = e.clientY - this.lastY;
        
        this.x += deltaX;
        this.y += deltaY;
        
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        
        this.updateTransform();
    }

    onMouseUp() {
        this.isDraggingCanvas = false;
        this.isDraggingObject = false;
        this.draggedObject = null;

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

    startLinking(task) {
        this.linkingMode = true;
        this.linkingStartTask = task;
        this.viewport.style.cursor = 'crosshair';
        
        this.tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.tempLine.classList.add('temp-line');
        this.connectionsLayer.appendChild(this.tempLine);
    }

    updateTempLine(e){
        if (!this.linkingMode) return;

        const start = this.getCenter(this.linkingStartTask.container);

        const canvasRect = this.canvas.getBoundingClientRect();

        const mouseX = (e.clientX - canvasRect.left) / this.scale;
        const mouseY = (e.clientY - canvasRect.top) / this.scale;

        this.tempLine.setAttribute('x1', start.x);
        this.tempLine.setAttribute('y1', start.y);
        this.tempLine.setAttribute('x2', mouseX);
        this.tempLine.setAttribute('y2', mouseY);
    }

    linkTasks(targetTaskDom){
        if (!this.linkingMode) return;

        const targetTask = this.subject.getTask(targetTaskDom.id)

        if(!this.validateLinking(this.linkingStartTask, targetTask)){
            this.stopLinking();
            alert("Нельзя связать с этой задачей");
            return;
        }

        this.linkingStartTask.addDependency(targetTask);

        this.connectionsLayer.appendChild(this.createLine(this.linkingStartTask, targetTask));
        this.stopLinking();
    }

    validateLinking(startTask, endTask){
        if(startTask.id === endTask.id) return false;
        if (endTask.dependsOn.some(task => task.id === startTask.id)) return false;
        if (startTask.dependsOn.some(task => task.id === endTask.id)) return false;

        const visited = [endTask];
        const stack = [...endTask.dependsOn];
        while(stack.length > 0){
            const currentTask = stack.pop();

            if(currentTask.id === startTask.id) return false;
            visited.push(currentTask);

            currentTask.dependsOn.forEach(t => {
                if(!visited.some(x => x.id === t.id)){
                    stack.push(t);
                }
            });
        }

        return true;
    }

    createLine(startTask, endTask){
        const svgNS = 'http://www.w3.org/2000/svg';
        const newLinkLine = document.createElementNS(svgNS, 'line');
        newLinkLine.classList.add('link-line');

        const start = this.getCenter(startTask.container);
        const end = this.getCenter(endTask.container);

        const edgePoint = this.getEdgePoint(start, end, endTask.container);

        newLinkLine.setAttribute('x1', start.x);
        newLinkLine.setAttribute('y1', start.y);
        newLinkLine.setAttribute('x2', edgePoint.x);
        newLinkLine.setAttribute('y2', edgePoint.y);

        newLinkLine.setAttribute('marker-end', 'url(#arrowhead)');
        console.log(this.calculateAngleDegrees(start, end));

        this.links.push(new Canvas.LinkData(newLinkLine, startTask, endTask));
        return newLinkLine;
    }

    stopLinking(){
        this.linkingMode = false;
        this.linkingStartTask = null;
        this.viewport.style.cursor = 'default';

        this.tempLine.remove();
        this.tempLine = null;
    }

    getCenter(element) {
        const left = parseInt(element.dataset.x) || 0;
        const top = parseInt(element.dataset.y) || 0;
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        
        return {
            x: left + width / 2,
            y: top + height / 2
        };
    }

    getEdgePoint(start, end, element){
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const left = parseInt(element.dataset.x) || 0;
        const top = parseInt(element.dataset.y) || 0;

        const angle = this.calculateAngleDegrees(start, end);
        const line1 = {
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y
        };
        let line2 = null;

        if(angle <= 42 || angle > 317.5){
            const bottom = top + height;

            line2 = {
                x1: left,
                y1: top,
                x2: left,
                y2: bottom
            };
            return this.findLineIntersection(line1, line2);
        }
        else if(angle > 42 && angle <= 138){
            const right = left + width;

            line2 = {
                x1: left,
                y1: top,
                x2: right,
                y2: top
            };
            return this.findLineIntersection(line1, line2);
        }
        else if(angle > 138 && angle <= 223){
            const right = left + width;
            const bottom = top + height;

            line2 = {
                x1: right,
                y1: top,
                x2: right,
                y2: bottom
            };
            return this.findLineIntersection(line1, line2);
        }
        else if(angle > 223 && angle <= 317.5){
            const right = left + width;
            const bottom = top + height;

            line2 = {
                x1: left,
                y1: bottom,
                x2: right,
                y2: bottom
            };
            return this.findLineIntersection(line1, line2);
        }
        
        return this.getCenter(element);
    }

    calculateAngleDegrees(start, end) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        
        const radians = Math.atan2(dy, dx);
        const degrees = radians * (180 / Math.PI);
        
        return (degrees + 360) % 360;
    }

    findLineIntersection(line1, line2){
        const A1 = line1.y2 - line1.y1;
        const B1 = line1.x1 - line1.x2;
        const C1 = A1 * line1.x1 + B1 * line1.y1;

        const A2 = line2.y2 - line2.y1;
        const B2 = line2.x1 - line2.x2;
        const C2 = A2 * line2.x1 + B2 * line2.y2;

        const determinant = A1 * B2 - A2 * B1;

        const x = (B2 * C1 - B1 * C2) / determinant;
        const y = (A1 * C2 - A2 * C1) / determinant;
        
        return { x, y };
    }
}

var canvas = null;