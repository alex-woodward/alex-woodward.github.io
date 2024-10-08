const canvas = document.getElementById('circuitCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20; // Size of each grid cell
const components = []; // Array to store components

// Function to draw the grid
function drawGrid() {
    ctx.strokeStyle = '#ccc';
    for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.strokeRect(x, y, gridSize, gridSize);
        }
    }
}

// Function to add a rectangular component
function addComponents(max, min = 0) {
    let dist = [0, 0, 0];
    let remaining = max; // Track the remaining number of components allowed

    for (let i = 0; i < dist.length; i++) {
        if (remaining <= 0) {
            break; // If no more components can be added, stop the loop early
        }
        const maxForThisSlot = Math.min(remaining, 3)
        dist[i] = Math.floor(Math.random() * (maxForThisSlot + 1));
        remaining -= dist[i];
    }

    // Iterate over the count for each component size
    for (let i = 0; i < dist.length; i++) {
        for (let r = 0; r < dist[i]; r++) {
            // Determine size of component for collision detection (up to 3x3 size)
            const sizeX = Math.floor(Math.random() * 3) + 1; // Random size between 1 and 3
            const sizeY = Math.floor(Math.random() * 3) + 1; // Random size between 1 and 3
            // Choose random location and check collision at least one space away from the edges
            let pos = choosePosition(1, 3);
            if (pos.length != 0) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(pos[0] * gridSize, pos[1] * gridSize, sizeX * gridSize, sizeY * gridSize);
                components.push({ x: pos[0] * gridSize, y: pos[1] * gridSize, width: sizeX * gridSize, height: sizeY * gridSize });
            }
        }
    }
    return true;
}


function choosePosition(margin = 1, buffer = 3) {
    const minX = 0 + margin;
    const maxX = canvas.width / gridSize - margin;
    const minY = 0 + margin;
    const maxY = canvas.height / gridSize - margin;
    let pos = [];

    // Generate random x, y values for component placement
    for (let i = 0; i < maxX || i < maxY; i++) {
        const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

        if (checkCollide(x * gridSize, y * gridSize, buffer) === false) {
            pos = [x, y];
            break;
        }
    }
    return pos;
}

function checkCollide(x, y, buffer) {
    let collisionDetected = false;
    // Check if a point is within the rectangular boundary + buffer of a component or trace
    for (let c of components) {
        if (x + buffer * gridSize < c.x + c.width + buffer * gridSize &&
            x > c.x - buffer * gridSize &&
            y + buffer * gridSize < c.y + c.height + buffer * gridSize &&
            y > c.y - buffer * gridSize) {
            collisionDetected = true;
            break;
        }
    }
    return collisionDetected;
}

// Function to initialize the canvas
function init() {
    // Draw grid
    drawGrid();
    // Add some sample components
    addComponents(5,1); // I changed the max value to 3 to see multiple components
}

init();
