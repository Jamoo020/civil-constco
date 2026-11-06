"use client";

import { useEffect, useState } from "react";
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
  const [checkingSession, setCheckingSession] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<AdminProjectData | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/session", { cache: "no-store" })
      .then(async (response) => {
        if (!active) return;
        if (!response.ok) {
          setAuthenticated(false);
          setCsrfToken("");
          if (response.status !== 401) {
            setError("Unable to verify the admin session.");
          }
          return;
        }
        const result = await response.json();
        setAuthenticated(result.authenticated === true);
        setCsrfToken(typeof result.csrfToken === "string" ? result.csrfToken : "");
      })
      .catch(() => {
        if (active) setError("Unable to verify the admin session.");
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetchProjects();
  }, [authenticated]);

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
        setCsrfToken(result.csrfToken);
        setAuthenticated(true);
        setPassword("");
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
        if (response.status === 401) {
          setAuthenticated(false);
          setCsrfToken("");
        }
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
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          setAuthenticated(false);
          setCsrfToken("");
        }
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
        headers: { "X-CSRF-Token": csrfToken },
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          setAuthenticated(false);
          setCsrfToken("");
        }
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

  async function handleLogout() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: { "X-CSRF-Token": csrfToken },
      });
      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Unable to sign out.");
        return;
      }

      setAuthenticated(false);
      setCsrfToken("");
      setProjects([]);
      setSelectedProject(null);
      setMessage("");
    } catch (err) {
      setError("Unable to sign out. Please try again.");
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

  if (checkingSession) {
    return <p className="text-gray-600">Checking admin session…</p>;
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Admin login</h1>
        <p className="text-sm text-gray-600 mb-6">Enter the admin password to manage project entries.</p>
        {error ? <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
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
          <div className="flex flex-wrap gap-3">
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
            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Sign out
            </button>
          </div>
        </div>
        {message ? <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{message}</div> : null}
        {error ? <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}
      </div>

      {selectedProject ? (
        <AdminProjectForm
          key={selectedProject.slug ?? "new-project"}
          project={selectedProject}
          loading={loading}
          csrfToken={csrfToken}
          onUnauthorized={() => {
            setAuthenticated(false);
            setCsrfToken("");
          }}
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
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm uppercase tracking-[0.24em] text-gray-500">{project.type}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        project.featured
                          ? "bg-amber-100 text-amber-900"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {project.featured ? "Featured" : "Not featured"}
                    </span>
                  </div>
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
