import React, { useEffect, useState } from 'react';
import { FiFolder, FiEdit, FiTrash2, FiSave, FiX } from 'react-icons/fi';

interface Project {
  id: number;
  title: string;
  description: string;
}

const API_URL = 'http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/projects.php'; // your backend URL

const Project: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!newTitle.trim()) {
      alert('Title is required');
      return;
    }
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });
      if (!res.ok) throw new Error('Failed to create project');
      setNewTitle('');
      setNewDescription('');
      fetchProjects();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
     
      const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      fetchProjects();
    } catch (err: any) {
      alert(err.message);
    }
  }

  function handleBack(){
    window.history.back();
  }
  function startEdit(project: Project) {
    setEditingId(project.id);
    setEditTitle(project.title);
    setEditDescription(project.description);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: number) {
    if (!editTitle.trim()) {
      alert('Title is required');
      return;
    }
    try {
     
      const res = await fetch(`${API_URL}?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
      if (!res.ok) throw new Error('Failed to update project');
      setEditingId(null);
      fetchProjects();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (

  
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
        <button style={{marginBottom:20}}onClick={handleBack}>Back</button>
      <h1>Mga Proyekto para sa Katawhan sa Apale</h1>
     

     
      <div style={{ marginBottom: 20, border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
        <h2>Add ug bago na proyekto</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <textarea
          placeholder="Deskripsyon"
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
          rows={3}
        />
        <button onClick={handleCreate} style={{ padding: '8px 16px' }}>
          Idagdag
        </button>
      </div>

      
      <div style={{ display: 'grid', gap: 20 }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 24, color: '#4A90E2' }}>
              <FiFolder />
            </div>

            {editingId === project.id ? (
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  style={{ width: '100%', marginBottom: 6, padding: 6 }}
                />
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  style={{ width: '100%', padding: 6 }}
                  rows={3}
                />
              </div>
            ) : (
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0 }}>{project.title}</h2>
                <p style={{ marginTop: 6, color: '#555' }}>{project.description}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              {editingId === project.id ? (
                <>
                  <button onClick={() => saveEdit(project.id)} title="Save" aria-label="Save">
                    <FiSave />
                  </button>
                  <button onClick={cancelEdit} title="Cancel" aria-label="Cancel">
                    <FiX />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(project)} title="Edit" aria-label="Edit">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(project.id)} title="Delete" aria-label="Delete">
                    <FiTrash2 />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Project;
