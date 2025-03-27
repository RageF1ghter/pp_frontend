function groupDataIntoGrid (data, gridSize) {

    const gridMap = new Map();

    data.forEach(({ x, y }) => {
        const gridX = Math.floor(x / gridSize) * gridSize;
        const gridY = Math.floor(y / gridSize) * gridSize;
        const key = `${gridX}-${gridY}`;

        if (!gridMap.has(key)) {
            gridMap.set(key, { x: gridX, y: gridY, weight: 0 });
        }
        gridMap.get(key).weight += 1;
    });

    return Array.from(gridMap.values());
};

export default groupDataIntoGrid;
