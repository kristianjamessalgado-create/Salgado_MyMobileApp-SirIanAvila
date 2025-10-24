'use client';
import React, { useEffect, useState } from 'react';

const RegisteredMembers: React.FC = () => {
  const [members, setMembers] = useState<{ username: string; role: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/get_members.php');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error('Failed to fetch members:', err);
        setError('Failed to load members.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <div style={styles.centerText}>Loading members...</div>;
  }

  if (error) {
    return <div style={styles.centerText}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Registered Members</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member, index) => (
              <tr key={index} style={styles.tr}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{member.username}</td>
                <td style={styles.td}>{member.role}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      color: member.status === 'approved' ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {member.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={styles.noData}>
                No members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: 'center',
    color: '#1f2937',
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    textAlign: 'left',
    padding: '12px',
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '12px',
    color: '#374151',
  },
  noData: {
    textAlign: 'center',
    padding: '20px',
    color: '#6b7280',
  },
  centerText: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '1.25rem',
    color: '#6b7280',
  },
};

export default RegisteredMembers;
