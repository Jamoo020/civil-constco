"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project } from "../data/projects";
import AdminProjectForm from "./AdminProjectForm";

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

const initialProjectData: AdminProjectData = {
  title: "",
  location: "",
  year: new Date().getFullYear().toString(),
  overview: "",
  image: "",
  scope: "",
  type: "General",
  client: "",
  featured: false,
  impact: "",
  images: "",
};

export default function AdminInterface() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<AdminProjectData | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = window.sessionStorage.getItem("ci-admin-authenticated");
    if (saved === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetchProjects();
  }, [authenticated]);

  const authMessage = useMemo(() => {
    return process.env.NEXT_PUBLIC_ADMIN_PASSWORD ? "" : "Using a fallback admin password of 'admin'. Set ADMIN_PASSWORD in your environment to secure the page.";
  }, []);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Invalid password.");
      } else {
        setAuthenticated(true);
        window.sessionStorage.setItem("ci-admin-authenticated", "true");
      }
    } catch (err) {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchProjects() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/projects", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to load projects.");
        return;
      }
      setProjects(data.projects || []);
    } catch (err) {
      setError("Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(projectData: AdminProjectData) {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const isEdit = Boolean(projectData.slug);
      const response = await fetch(`/api/admin/projects${isEdit ? "?slug=" + encodeURIComponent(projectData.slug!) : ""}`, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to save project.");
        return;
      }
      setMessage(isEdit ? "Project updated successfully." : "New project added successfully.");
      setSelectedProject(null);
      await fetchProjects();
    } catch (err) {
      setError("Unable to save project.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this project permanently?")) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/projects?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to delete project.");
        return;
      }
      setMessage("Project deleted successfully.");
      setSelectedProject(null);
      await fetchProjects();
    } catch (err) {
      setError("Unable to delete project.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(project: Project) {
    setSelectedProject({
      title: project.title,
      location: project.location,
      year: project.year.toString(),
      overview: project.overview,
      image: project.image || "",
      scope: project.scope.join("\n"),
      type: project.type || "General",
      client: project.client || "",
      featured: project.featured || false,
      impact: project.impact || "",
      images: project.images?.join("\n") || "",
      slug: project.slug,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Admin login</h1>
        <p className="text-sm text-gray-600 mb-6">Enter the admin password to manage project entries.</p>
        {authMessage ? <div className="mb-4 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-700">{authMessage}</div> : null}
        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Checking…" : "Sign in"}
          </button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">Project admin</h1>
            <p className="mt-2 text-gray-600">Create, update, and delete project entries for the site.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedProject(initialProjectData);
              setMessage("");
              setError("");
            }}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Add Project
          </button>
        </div>
        {message ? <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{message}</div> : null}
        {error ? <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}
      </div>

      {selectedProject ? (
        <AdminProjectForm
          project={selectedProject}
          loading={loading}
          onCancel={() => setSelectedProject(null)}
          onSave={handleSave}
        />
      ) : null}

      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Existing projects</h2>
        {loading && projects.length === 0 ? (
          <p className="text-gray-600">Loading projects…</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-600">No projects found.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.slug} className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-500">{project.type}</p>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.location} • {project.year}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project.slug)}
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
