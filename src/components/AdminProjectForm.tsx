"use client";

import React, { useMemo, useState } from "react";

type AdminProjectData = {
  title: string;
  location: string;
  year: string;
  overview: string;
  image: string;
  scope: string;
  type: string;
  client: string;
  featured: boolean;
  impact: string;
  images: string;
  slug?: string;
};

type Props = {
  project: AdminProjectData;
  loading: boolean;
  onSave: (project: AdminProjectData) => Promise<void>;
  onCancel: () => void;
};

export default function AdminProjectForm({ project, loading, onSave, onCancel }: Props) {
  const [formState, setFormState] = useState(project);
  const [validationError, setValidationError] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const scopeLines = useMemo(() => formState.scope.trim().split("\n").filter(Boolean).length, [formState.scope]);
  const imagesLines = useMemo(() => formState.images.trim().split("\n").filter(Boolean).length, [formState.images]);

  function handleChange(field: keyof AdminProjectData, value: string | boolean) {
    setFormState((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    if (!formState.title.trim()) return "A project title is required.";
    if (!formState.location.trim()) return "A location is required.";
    if (!formState.year.trim() || Number.isNaN(Number(formState.year))) return "A valid year is required.";
    if (!formState.overview.trim()) return "An overview is required.";
    if (!formState.scope.trim()) return "At least one scope item is required.";
    return "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validate();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError("");
    await onSave(formState);
  }

  async function handleUpload() {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError("");
    try {
      const form = new FormData();
      for (let i = 0; i < files.length; i++) form.append("file", files[i]);

      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Upload failed.");
        return;
      }

      const urls: string[] = data.urls || [];
      if (urls.length) {
        setFormState((cur) => ({
          ...cur,
          images: [cur.images, ...urls].filter(Boolean).join("\n"),
          image: cur.image || urls[0],
        }));
      }
      setFiles(null);
    } catch (err) {
      setUploadError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{formState.slug ? "Edit project" : "Add project"}</h2>
          <p className="mt-2 text-gray-600">Fill in project details and save. Image and scope are optional but recommended.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Saving…" : "Save project"}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Title</span>
          <input
            type="text"
            value={formState.title}
            onChange={(event) => handleChange("title", event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Location</span>
          <input
            type="text"
            value={formState.location}
            onChange={(event) => handleChange("location", event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Year</span>
          <input
            type="number"
            value={formState.year}
            onChange={(event) => handleChange("year", event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Project type</span>
          <input
            type="text"
            value={formState.type}
            onChange={(event) => handleChange("type", event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Client</span>
          <input
            type="text"
            value={formState.client}
            onChange={(event) => handleChange("client", event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Primary image URL</span>
          <input
            type="url"
            value={formState.image}
            onChange={(event) => handleChange("image", event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <label className="block mt-6">
        <span className="text-sm font-medium text-gray-700">Overview</span>
        <textarea
          value={formState.overview}
          onChange={(event) => handleChange("overview", event.target.value)}
          rows={5}
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </label>

      <label className="block mt-6">
        <span className="text-sm font-medium text-gray-700">Scope items</span>
        <span className="block text-xs text-gray-500 mb-2">One item per line</span>
        <textarea
          value={formState.scope}
          onChange={(event) => handleChange("scope", event.target.value)}
          rows={4}
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
        <p className="mt-2 text-sm text-gray-500">{scopeLines} scope item(s) entered.</p>
      </label>

      <label className="block mt-6">
        <span className="text-sm font-medium text-gray-700">Additional image URLs</span>
        <span className="block text-xs text-gray-500 mb-2">One URL per line; included in the project gallery.</span>
        <textarea
          value={formState.images}
          onChange={(event) => handleChange("images", event.target.value)}
          rows={4}
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
        <p className="mt-2 text-sm text-gray-500">{imagesLines} image URL(s).</p>
      </label>

      <label className="block mt-6">
        <span className="text-sm font-medium text-gray-700">Upload images from device</span>
        <span className="block text-xs text-gray-500 mb-2">Select one or more image files and upload them. Uploaded files will be saved to /uploads.</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="mt-2"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || !files || files.length === 0}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Upload selected files"}
          </button>
          {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}
        </div>
      </label>

      <label className="block mt-6">
        <span className="text-sm font-medium text-gray-700">Impact summary</span>
        <textarea
          value={formState.impact}
          onChange={(event) => handleChange("impact", event.target.value)}
          rows={3}
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </label>

      <label className="mt-6 flex items-center gap-3">
        <input
          type="checkbox"
          checked={formState.featured}
          onChange={(event) => handleChange("featured", event.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-500"
        />
        <span className="text-sm text-gray-700">Mark as featured project</span>
      </label>

      {validationError ? <p className="mt-4 text-sm text-red-600">{validationError}</p> : null}
    </form>
  );
}
