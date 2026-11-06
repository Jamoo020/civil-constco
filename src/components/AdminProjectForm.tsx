"use client";

import React, { useMemo, useState } from "react";
import { PROJECT_FIELD_LIMITS } from "../lib/project-validation";

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
  csrfToken: string;
  onUnauthorized: () => void;
  onSave: (project: AdminProjectData) => Promise<void>;
  onCancel: () => void;
};

export default function AdminProjectForm({ project, loading, csrfToken, onUnauthorized, onSave, onCancel }: Props) {
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
    const title = formState.title.trim();
    const location = formState.location.trim();
    const overview = formState.overview.trim();
    const projectType = formState.type.trim();
    const year = Number(formState.year);
    const scope = formState.scope.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
    const images = formState.images.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

    if (!title) return "Project title is required.";
    if (title.length > PROJECT_FIELD_LIMITS.title) return `Project title must be ${PROJECT_FIELD_LIMITS.title} characters or fewer.`;
    if (!location) return "Location is required.";
    if (location.length > PROJECT_FIELD_LIMITS.location) return `Location must be ${PROJECT_FIELD_LIMITS.location} characters or fewer.`;
    if (!overview) return "Overview is required.";
    if (overview.length > PROJECT_FIELD_LIMITS.overview) return `Overview must be ${PROJECT_FIELD_LIMITS.overview} characters or fewer.`;
    if (!projectType) return "Project type is required.";
    if (projectType.length > PROJECT_FIELD_LIMITS.type) return `Project type must be ${PROJECT_FIELD_LIMITS.type} characters or fewer.`;
    if (!Number.isInteger(year) || year < 1800 || year > 2100) return "Year must be an integer between 1800 and 2100.";
    if (!scope.length) return "At least one scope item is required.";
    if (scope.length > PROJECT_FIELD_LIMITS.scopeItems) return `Scope may contain at most ${PROJECT_FIELD_LIMITS.scopeItems} items.`;
    if (scope.some((item) => item.length > PROJECT_FIELD_LIMITS.scopeItem)) return `Scope items must be ${PROJECT_FIELD_LIMITS.scopeItem} characters or fewer.`;
    if (images.length > PROJECT_FIELD_LIMITS.galleryImages) return `Gallery images may contain at most ${PROJECT_FIELD_LIMITS.galleryImages} items.`;
    if (images.some((item) => item.length > PROJECT_FIELD_LIMITS.imageUrl)) return `Gallery image URLs must be ${PROJECT_FIELD_LIMITS.imageUrl} characters or fewer.`;
    if (formState.client.trim().length > PROJECT_FIELD_LIMITS.client) return `Client must be ${PROJECT_FIELD_LIMITS.client} characters or fewer.`;
    if (formState.impact.trim().length > PROJECT_FIELD_LIMITS.impact) return `Impact must be ${PROJECT_FIELD_LIMITS.impact} characters or fewer.`;

    const isValidImageUrl = (value: string) => {
      if (!value) return true;
      if (/^\/uploads\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp$/.test(value)) return true;
      try {
        const url = new URL(value);
        return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname) && !url.username && !url.password;
      } catch {
        return false;
      }
    };
    if (!isValidImageUrl(formState.image.trim())) return "Primary image must be an HTTP, HTTPS, or stored upload URL.";
    if (images.some((image) => !isValidImageUrl(image))) return "Gallery image URLs must be HTTP, HTTPS, or stored upload URLs.";
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

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "X-CSRF-Token": csrfToken },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) onUnauthorized();
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
          <p className="mt-2 text-gray-600">Fill in project details and save. Add at least one scope item; images are optional.</p>
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
            maxLength={PROJECT_FIELD_LIMITS.title}
            required
            onChange={(event) => handleChange("title", event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Location</span>
          <input
            type="text"
            value={formState.location}
            maxLength={PROJECT_FIELD_LIMITS.location}
            required
            onChange={(event) => handleChange("location", event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Year</span>
          <input
            type="number"
            value={formState.year}
            min={1800}
            max={2100}
            step={1}
            required
            onChange={(event) => handleChange("year", event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Project type</span>
          <input
            type="text"
            value={formState.type}
            maxLength={PROJECT_FIELD_LIMITS.type}
            required
            onChange={(event) => handleChange("type", event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Client</span>
          <input
            type="text"
            value={formState.client}
            maxLength={PROJECT_FIELD_LIMITS.client}
            onChange={(event) => handleChange("client", event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Primary image URL</span>
          <input
            type="text"
            inputMode="url"
            value={formState.image}
            maxLength={PROJECT_FIELD_LIMITS.imageUrl}
            onChange={(event) => handleChange("image", event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <label className="block mt-6">
        <span className="text-sm font-medium text-gray-700">Overview</span>
        <textarea
          value={formState.overview}
          maxLength={PROJECT_FIELD_LIMITS.overview}
          required
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
          maxLength={PROJECT_FIELD_LIMITS.scopeItems * (PROJECT_FIELD_LIMITS.scopeItem + 1)}
          required
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
          maxLength={PROJECT_FIELD_LIMITS.galleryImages * (PROJECT_FIELD_LIMITS.imageUrl + 1)}
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
          accept="image/jpeg,image/png,image/webp"
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
          maxLength={PROJECT_FIELD_LIMITS.impact}
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
