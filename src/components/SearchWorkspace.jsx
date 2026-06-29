import React, { useState, useEffect } from 'react';

export default function SearchWorkspace() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/generated/search-index.json')
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load search index", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.track.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
    setResults(filtered);
  }, [query, items]);

  return (
    <div className="search-workspace">
      <div className="search-header">
        <h1>Search Root2Pro</h1>
        <p>Find topics, lessons, and practice materials across all tracks.</p>
        <input
          type="text"
          className="search-input"
          placeholder="Search for 'commit', 'html', or 'css'..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="search-results">
        {isLoading ? (
          <p className="search-status">Loading search index...</p>
        ) : query.trim() === '' ? (
          <p className="search-status">Type to start searching.</p>
        ) : results.length === 0 ? (
          <p className="search-status">No results found for "{query}".</p>
        ) : (
          <div className="search-grid">
            {results.map((result) => (
              <a
                key={result.id}
                href={`/topics/${result.id}`}
                className="search-card"
              >
                <div className="search-card-meta">
                  <span className="search-track">{result.track}</span>
                  <span className={`search-type type-${result.type}`}>
                    {result.type}
                  </span>
                </div>
                <h3>{result.title}</h3>
                <div className="search-tags">
                  {result.tags.map((tag) => (
                    <span key={tag} className="search-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .search-workspace {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        .search-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .search-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .search-header p {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        .search-input {
          width: 100%;
          padding: 1rem 1.5rem;
          font-size: 1.25rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .search-input:focus {
          border-color: var(--primary-accent);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        .search-status {
          text-align: center;
          color: var(--text-muted);
          padding: 2rem;
          font-style: italic;
        }
        .search-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .search-card {
          display: block;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1.25rem;
          text-decoration: none;
          color: inherit;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }
        .search-card:hover {
          transform: translateY(-2px);
          border-color: var(--primary-accent);
        }
        .search-card h3 {
          margin: 0.5rem 0;
          color: var(--text-primary);
        }
        .search-card-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }
        .search-track {
          font-family: var(--font-mono);
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .search-type {
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }
        .type-topic { background: rgba(37, 99, 235, 0.1); color: var(--primary-accent); }
        .type-practice { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .search-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .search-tag {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
