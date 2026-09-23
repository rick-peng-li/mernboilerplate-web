import { useCallback, useEffect, useMemo, useState } from 'react';
import './styles/App.css';

const initialFormState = {
    title: '',
    category: '',
    status: 'Planned',
    summary: '',
    stack: '',
    repoUrl: '',
    demoUrl: '',
};

async function fetchJson(url, options) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Request failed.');
    }

    return data;
}

function App() {
    const [projects, setProjects] = useState([]);
    const [summary, setSummary] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        planned: 0,
    });
    const [serviceStatus, setServiceStatus] = useState({
        mode: 'checking',
        message: 'Loading service health...',
    });
    const [form, setForm] = useState(initialFormState);
    const [activeProjectId, setActiveProjectId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState('');

    const formTitle = useMemo(
        () => (activeProjectId ? 'Update project' : 'Add project'),
        [activeProjectId]
    );

    const loadData = useCallback(async () => {
        setIsLoading(true);

        try {
            const [healthData, summaryData, projectsData] = await Promise.all([
                fetchJson('/api/v1/health'),
                fetchJson('/api/v1/projects/summary'),
                fetchJson('/api/v1/projects'),
            ]);

            setServiceStatus({
                mode: healthData.mode,
                message: healthData.message,
            });
            setSummary(summaryData);
            setProjects(projectsData);
        } catch (error) {
            setFeedback(error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    }

    function resetForm() {
        setForm(initialFormState);
        setActiveProjectId('');
    }

    function handleEdit(project) {
        setActiveProjectId(project.id);
        setForm({
            title: project.title,
            category: project.category,
            status: project.status,
            summary: project.summary,
            stack: project.stack.join(', '),
            repoUrl: project.repoUrl,
            demoUrl: project.demoUrl,
        });
        setFeedback(`Editing "${project.title}".`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleDelete(projectId) {
        try {
            await fetchJson(`/api/v1/projects/${projectId}`, {
                method: 'DELETE',
            });
            setFeedback('Project removed successfully.');
            if (activeProjectId === projectId) {
                resetForm();
            }
            await loadData();
        } catch (error) {
            setFeedback(error.message);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setFeedback('');

        const payload = {
            ...form,
            stack: form.stack
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
        };

        try {
            const url = activeProjectId
                ? `/api/v1/projects/${activeProjectId}`
                : '/api/v1/projects';
            const method = activeProjectId ? 'PUT' : 'POST';

            await fetchJson(url, {
                method,
                body: JSON.stringify(payload),
            });

            setFeedback(activeProjectId ? 'Project updated successfully.' : 'Project created successfully.');
            resetForm();
            await loadData();
        } catch (error) {
            setFeedback(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="app-shell">
            <main className="app-layout">
                <section className="hero-card">
                    <div>
                        <p className="eyebrow">MERN Project Console</p>
                        <h1>Manage frontend and backend project records in one place.</h1>
                        <p className="hero-copy">
                            This starter now includes a working React dashboard, Express APIs, and a
                            MongoDB-ready data layer with in-memory fallback for local demos.
                        </p>
                    </div>
                    <div className="status-panel">
                        <span className="status-badge">{serviceStatus.mode} mode</span>
                        <strong>{serviceStatus.message}</strong>
                        <p>Server health, summary metrics, and CRUD actions are all connected to live APIs.</p>
                    </div>
                </section>

                <section className="summary-grid">
                    <article className="summary-card">
                        <span>Total</span>
                        <strong>{summary.total}</strong>
                    </article>
                    <article className="summary-card">
                        <span>Completed</span>
                        <strong>{summary.completed}</strong>
                    </article>
                    <article className="summary-card">
                        <span>In Progress</span>
                        <strong>{summary.inProgress}</strong>
                    </article>
                    <article className="summary-card">
                        <span>Planned</span>
                        <strong>{summary.planned}</strong>
                    </article>
                </section>

                <section className="content-grid">
                    <form className="panel form-panel" onSubmit={handleSubmit}>
                        <div className="panel-header">
                            <div>
                                <p className="eyebrow">Project Form</p>
                                <h2>{formTitle}</h2>
                            </div>
                            {activeProjectId ? (
                                <button className="ghost-button" type="button" onClick={resetForm}>
                                    Cancel edit
                                </button>
                            ) : null}
                        </div>

                        <label>
                            Title
                            <input name="title" value={form.title} onChange={handleInputChange} placeholder="Operations Dashboard" />
                        </label>

                        <div className="two-column">
                            <label>
                                Category
                                <input name="category" value={form.category} onChange={handleInputChange} placeholder="Full Stack" />
                            </label>
                            <label>
                                Status
                                <select name="status" value={form.status} onChange={handleInputChange}>
                                    <option value="Planned">Planned</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </label>
                        </div>

                        <label>
                            Summary
                            <textarea
                                name="summary"
                                value={form.summary}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Describe the project goal and delivery scope."
                            />
                        </label>

                        <label>
                            Stack
                            <input
                                name="stack"
                                value={form.stack}
                                onChange={handleInputChange}
                                placeholder="React, Express, MongoDB"
                            />
                        </label>

                        <div className="two-column">
                            <label>
                                Repository URL
                                <input
                                    name="repoUrl"
                                    value={form.repoUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://github.com/example/project"
                                />
                            </label>
                            <label>
                                Demo URL
                                <input
                                    name="demoUrl"
                                    value={form.demoUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/demo"
                                />
                            </label>
                        </div>

                        <button className="primary-button" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : formTitle}
                        </button>

                        {feedback ? <p className="feedback-text">{feedback}</p> : null}
                    </form>

                    <section className="panel list-panel">
                        <div className="panel-header">
                            <div>
                                <p className="eyebrow">Projects</p>
                                <h2>Current records</h2>
                            </div>
                        </div>

                        {isLoading ? <p className="empty-state">Loading projects...</p> : null}

                        {!isLoading && projects.length === 0 ? (
                            <p className="empty-state">No projects found yet. Add your first record.</p>
                        ) : null}

                        <div className="project-list">
                            {projects.map((project) => (
                                <article className="project-card" key={project.id}>
                                    <div className="project-card-header">
                                        <div>
                                            <span className="project-category">{project.category}</span>
                                            <h3>{project.title}</h3>
                                        </div>
                                        <span className="project-status">{project.status}</span>
                                    </div>

                                    <p>{project.summary}</p>

                                    <div className="stack-list">
                                        {project.stack.map((item) => (
                                            <span className="stack-tag" key={`${project.id}-${item}`}>
                                                {item}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="project-links">
                                        {project.repoUrl ? (
                                            <a href={project.repoUrl} target="_blank" rel="noreferrer">
                                                Repository
                                            </a>
                                        ) : null}
                                        {project.demoUrl ? (
                                            <a href={project.demoUrl} target="_blank" rel="noreferrer">
                                                Demo
                                            </a>
                                        ) : null}
                                    </div>

                                    <div className="project-actions">
                                        <button className="ghost-button" type="button" onClick={() => handleEdit(project)}>
                                            Edit
                                        </button>
                                        <button className="danger-button" type="button" onClick={() => handleDelete(project.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </section>
            </main>
        </div>
    );
}

export default App;
