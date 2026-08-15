import React, { useEffect, useState } from "react";
import { Tag, Trash2 } from "lucide-react";
import { categoryService } from "../../services/categoryService";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");

  const load = () => {
    setLoading(true);
    categoryService
      .list()
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async () => {
    if (!value.trim()) return;
    try {
      await categoryService.create(value.trim());
      setValue("");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async (id) => {
    try {
      await categoryService.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-[13px] text-muted">Loading&hellip;</p>;

  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden">
      {error && <p className="text-[12px] px-5 py-3" style={{ color: "#D8433F" }}>{error}</p>}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
        <div className="flex-1 rounded-lg px-3.5 flex items-center gap-2 bg-ink border border-border" style={{ height: 38 }}>
          <Tag size={14} className="text-faint" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="New category name"
            className="w-full bg-transparent outline-none text-[13px] text-text"
          />
        </div>
        <button onClick={handleAdd} className="text-[12.5px] px-3.5 rounded-lg shrink-0 bg-brass text-brassDark font-semibold" style={{ height: 38 }}>
          Add
        </button>
      </div>

      {categories.map((c, i) => (
        <div key={c.id} className={`flex items-center justify-between px-5 py-3.5 ${i < categories.length - 1 ? "border-b border-border2" : ""}`}>
          <div>
            <p className="text-[13px] text-text">{c.name}</p>
            <p className="text-[11.5px] mt-0.5 text-faint">
              {c.product_count} product{c.product_count === 1 ? "" : "s"}
            </p>
          </div>
          <button onClick={() => handleRemove(c.id)} aria-label="Remove category">
            <Trash2 size={14} className="text-faint" />
          </button>
        </div>
      ))}
      {categories.length === 0 && <p className="text-[13px] text-muted px-5 py-6">No categories yet.</p>}
    </div>
  );
}
