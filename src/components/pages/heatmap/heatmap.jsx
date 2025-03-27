import * as d3 from "d3";
import { useState, useEffect, useRef, useMemo } from "react";
import groupDataIntoGrid from "./grid";

const Heatmap = () => {
    const svgRef = useRef();
    const imgPath = "/floorplan.jpg";
    const dataPath = "/Ldata.csv";

    const originalWidth = 1742;
    const originalHeight = 1472;

    const [factor, setFactor] = useState(50);
    const [opacity, setOpacity] = useState(0.5);
    const [data, setData] = useState([]);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [grid, setGrid] = useState(true);  // Default style: grid
    const [contour, setContour] = useState(false);

    const offsetRef = useRef({ x: 0, y: 0 });
    const gridSize = 15; // Smaller for smoother heatmap

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const svgWidth = Math.min(originalWidth, windowSize.width * 0.9);
    const svgHeight = (svgWidth / originalWidth) * originalHeight;

    const width = (originalWidth * factor) / 100;
    const height = (originalHeight * factor) / 100;

    useEffect(() => {
        d3.csv(dataPath).then(rawData => {
            setData(rawData.map(d => ({ x: +d.Predicted_x, y: +d.Predicted_y })));
        });
    }, []);

    const scaledData = useMemo(() => data.map(d => ({
        x: (d.x * factor) / 100,
        y: (d.y * factor) / 100
    })), [data, factor]);

    const groupedData = useMemo(() => groupDataIntoGrid(data, gridSize, originalWidth, originalHeight), [data, gridSize]);

    const densityData = useMemo(() => {
        if (scaledData.length === 0) return [];
        return d3.contourDensity()
            .x(d => d.x)
            .y(d => d.y)
            .size([width, height])
            .bandwidth(30)
            .thresholds(20)
            (scaledData);
    }, [scaledData, width, height]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg.append("g")
            .attr("transform", `translate(${offsetRef.current.x}, ${offsetRef.current.y})`);

        g.append("image")
            .attr("href", imgPath)
            .attr("width", width)
            .attr("height", height);

        if (grid) {
            const maxWeight = d3.max(groupedData, d => d.weight);
            const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, maxWeight]);

            g.selectAll(".heat-cell")
                .data(groupedData)
                .enter()
                .append("rect")
                .attr("x", d => (d.x * factor) / 100)
                .attr("y", d => (d.y * factor) / 100)
                .attr("width", (gridSize * factor) / 100)
                .attr("height", (gridSize * factor) / 100)
                .attr("fill", d => colorScale(d.weight))
                .attr("opacity", opacity)
                .attr("class", "heatmap-path");
        }

        if (contour) {
            const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
                .domain([0, d3.max(densityData, d => d.value)]);

            g.selectAll(".heatmap-path")
                .data(densityData)
                .enter()
                .append("path")
                .attr("d", d3.geoPath())
                .attr("fill", d => colorScale(d.value))
                .attr("opacity", opacity)
                .attr("class", "heatmap-path");
        }

        const dragBehavior = d3.drag().on("drag", event => {
            offsetRef.current.x += event.dx;
            offsetRef.current.y += event.dy;
            g.attr("transform", `translate(${offsetRef.current.x}, ${offsetRef.current.y})`);
        });

        g.call(dragBehavior);
    }, [densityData, groupedData, width, height, opacity, grid, factor]);

    useEffect(() => {
        d3.selectAll(".heatmap-path")
            .transition()
            .duration(500)
            .style("opacity", opacity);
    }, [opacity]);

    return (
        <>
            <h1>Heatmap Visualization</h1>
            <div className="space-x-4">
                <button
                    onClick={() => { setGrid(true); setContour(false); }}
                    className={`px-4 py-2 rounded ${grid ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Grid
                </button>
                <button onClick={() => { setContour(true); setGrid(false); }}
                    className={`px-4 py-2 rounded ${contour ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Contour
                </button>

                <div className="mx-4">
                    Size: {factor}%
                    <input type="range" min="10" max="200" step="10" value={factor}
                        onChange={e => setFactor(+e.target.value)}
                    />
                </div>
                <label>Opacity: {(opacity * 100).toFixed(0)}%</label>
                <input type="range" min="0.1" max="1" step="0.1" value={opacity}
                    onChange={e => setOpacity(+e.target.value)}
                />
            </div>
            <svg ref={svgRef} width={svgWidth} height={svgHeight}></svg>
        </>
    );
};

export default Heatmap;
