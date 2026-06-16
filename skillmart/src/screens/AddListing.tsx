import { ArrowLeft, Tag, UploadCloud } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import type { Category } from "../types";

const CATEGORIES: Category[] = ["Research Papers", "Project Code", "Books", "Hire"];

export function AddListing() {
  const { go, publishListing } = useApp();
  const [form, setForm] = useState({
    title: "",
    category: "Research Papers" as Category,
    price: "",
    description: "",
    tags: "",
    imageUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.description) {
      toast.error("Please fill in title, price, and description.");
      return;
    }

    setBusy(true);
    try {
      await publishListing({
        title: form.title,
        category: form.category,
        price: Number(form.price),
        description: form.description,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        imageUrl: form.imageUrl,
        file,
      });
      go("my-store");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Listing could not be created.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <button onClick={() => go("my-store")} className="flex items-center gap-1.5 text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] mb-5 transition-colors">
        <ArrowLeft size={15} /> Back to My Store
      </button>
      <h1 className="text-2xl font-extrabold mb-1">Add New Listing</h1>
      <p className="text-[var(--muted-fg)] text-sm mb-6">Publish a real listing to Supabase.</p>

      <form onSubmit={submit} className="card p-6 flex flex-col gap-5">
        <label className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 flex flex-col items-center gap-2 text-center hover:border-[var(--primary)]/40 transition-colors cursor-pointer">
          <UploadCloud size={28} className="text-[var(--muted-fg)]" />
          <p className="text-sm font-medium">{file ? file.name : "Click to upload files"}</p>
          <p className="text-xs text-[var(--muted-fg)]">PDF, ZIP, DOCX, PNG, JPG, WEBP up to 50MB</p>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.zip,.docx,image/png,image/jpeg,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <div>
          <label className="text-sm font-medium block mb-1.5">Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Machine Learning Research Paper" className="input" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="input">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Price (USD) {form.category === "Hire" && <span className="text-xs text-[var(--muted-fg)]">/hr</span>}</label>
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" min="0" step="0.01" placeholder="0.00" className="input" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Image URL</label>
          <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." className="input" />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Describe what buyers will get..." className="input resize-none" />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5 flex items-center gap-1.5"><Tag size={13} /> Tags (comma separated)</label>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="ML, Python, Healthcare" className="input" />
        </div>

        <button type="submit" disabled={busy} className="btn-primary w-full py-3.5 mt-1 disabled:opacity-60">
          {busy ? "Publishing..." : "Publish Listing"}
        </button>
      </form>
    </main>
  );
}
