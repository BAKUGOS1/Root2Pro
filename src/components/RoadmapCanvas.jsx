import React, { useState, useEffect } from 'react';
import { getProgress } from '../lib/progressStore.js';

export default function RoadmapCanvas({ graph }) {
  const [progress, setProgress] = useState({});
  const [hoveredNode, setHoveredNode] = useState(null);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setProgress(getProgress());
    
    // Handle resizing for mobile fallback
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const nodeById = new Map(graph.nodes.map(node => [node.id, node]));

  // Calculate dynamic dimensions for the SVG viewport
  const paddingX = 220;
  const paddingY = 100;
  const maxX = Math.max(...graph.nodes.map(node => node.x + paddingX), 780);
  const maxY = Math.max(...graph.nodes.map(node => node.y + paddingY), 480);

  // Visual status config
  const statusStyles = {
    'completed': { stroke: '#10b981', fill: 'url(#completed-grad)', text: '#34d399', glow: 'rgba(16, 185, 129, 0.4)' },
    'in-progress': { stroke: '#f59e0b', fill: 'url(#in-progress-grad)', text: '#fbbf24', glow: 'rgba(245, 158, 11, 0.4)' },
    'needs-review': { stroke: '#8b5cf6', fill: 'url(#needs-review-grad)', text: '#a78bfa', glow: 'rgba(139, 92, 246, 0.4)' },
    'not-started': { stroke: 'rgba(255, 255, 255, 0.1)', fill: 'url(#not-started-grad)', text: '#94a3b8', glow: 'transparent' }
  };

  const getNodeStyle = (nodeId) => {
    const status = progress[nodeId]?.status || 'not-started';
    return statusStyles[status];
  };

  const getEdgeStyle = (edge) => {
    const fromStatus = progress[edge.from]?.status || 'not-started';
    if (fromStatus === 'completed') {
      return { stroke: 'rgba(59, 130, 246, 0.8)', strokeWidth: '2.5', dash: '0' }; // Glowing solid blue connection
    }
    return { stroke: 'rgba(255, 255, 255, 0.08)', strokeWidth: '1.5', dash: '4,4' };
  };

  const checkIsLocked = (nodeId) => {
    const incomingEdges = graph.edges.filter(edge => edge.to === nodeId && (edge.type === 'prerequisite' || edge.type === 'recommended-next'));
    return incomingEdges.some(edge => progress[edge.from]?.status !== 'completed');
  };

  const isMobile = windowWidth < 768;

  if (isMobile) {
    // Mobile Timeline Fallback
    return (
      <div className="card" style={{ padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>{graph.title}</h2>
          <p className="muted" style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{graph.description}</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
          {/* Vertical path line */}
          <div style={{ position: 'absolute', left: 16, top: 20, bottom: 20, width: 2, background: 'rgba(255, 255, 255, 0.05)' }}></div>
          
          {graph.nodes.map((node, idx) => {
            const status = progress[node.id]?.status || 'not-started';
            const style = statusStyles[status];
            const isLocked = checkIsLocked(node.id);
            
            return (
              <a
                key={node.id}
                href={`/topics/${node.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 16,
                  borderRadius: 14,
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: `1px solid ${isLocked ? 'rgba(255, 255, 255, 0.03)' : (status === 'not-started' ? 'rgba(255, 255, 255, 0.05)' : style.stroke)}`,
                  opacity: isLocked ? 0.45 : 1,
                  transition: 'var(--transition-smooth)',
                  zIndex: 1,
                  cursor: isLocked ? 'not-allowed' : 'pointer'
                }}
              >
                {isLocked ? (
                  <span style={{ fontSize: 14, marginLeft: 9, marginRight: 2 }}>🔒</span>
                ) : (
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: status === 'not-started' ? 'var(--text-muted)' : style.stroke,
                    boxShadow: status === 'not-started' ? 'none' : `0 0 10px ${style.stroke}`,
                    marginLeft: 11
                  }}></div>
                )}
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)' }}>{node.title}</h4>
                  <p style={{ fontSize: 11.5, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {node.type} · {isLocked ? 'Locked' : status.replace('-', ' ')}
                  </p>
                </div>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>→</span>
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop Interactive SVG Graph
  return (
    <div className="card" style={{ overflow: 'hidden', padding: 32, position: 'relative' }}>
      <div style={{ marginBottom: 28, zIndex: 2, position: 'relative' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{graph.title}</h2>
        <p className="muted" style={{ fontSize: 14.5, color: 'var(--text-secondary)' }}>{graph.description}</p>
      </div>

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        overflowX: 'auto',
        background: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.02) 1px, transparent 0)',
        backgroundSize: '24px 24px',
        borderRadius: 14,
        border: '1px solid rgba(255, 255, 255, 0.03)',
        padding: '24px 0'
      }}>
        <svg width={maxX} height={maxY} viewBox={`0 0 ${maxX} ${maxY}`} style={{ display: 'block', margin: '0 auto' }}>
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Premium Nodes Gradients */}
            <linearGradient id="completed-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>
            <linearGradient id="in-progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <linearGradient id="needs-review-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4c1d95" />
              <stop offset="100%" stopColor="#2e1065" />
            </linearGradient>
            <linearGradient id="not-started-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
          </defs>

          {/* Connection Lines (Edges) */}
          {graph.edges.map((edge) => {
            const from = nodeById.get(edge.from);
            const to = nodeById.get(edge.to);
            if (!from || !to) return null;
            
            const edgeStyle = getEdgeStyle(edge);
            const midX = (from.x + 90 + to.x) / 2;
            const midY = (from.y + 28 + to.y + 28) / 2;
            
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={`M ${from.x + 90} ${from.y + 28} Q ${midX} ${midY} ${to.x} ${to.y + 28}`}
                  fill="none"
                  stroke={edgeStyle.stroke}
                  strokeWidth={edgeStyle.strokeWidth}
                  strokeDasharray={edgeStyle.dash}
                  style={{ transition: 'var(--transition-smooth)' }}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {graph.nodes.map((node) => {
            const style = getNodeStyle(node.id);
            const isHovered = hoveredNode === node.id;
            const status = progress[node.id]?.status || 'not-started';
            const isLocked = checkIsLocked(node.id);

            return (
              <g
                key={node.id}
                onMouseEnter={() => !isLocked && setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
                opacity={isLocked ? 0.45 : 1}
              >
                <a href={`/topics/${node.id}`}>
                  {/* Glow under node on hover or active progress */}
                  {!isLocked && (isHovered || status !== 'not-started') && (
                    <rect
                      x={node.x - 4}
                      y={node.y - 4}
                      width="188"
                      height="64"
                      rx="16"
                      fill="transparent"
                      stroke={style.stroke}
                      strokeWidth="2"
                      opacity="0.3"
                      filter="url(#glow)"
                    />
                  )}

                  {/* Node Container */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width="180"
                    height="56"
                    rx="14"
                    fill={isLocked ? 'rgba(15, 23, 42, 0.4)' : style.fill}
                    stroke={isLocked ? 'rgba(255, 255, 255, 0.05)' : (isHovered ? 'var(--text-primary)' : style.stroke)}
                    strokeWidth={isHovered && !isLocked ? '2' : '1.25'}
                    style={{ transition: 'var(--transition-smooth)' }}
                  />

                  {/* Title */}
                  <text
                    x={node.x + 16}
                    y={node.y + 24}
                    fontSize="12.5"
                    fontWeight="700"
                    fill={isHovered && !isLocked ? '#fff' : 'var(--text-primary)'}
                    style={{ transition: 'var(--transition-smooth)' }}
                  >
                    {node.title}
                  </text>

                  {/* Type / Level details */}
                  <text
                    x={node.x + 16}
                    y={node.y + 42}
                    fontSize="10"
                    fill={isLocked ? 'var(--text-muted)' : style.text}
                    fontWeight="600"
                    style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    {isLocked ? 'Locked' : `${node.type} · ${node.estimatedMinutes || 20}m`}
                  </text>
                  
                  {/* Visual bullet/lock indicating progress */}
                  {isLocked ? (
                    <text x={node.x + 154} y={node.y + 33} fontSize="11">🔒</text>
                  ) : (
                    <circle
                      cx={node.x + 164}
                      cy={node.y + 28}
                      r="4"
                      fill={status === 'not-started' ? 'var(--text-muted)' : style.stroke}
                    />
                  )}
                </a>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
