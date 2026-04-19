export default function SearchBar({ query, onQueryChange, placeholder = 'Search…' }) {
  return (
    <div className="searchbar">
      <input
        className="searchbar-input"
        value={query}
        onChange={(e) => onQueryChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label="Global search"
      />
      <div className="searchbar-meta">{query ? `${query.length} chars` : ' '}</div>
    </div>
  );
}
