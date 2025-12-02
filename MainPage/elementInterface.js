function saveElementData(element, storageKey = 'elementData') {
    const data = {
        tagName: element.tagName.toLowerCase(),
        id: element.id || null,
        className: element.className || null,
        text: element.textContent.trim() || null,
        attributes: {},
        children: []
    };
    
    Array.from(element.attributes).forEach(attr => {
        data.attributes[attr.name] = attr.value;
    });
    
    if (element.children.length > 0) {
        data.children = Array.from(element.children).map(child => 
        saveElementData(child, null)
        );
    }
    
    if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(data, null, 2));
    }
    
    return data;
}

function restoreElementFromData(data) {
    const element = document.createElement(data.tagName);
    
    if (data.id) {
        element.id = data.id;
    }
    
    if (data.className) {
        element.className = data.className;
    }
    
    if (data.attributes) {
        for (const [name, value] of Object.entries(data.attributes)) {
            if (name !== 'id' && name !== 'class') {
                element.setAttribute(name, value);
            }
        }
    }
    
    if (data.text && (!data.children || data.children.length === 0)) {
        element.textContent = data.text;
    }
    
    if (data.children && data.children.length > 0) {
        data.children.forEach(childData => {
            const childElement = restoreElementFromData(childData);
            element.appendChild(childElement);
        });
    }
    
    return element;
}

function loadAndRestoreElement(storageKey = 'elementData', targetElement = null) {
    const savedData = localStorage.getItem(storageKey);
    
    if (!savedData) {
        console.warn(`No data found for key: ${storageKey}`);
        return null;
    }
    
    try {
        const data = JSON.parse(savedData);
        const restoredElement = restoreElementFromData(data);
        
        if (targetElement) {
            if (typeof targetElement === 'string') {
                const container = document.querySelector(targetElement);
                if (container) {
                    container.appendChild(restoredElement);
                }
            } else if (targetElement instanceof Element) {
                targetElement.appendChild(restoredElement);
            }
        }
        
        return restoredElement;
    } catch (error) {
        console.error('Error parsing or restoring element data:', error);
        return null;
    }
}

