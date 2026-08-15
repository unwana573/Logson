import React, { useEffect, useState } from "react";
import { ImagePlus, Pencil } from "lucide-react";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { formatNaira } from "../../utils/format";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [vendor, setVendor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stockText, setStockText] = useState("");

  const stockCount = stockText.split("\n").map((l) => l.trim()).filter(Boolean).length;

  const load = () => {
    setLoading(true);
    Promise.all([productService.list(), categoryService.list()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
        if (c.length && !categoryId) setCategoryId(c[0].id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async () => {
    setError("");
    if (!name.trim() || !vendor.trim() || !categoryId || !price) {
      setError("Fill in name, vendor, category, and price.");
      return;
    }
    setSaving(true);
    try {
      await productService.create({
        name: name.trim(),
        vendor: vendor.trim(),
        categoryId,
        priceKobo: Number(price),
        imageUrl: imageUrl.trim() || undefined,
        stockText,
      });
      setName("");
      setVendor("");
      setPrice("");
      setImageUrl("");
      setStockText("");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[13px] text-muted">Loading&hellip;</p>;

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1.1fr" }}>
      <div className="rounded-2xl border border-border bg-panel p-5">
        <p className="text-[13px] mb-4 font-semibold text-text">Create product</p>
        {error && <p className="text-[12px] mb-3" style={{ color: "#D8433F" }}>{error}</p>}

        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-faint">Product name</label>
            <div className="mt-1 rounded-lg px-3.5 flex items-center bg-ink border border-border" style={{ height: 40 }}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Windows 11 Pro" className="w-full bg-transparent outline-none text-[13px] text-text" />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-faint">Vendor</label>
            <div className="mt-1 rounded-lg px-3.5 flex items-center bg-ink border border-border" style={{ height: 40 }}>
              <input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g. Microsoft" className="w-full bg-transparent outline-none text-[13px] text-text" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-faint">Category</label>
              <div className="mt-1 rounded-lg px-3.5 flex items-center bg-ink border border-border" style={{ height: 40 }}>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-transparent outline-none text-[13px] text-text">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} style={{ background: "#171B24" }}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] text-faint">Price (kobo)</label>
              <div className="mt-1 rounded-lg px-3.5 flex items-center bg-ink border border-border" style={{ height: 40 }}>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="850000"
                  className="w-full bg-transparent outline-none text-[13px] font-mono text-text"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-faint">Image URL</label>
            <div className="mt-1 rounded-lg px-3.5 flex items-center gap-2 bg-ink border border-border" style={{ height: 40 }}>
              <ImagePlus size={14} className="text-faint" />
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-transparent outline-none text-[13px] text-text" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-faint">Stock credentials &middot; one per line</label>
              <span className="text-[11px] text-muted">{stockCount} unit{stockCount === 1 ? "" : "s"}</span>
            </div>
            <textarea
              value={stockText}
              onChange={(e) => setStockText(e.target.value)}
              placeholder={"VK7DX-9F3QM-2LWRT-KP6NB\nMBP1-7ZQX-44RT-9KLM"}
              rows={5}
              className="w-full rounded-lg px-3.5 py-2.5 outline-none text-[12.5px] resize-none bg-ink border border-border font-mono"
              style={{ color: "#E3C077" }}
            />
            <p className="text-[11px] mt-1 text-faint">Each line becomes one unit of stock, assigned to a buyer on purchase.</p>
          </div>

          <button
            disabled={saving}
            onClick={handleSave}
            className="w-full h-10 rounded-lg text-[13px] font-semibold bg-brass text-brassDark disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save product"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-panel overflow-hidden self-start">
        <div className="px-5 py-3.5 border-b border-border">
          <span className="text-[13px] font-semibold text-text">Existing products</span>
        </div>
        {products.map((p, i) => (
          <div key={p.id} className={`flex items-center gap-3 px-5 py-3 ${i < products.length - 1 ? "border-b border-border2" : ""}`}>
            {p.image_url && <img src={p.image_url} alt={p.name} className="rounded-md object-cover shrink-0" style={{ width: 40, height: 32 }} />}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] truncate text-text">{p.name}</p>
              <p className="text-[11.5px] text-faint">
                {p.stock_count} in stock &middot; {formatNaira(p.price_kobo)}
              </p>
            </div>
            <button aria-label="Edit product">
              <Pencil size={14} className="text-muted" />
            </button>
          </div>
        ))}
        {products.length === 0 && <p className="text-[13px] text-muted px-5 py-6">No products yet.</p>}
      </div>
    </div>
  );
}
