class Canvas{
    constructor(){
        this.viewport = document.getElementById('viewport');
        this.canvas = document.getElementById('canvas');
        this.connectionsLayer = document.getElementById('connections-layer');
        
        this.x = 0;
        this.y = 0;
        this.dragModeIsActive = false;
        this.isDraggingCanvas = false;
        this.lastX = 0;
        this.lastY = 0;

        this.objectLastX = 0;
        this.objectLastY = 0;

        this.isDraggingObject = false;
        this.linkingMode = false;

        this.draggedObject = null;
        this.linkingStartTask = null;
        
        this.init();
    }

    init() {
        this.initCanvasEvents();
        this.initObjectsEvents();
        this.updateTransform();
        this.initLinkingEvents();
    }

    initLinkingEvents(){
        document.addEventListener('mousemove', this.updateTempLine.bind(this));
    }

    initCanvasEvents(){
        this.viewport.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        //this.viewport.addEventListener('wheel', this.onWheel.bind(this));

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    initObjectsEvents(){
        this.canvas.addEventListener('mousedown', this.onObjectMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onObjectMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
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

        this.isDraggingObject = true;
        this.objectLastX = e.clientX;
        this.objectLastY = e.clientY;
        this.draggedObject = target; 
    }

    onObjectMouseMove(e){
        if(!this.isDraggingObject || this.dragModeIsActive || !this.draggedObject) return;

        const deltaX = e.clientX - this.objectLastX;
        const deltaY = e.clientY - this.objectLastY;

        var x = parseInt(this.draggedObject.style.left) + deltaX;
        var y = parseInt(this.draggedObject.style.top) + deltaY;

        this.objectLastX = e.clientX;
        this.objectLastY = e.clientY;

        this.draggedObject.style.transform = `
            translate(${x}px, ${y}px)
        `;
        this.draggedObject.style.left = x + 'px';
        this.draggedObject.style.top = y + 'px';
    }

    onMouseDown(e) {
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
        `;
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
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;

        this.tempLine.setAttribute('x1', start.x);
        this.tempLine.setAttribute('y1', start.y);
        this.tempLine.setAttribute('x2', mouseX);
        this.tempLine.setAttribute('y2', mouseY);
    }

    getCenter(element) {
        const left = parseInt(element.style.left) || 0;
        const top = parseInt(element.style.top) || 0;
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        
        return {
            x: left + width / 2,
            y: top + height / 2
        };
    }
}

const canvas = new Canvas();