import React, { useEffect, useState } from "react";
import { ImagePlus, Pencil, ArrowRight, CheckCircle2 } from "lucide-react";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { formatNaira } from "../../utils/format";

/** Converts a Naira amount typed by an admin (e.g. "8500" or "8500.50")
 * into an integer kobo value for the backend. Accepts any number of
 * digits and an optional decimal part -- not restricted to whole kobo. */
function nairaInputToKobo(value) {
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) return null;
  return Math.round(parsed * 100);
}

function CreateProductForm({ categories, onCreated }) {
  const [name, setName] = useState("");
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categories.length && !categoryId) setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  const priceKobo = nairaInputToKobo(price);

  const handleSubmit = async () => {
    setError("");
    if (!name.trim() || !vendor.trim() || !categoryId || priceKobo === null || priceKobo <= 0) {
      setError("Fill in name, vendor, category, and a valid price.");
      return;
    }
    setSaving(true);
    try {
      const product = await productService.create({
        name: name.trim(),
        vendor: vendor.trim(),
        description: description.trim() || undefined,
        categoryId,
        priceKobo,
        imageUrl: imageUrl.trim() || undefined,
      });
      // Credentials are added in the next step -- see CredentialsStep below.
      onCreated(product);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-panel p-5">
        <p className="text-[13px] text-muted">
          Create a category first (under the Categories tab) before adding products.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-panel p-5">
      <p className="text-[13px] mb-4 font-semibold text-text">Create product</p>
      {error && <p className="text-[12px] mb-3" style={{ color: "#D8433F" }}>{error}</p>}

      <div className="space-y-3">
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

        <div>
          <label className="text-[11px] text-faint">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What the buyer gets, activation notes, anything worth knowing before purchase."
            rows={3}
            className="mt-1 w-full rounded-lg px-3.5 py-2.5 outline-none text-[13px] resize-none bg-ink border border-border text-text"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-faint">Price (&#8358;)</label>
            <div className="mt-1 rounded-lg px-3.5 flex items-center bg-ink border border-border" style={{ height: 40 }}>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="8500 or 8500.50"
                inputMode="decimal"
                className="w-full bg-transparent outline-none text-[13px] font-mono text-text"
              />
            </div>
            {price && priceKobo !== null && (
              <p className="text-[11px] mt-1 text-faint">
                Saved as {formatNaira(priceKobo)} ({priceKobo} kobo)
              </p>
            )}
          </div>
          <div>
            <label className="text-[11px] text-faint">Initial stock (reference only)</label>
            <div className="mt-1 rounded-lg px-3.5 flex items-center bg-ink border border-border" style={{ height: 40 }}>
              <input
                value={stock}
                onChange={(e) => setStock(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g. 20"
                className="w-full bg-transparent outline-none text-[13px] font-mono text-text"
              />
            </div>
            <p className="text-[11px] mt-1 text-faint">
              How many credentials you plan to paste in next. Actual stock is
              always the real credential count.
            </p>
          </div>
        </div>

        <div>
          <label className="text-[11px] text-faint">Product image URL</label>
          <div className="mt-1 rounded-lg px-3.5 flex items-center gap-2 bg-ink border border-border" style={{ height: 40 }}>
            <ImagePlus size={14} className="text-faint" />
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-transparent outline-none text-[13px] text-text" />
          </div>
        </div>

        <button
          disabled={saving}
          onClick={handleSubmit}
          className="w-full h-10 rounded-lg text-[13px] font-semibold bg-brass text-brassDark disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          {saving ? "Creating..." : "Continue to add credentials"}
          {!saving && <ArrowRight size={14} />}
        </button>
      </div>
    </div>
  );
}

function CredentialsStep({ product, targetStock, onDone }) {
  const [stockText, setStockText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const stockCount = stockText.split("\n").map((l) => l.trim()).filter(Boolean).length;

  const handleSave = async () => {
    setError("");
    if (stockCount === 0) {
      setError("Add at least one credential line, or skip for now and add stock later.");
      return;
    }
    setSaving(true);
    try {
      await productService.addStock(product.id, stockText);
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-panel p-5">
      <div className="flex items-center gap-2 mb-1">
        <CheckCircle2 size={15} className="text-mint" />
        <p className="text-[13px] font-semibold text-text">"{product.name}" created &mdash; now add its credentials</p>
      </div>
      <p className="text-[12.5px] text-muted mb-4">
        {targetStock ? `You planned for ${targetStock} unit${targetStock === "1" ? "" : "s"}. ` : ""}
        Paste one credential per line below.
      </p>

      {error && <p className="text-[12px] mb-3" style={{ color: "#D8433F" }}>{error}</p>}

      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] text-faint">Stock credentials &middot; one per line</label>
        <span className="text-[11px] text-muted">{stockCount} unit{stockCount === 1 ? "" : "s"}</span>
      </div>
      <textarea
        value={stockText}
        onChange={(e) => setStockText(e.target.value)}
        placeholder={"VK7DX-9F3QM-2LWRT-KP6NB\nMBP1-7ZQX-44RT-9KLM"}
        rows={8}
        className="w-full rounded-lg px-3.5 py-2.5 outline-none text-[12.5px] resize-none bg-ink border border-border font-mono"
        style={{ color: "#E3C077" }}
      />
      <p className="text-[11px] mt-1 mb-4 text-faint">Each line becomes one unit of stock, assigned to a buyer on purchase.</p>

      <div className="flex gap-2">
        <button
          disabled={saving}
          onClick={handleSave}
          className="flex-1 h-10 rounded-lg text-[13px] font-semibold bg-brass text-brassDark disabled:opacity-60"
        >
          {saving ? "Saving..." : "Add credentials & finish"}
        </button>
        <button
          onClick={onDone}
          className="px-4 h-10 rounded-lg text-[13px] border border-border text-muted"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // step: { mode: "create" } | { mode: "credentials", product, targetStock }
  const [step, setStep] = useState({ mode: "create" });

  const load = () => {
    setLoading(true);
    Promise.all([productService.list(), categoryService.list()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <p className="text-[13px] text-muted">Loading&hellip;</p>;

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1.1fr" }}>
      {step.mode === "create" ? (
        <CreateProductForm
          categories={categories}
          onCreated={(product) => setStep({ mode: "credentials", product })}
        />
      ) : (
        <CredentialsStep
          product={step.product}
          targetStock={step.targetStock}
          onDone={() => {
            setStep({ mode: "create" });
            load();
          }}
        />
      )}

      <div className="rounded-2xl border border-border bg-panel overflow-hidden self-start">
        <div className="px-5 py-3.5 border-b border-border">
          <span className="text-[13px] font-semibold text-text">Existing products</span>
        </div>
        {error && <p className="text-[12px] px-5 py-3" style={{ color: "#D8433F" }}>{error}</p>}
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