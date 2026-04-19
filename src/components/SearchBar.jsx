export default function SearchBar({ query, onQueryChange, placeholder = 'Search…', meta }) {
  return (
    <div className="searchbar">
      <input
        className="searchbar-input"
        value={query}
        onChange={(e) => onQueryChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label="Global search"
      />
      <div className="searchbar-meta">{typeof meta === 'string' ? meta : query ? `${query.length} chars` : ' '}</div>
    </div>
  );
}
