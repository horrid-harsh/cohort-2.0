import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as d3 from "d3";
import { getGraphApi } from "../features/graph/services/graph.service";
import PageWrapper from "../components/layout/PageWrapper";
import Topbar from "../components/layout/Topbar";
import styles from "./GraphPage.module.scss";

const TYPE_COLORS = {
  article: "#378ADD",
  video:   "#D85A30",
  tweet:   "#1D9E75",
  pdf:     "#f87171",
  image:   "#D4537E",
  link:    "#666666",
};

const GraphPage = () => {
  const svgRef = useRef(null);
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, node: null });
  const [stats, setStats] = useState({ nodes: 0, links: 0 });

  const { data, isLoading } = useQuery({
    queryKey: ["graph"],
    queryFn: getGraphApi,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!data || !svgRef.current) return;
    if (!data.nodes.length) return;

    setStats({ nodes: data.nodes.length, links: data.links.length });

    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Zoom + pan
    const g = svg.append("g");

    svg.call(
      d3.zoom()
        .scaleExtent([0.2, 3])
        .on("zoom", (event) => g.attr("transform", event.transform))
    );

    // Deep copy to avoid D3 mutating original data
    const nodes = data.nodes.map((n) => ({ ...n }));
    const links = data.links.map((l) => ({ ...l }));

    // Force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links)
        .id((d) => d.id)
        .distance((d) => 120 - d.sharedTags * 20) // closer = more shared tags
        .strength(0.3)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    const linkLayer = g.append("g").attr("class", "links");
    const nodeLayer = g.append("g").attr("class", "nodes");

    // Draw links
    const link = linkLayer
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(255,255,255,0.15)")
      .attr("stroke-width", (d) => Math.min(d.sharedTags * 1.5, 4));

    // Draw node groups
    const node = nodeLayer
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(
        d3.drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node content wrapper for scaling
    const nodeContent = node.append("g").attr("class", "node-content");

    // Node circle
    nodeContent
      .append("circle")
      .attr("r", (d) => 12 + d.tags.length * 1.5) // slightly adjusted size
      .attr("fill", (d) => TYPE_COLORS[d.type] || TYPE_COLORS.link)
      .attr("stroke", "rgba(255,255,255,0.1)")
      .attr("stroke-width", 1.5);

    // Node type letter
    nodeContent
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .attr("fill", "#ffffff") // White text for contrast
      .text((d) => {
        const typeMap = { article: "A", video: "V", tweet: "T", pdf: "P", image: "I", link: "L" };
        return typeMap[d.type] || "L";
      });

    // Hover events
    node
      .on("mouseenter", (event, d) => {
        const group = d3.select(event.currentTarget);
        
        // Scale up the content
        group.select(".node-content")
          .transition()
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr("transform", "scale(1.25)");

        // Highlight the circle
        group.select("circle")
          .transition()
          .duration(200)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2)
          .attr("filter", "drop-shadow(0 0 8px rgba(255,255,255,0.3))");

        const rect = svgRef.current.getBoundingClientRect();
        setTooltip({
          visible: true,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 10,
          node: d,
        });
      })
      .on("mousemove", (event) => {
        const rect = svgRef.current.getBoundingClientRect();
        setTooltip((prev) => ({
          ...prev,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 10,
        }));
      })
      .on("mouseleave", (event) => {
        const group = d3.select(event.currentTarget);
        
        // Scale back down
        group.select(".node-content")
          .transition()
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr("transform", "scale(1)");

        // Reset circle highlight
        group.select("circle")
          .transition()
          .duration(200)
          .attr("stroke", "rgba(255,255,255,0.1)")
          .attr("stroke-width", 1.5)
          .attr("filter", null);

        setTooltip({ visible: false, x: 0, y: 0, node: null });
      })
      .on("click", (event, d) => {
        navigate(`/saves/${d.id}`);
      });

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [data]);

  return (
    <PageWrapper>
      <Topbar />
      <div className={styles.page}>
        <div className={`${styles.header} no-select`}>
          <div className={styles.headerLeft}>
            <h1>Knowledge graph</h1>
            <p>Saves connected by shared tags</p>
          </div>
          {!isLoading && (
            <div className={styles.statsRow}>
              <span className={styles.stat}>{stats.nodes} saves</span>
              <span className={styles.statDot} />
              <span className={styles.stat}>{stats.links} connections</span>
            </div>
          )}
        </div>

        <div className={styles.canvas}>
          {isLoading && (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Building your knowledge graph...</p>
            </div>
          )}

          {!isLoading && data?.nodes.length === 0 && (
            <div className={styles.emptyState}>
              <p>No connections yet.</p>
              <span>Save more URLs and add tags to see your knowledge graph.</span>
            </div>
          )}

          <svg ref={svgRef} className={`${styles.svg} no-select`} />

          {tooltip.visible && tooltip.node && (
            <div
              className={styles.tooltip}
              style={{ left: tooltip.x + 12, top: tooltip.y }}
            >
              <div className={styles.tooltipTitle}>
                {tooltip.node.title?.slice(0, 60) || tooltip.node.url}
              </div>
              <div className={styles.tooltipMeta}>
                <span>{tooltip.node.siteName}</span>
                {tooltip.node.tags.length > 0 && (
                  <div className={styles.tooltipTags}>
                    {tooltip.node.tags.slice(0, 3).map((t) => (
                      <span
                        key={t.id}
                        className={styles.tooltipTag}
                        style={{ color: t.color, borderColor: `${t.color}40` }}
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={`${styles.legend} no-select`}>
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <div key={type} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: color }} />
              <span>{type}</span>
            </div>
          ))}
          <div className={styles.legendHint}>Scroll to zoom · Drag to pan · Click to open</div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default GraphPage;