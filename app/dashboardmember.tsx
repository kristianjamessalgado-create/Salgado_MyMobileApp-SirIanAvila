'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { FiFolder } from 'react-icons/fi';

interface Project {
  id: number;
  title: string;
  description: string;
}

interface MemberData {
  projects: Project[];
}

const DashboardMember: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    const storedUser = localStorage.getItem('username');

    if (!loggedIn || loggedIn !== 'true' || !storedUser) {
      router.push('/login');
      return;
    }

    fetchMemberData(storedUser);
  }, [router]);

  const fetchMemberData = async (username: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/get_member_data.php?username=${encodeURIComponent(
          username
        )}`
      );
      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError(result.error || 'Failed to load data');
      }
    } catch (err) {
      setError('Failed to fetch member data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    router.push('/login');
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome 👋</h1>
        <p style={styles.subtitle}>
          You are logged in as a <strong>Member</strong>.
        </p>

        {/* Announcements / Projects */}
        <div style={styles.announcements}>
          <h2>📢 Announcements</h2>
          {data?.projects.length ? (
            <div style={styles.projectList}>
              {data.projects.map((project) => (
                <div key={project.id} style={styles.projectCard}>
                  <div style={styles.projectIcon}>
                    <FiFolder size={24} color="#4A90E2" />
                  </div>
                  <div style={styles.projectContent}>
                    <h3 style={{ margin: 0 }}>{project.title}</h3>
                    <p style={{ marginTop: 4, color: '#555' }}>{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No projects available at the moment.</p>
          )}
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.button} onClick={() => router.push('/myreports')}>
            View My Reports
          </button>
          <button style={styles.button} onClick={() => alert('Feature coming soon!')}>
            Update My Information
          </button>
          <button
            style={{ ...styles.button, backgroundColor: '#dc2626' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardMember;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: 600,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#4b5563', marginBottom: 20 },
  announcements: { textAlign: 'left', marginBottom: 20 },
  projectList: { display: 'flex', flexDirection: 'column', gap: 12 },
  projectCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  projectIcon: { flexShrink: 0 },
  projectContent: { flex: 1 },
  actions: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 },
  button: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '12px 16px',
    fontSize: 16,
    cursor: 'pointer',
    width: '100%',
  },
};
