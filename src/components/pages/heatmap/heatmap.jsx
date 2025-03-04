import * as d3 from "d3";
import { useState, useEffect, useRef, useMemo } from "react";


const Heatmap = () => {
    const imgPath = "/floorplan.jpg";
    const dataPath = "/Ldata.csv";

    // Original dimensions
    const originalWidth = 1742;
    const originalHeight = 1472;

    // State variables
    const [factor, setFactor] = useState(50); // 50% default scale
    const [opacity, setOpacity] = useState(0.1); // 10% default opacity
    const [data, setData] = useState([]);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Handle Window Resize
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        console.log(windowSize);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const svgWidth = Math.min(originalWidth, windowSize.width * 0.9);  // 90% of window width
    const svgHeight = (svgWidth / originalWidth) * originalHeight; // Maintain aspect ratio

    const svgRef = useRef();
    const offsetRef = useRef({ x: 0, y: 0 });
    
    // load data
    useEffect(() => {
        d3.csv(dataPath).then(rawData => {
            const parsedData = rawData.map(d => {
                return {
                    x: +d.Predicted_x,
                    y: +d.Predicted_y
                }
            })
            setData(parsedData);
        })
    }, []);

    // Refactor position data
    const scaledData = useMemo(() => {
        console.log("refactor data");
        return data.map(d => [d.x * factor / 100, d.y * factor / 100]);
    }, [data, factor]);

    // Dynamically calculate width & height based on factor
    const width = (originalWidth * factor) / 100;
    const height = (originalHeight * factor) / 100;

    const densityData = useMemo(() => {
        if (scaledData.length === 0) return [];

        console.log('calculate density data');
        return d3.contourDensity()
            .x(d => d[0])
            .y(d => d[1])
            .size([width, height])
            .bandwidth(30) // 🔥 Adjust blur/spread of heat
            .thresholds(20) // 🔥 Number of heatmap levels
            (scaledData);
    }, [scaledData, width, height])

    useEffect(() => {
        if (!densityData.length) return;
    
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous elements
    
        // Append a group (<g>) that will be draggable.
        const g = svg.append("g");
    
        // Append the floor plan image inside the group
        g.append("image")
          .attr("href", imgPath)
          .attr("width", width)
          .attr("height", height);
    
        const colorScale = d3
          .scaleSequential(d3.interpolateYlOrRd) // Yellow → Red gradient
          .domain([0, d3.max(densityData, (d) => d.value)]);
    
        // Draw heatmap paths within the group
        g.selectAll("path")
          .data(densityData)
          .enter()
          .append("path")
          .attr("d", d3.geoPath())
          .attr("fill", (d) => colorScale(d.value))
          .attr("stroke", "none")
          .attr("class", "heatmap-path")
          .style("opacity", opacity);
    
        // Define drag behavior for the group
        const dragBehavior = d3
          .drag()
          .on("drag", (event) => {
            // Update offset using event.dx and event.dy
            offsetRef.current.x += event.dx;
            offsetRef.current.y += event.dy;
            // Apply translation to the group element
            g.attr(
              "transform",
              `translate(${offsetRef.current.x}, ${offsetRef.current.y})`
            );
          });
    
        // Attach drag behavior to the group
        g.call(dragBehavior);
      }, [densityData, width, height]);

    // Update opacity based on slider input
    useEffect(() => {
        d3.selectAll(".heatmap-path")
            .transition()
            .duration(500)
            .style("opacity", opacity);
    }, [opacity]);

    return (
        <div>
            <h1>This is Heatmap</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label>Size: {factor}%</label>
                <input
                    type="range"
                    min="10" max="200" step="10"
                    value={factor}
                    onChange={(e) => setFactor(Number(e.target.value))}
                />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label>Opacity: {opacity}%</label>
                <input
                    type="range"
                    min="0.1" max="1" step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                />
            </div>
            <svg ref={svgRef} width={svgWidth} height={svgHeight} style={{ border: "2px solid black" }} />
        </div>


    )
}

export default Heatmap;