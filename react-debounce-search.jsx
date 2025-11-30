import { useCallback, useState } from "react";
import "./App.css";
export default function App() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  // ✅ Debounce function (pure JS + closure)
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // ✅ API call
  const callSearchAPI = (query) => {
    fetch(`https://dummyjson.com/products/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.products || []);
        console.log("API called with:", query);
      });
  };

  // ✅ Memoized debounced function
  const debouncedAPI = useCallback(debounce(callSearchAPI, 600), []);

  function handleChange(e) {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    debouncedAPI(value);
  }

  return (
    <div style={{ padding: "20px" }}>
      <input
        placeholder="Search product..."
        value={search}
        onChange={handleChange}
        style={{ padding: "10px", width: "250px" }}
      />

      {results.length > 0 && (
        <ul>
          {results.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
