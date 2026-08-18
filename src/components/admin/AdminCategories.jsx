import React, { useEffect, useState } from "react";
import { Tag, Trash2, Pencil, Check, X } from "lucide-react";
import { categoryService } from "../../services/categoryService";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

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
    setError("");
    try {
      await categoryService.create(value.trim());
      setValue("");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (category) => {
    setEditingId(category.id);
    setEditValue(category.name);
    setError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleRename = async (id) => {
    if (!editValue.trim()) return;
    setError("");
    try {
      await categoryService.update(id, editValue.trim());
      setEditingId(null);
      setEditValue("");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async (id) => {
    setError("");
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
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="New category name"
            className="w-full bg-transparent outline-none text-[13px] text-text"
          />
        </div>
        <button onClick={handleAdd} className="text-[12.5px] px-3.5 rounded-lg shrink-0 bg-brass text-brassDark font-semibold" style={{ height: 38 }}>
          Add
        </button>
      </div>

      {categories.map((c, i) => (
        <div key={c.id} className={`flex items-center justify-between px-5 py-3.5 gap-3 ${i < categories.length - 1 ? "border-b border-border2" : ""}`}>
          {editingId === c.id ? (
            <>
              <div className="flex-1 rounded-lg px-3 flex items-center bg-ink border border-border" style={{ height: 34 }}>
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename(c.id)}
                  autoFocus
                  className="w-full bg-transparent outline-none text-[13px] text-text"
                />
              </div>
              <button onClick={() => handleRename(c.id)} aria-label="Save name" className="shrink-0">
                <Check size={15} className="text-mint" />
              </button>
              <button onClick={cancelEditing} aria-label="Cancel" className="shrink-0">
                <X size={15} className="text-faint" />
              </button>
            </>
          ) : (
            <>
              <div>
                <p className="text-[13px] text-text">{c.name}</p>
                <p className="text-[11.5px] mt-0.5 text-faint">
                  {c.product_count} product{c.product_count === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEditing(c)} aria-label="Rename category">
                  <Pencil size={14} className="text-muted" />
                </button>
                <button onClick={() => handleRemove(c.id)} aria-label="Remove category">
                  <Trash2 size={14} className="text-faint" />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
      {categories.length === 0 && <p className="text-[13px] text-muted px-5 py-6">No categories yet.</p>}
    </div>
  );
}