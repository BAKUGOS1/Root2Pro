import React, { useState, useEffect } from 'react';
import { getProgress, setNodeStatus } from '../lib/progressStore.js';

export default function TopicWorkspace({ node, graph, htmlContent }) {
  const [progress, setProgress] = useState({});
  const [status, setStatus] = useState('not-started');

  useEffect(() => {
    const activeProgress = getProgress();
    setProgress(activeProgress);
    if (activeProgress[node.id]) {
      setStatus(activeProgress[node.id].status);
    } else {
      setStatus('not-started');
    }
  }, [node.id]);

  function updateStatus(nextStatus) {
    setStatus(nextStatus);
    setNodeStatus(node.id, nextStatus);
    
    // Refresh local progress state
    setProgress(getProgress());
  }

  // Find incoming locking prerequisites
  const lockingPrereqs = graph.edges
    .filter(edge => edge.to === node.id && (edge.type === 'prerequisite' || edge.type === 'recommended-next'))
    .map(edge => {
      const parentNode = graph.nodes.find(n => n.id === edge.from);
      const isCompleted = progress[edge.from]?.status === 'completed';
      return { id: edge.from, title: parentNode?.title || edge.from, isCompleted };
    });

  const isLocked = lockingPrereqs.some(prereq => !prereq.isCompleted);

  // Find recommended next topics
  const nextTopics = graph.edges
    .filter(edge => edge.from === node.id && (edge.type === 'prerequisite' || edge.type === 'recommended-next'))
    .map(edge => {
      const childNode = graph.nodes.find(n => n.id === edge.to);
      return { id: edge.to, title: childNode?.title || edge.to };
    });

  // Root -> Practice -> Build -> Pro -> Recall loop mapping
  const stages = [
    { name: 'Root', key: 'root', description: 'Concepts', active: node.level === 'root' || node.type === 'topic' },
    { name: 'Practice', key: 'practice', description: 'Small tasks', active: node.level === 'practice' || node.type === 'practice' },
    { name: 'Build', key: 'build', description: 'Mini-projects', active: node.level === 'build' || node.type === 'project' },
    { name: 'Pro', key: 'pro', description: 'Mistakes/Tips', active: node.level === 'pro' },
    { name: 'Recall', key: 'recall', description: 'Quiz/Review', active: node.level === 'recall' || node.type === 'quiz' || node.type === 'recall' }
  ];

  // Map status names to display properties
  const statusConfig = {
    'not-started': { label: 'Not Started', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.05)', border: 'rgba(148, 163, 184, 0.15)' },
    'in-progress': { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.25)' },
    'completed': { label: 'Completed', color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.25)' },
    'needs-review': { label: 'Needs Review', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.25)' }
  };

  if (isLocked) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 580, margin: '80px auto 0 auto', textAlign: 'center', alignItems: 'center' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.06)',
          border: '1px solid rgba(239, 68, 68, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.05)',
          marginBottom: 8
        }}>
          🔒
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 850, letterSpacing: '-0.03em' }}>Topic Locked</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.6, maxWidth: '45ch' }}>
          Please complete the prerequisite learning nodes in the curriculum path to unlock <strong>{node.title}</strong>.
        </p>

        <div className="card" style={{ width: '100%', textAlign: 'left', padding: 28, marginTop: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Prerequisites needed:</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none' }}>
            {lockingPrereqs.filter(p => !p.isCompleted).map(prereq => (
              <li key={prereq.id}>
                <a href={`/topics/${prereq.id}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: 'var(--accent)',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; }}
                >
                  <span>{prereq.title}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Start Lesson →</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <a href="/" className="btn" style={{ marginTop: 20, padding: '12px 28px' }}>
          Return to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Back button and status header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <a href="/" className="btn" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 13 }}>
          <span>←</span> Back to Roadmap
        </a>
        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: '99px',
          fontSize: 12.5,
          fontWeight: 650,
          background: statusConfig[status].bg,
          color: statusConfig[status].color,
          border: `1px solid ${statusConfig[status].border}`
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusConfig[status].color }}></span>
          {statusConfig[status].label}
        </div>
      </div>

      <div className="workspace-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 32 }}>
        {/* Left: Markdown Lesson Content */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-hover)' }}>
              {node.track.replace('-', ' ')}
            </span>
            <h1 style={{ fontSize: 30, fontWeight: 850, marginTop: 6, letterSpacing: '-0.03em' }}>{node.title}</h1>
          </div>
          
          <div className="prose" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          
          {/* Next Up Panel if topic is completed */}
          {status === 'completed' && nextTopics.length > 0 && (
            <div style={{
              marginTop: 32,
              padding: 28,
              borderRadius: 14,
              background: 'rgba(16, 185, 129, 0.03)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}>
              <div>
                <h3 style={{ fontSize: 15.5, fontWeight: 750, color: '#10b981', marginBottom: 4 }}>🎉 Topic Completed!</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Keep your momentum going! Here is the next step:</p>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {nextTopics.map(next => (
                  <a key={next.id} href={`/topics/${next.id}`} className="btn btn-primary" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 24px',
                    borderRadius: 10,
                    fontWeight: 700
                  }}>
                    <span>Next Up: {next.title}</span>
                    <span>Start Lesson →</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Stage Loop Tracker & Progress Control */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Loop Tracker */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 750, marginBottom: 18, color: 'var(--text-primary)' }}>Learning Loop</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
              {/* Connector line */}
              <div style={{ position: 'absolute', left: 15, top: 12, bottom: 12, width: 2, background: 'rgba(255, 255, 255, 0.04)', zIndex: 0 }}></div>
              
              {stages.map((stage, idx) => (
                <div key={stage.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, zIndex: 1 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: stage.active ? 'var(--accent)' : 'rgba(255, 255, 255, 0.02)',
                    border: stage.active ? '2px solid transparent' : '2px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: stage.active ? '#fff' : 'var(--text-muted)'
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 13.5, fontWeight: 700, color: stage.active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {stage.name}
                    </h4>
                    <p style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Panel */}
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 750, marginBottom: 4 }}>Set Status</h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Track your understanding of this topic.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.keys(statusConfig).map(key => {
                const isCurrent = key === status;
                const config = statusConfig[key];
                return (
                  <button
                    key={key}
                    onClick={() => updateStatus(key)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 10,
                      border: isCurrent ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                      background: isCurrent ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                      color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <span>{config.label}</span>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: config.color }}></span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Recall & Assessment Panel */}
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, background: 'rgba(139, 92, 246, 0.03)', borderColor: 'rgba(139, 92, 246, 0.15)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 750, color: '#a78bfa' }}>Recall Check</h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Can you explain this topic without looking?</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input type="checkbox" style={{ accentColor: '#8b5cf6', width: 15, height: 15 }} />
                I understand the core concept
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input type="checkbox" style={{ accentColor: '#8b5cf6', width: 15, height: 15 }} />
                I can use it in practice
              </label>
            </div>
          </div>

          {/* Project Catalog Link */}
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 750 }}>Build Projects</h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Apply your {node.track} knowledge by building real projects.</p>
            <a href="/projects" className="btn" style={{ textAlign: 'center', padding: '12px 16px', fontSize: 13, background: 'rgba(255, 255, 255, 0.02)' }}>
              View Project Catalog →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
