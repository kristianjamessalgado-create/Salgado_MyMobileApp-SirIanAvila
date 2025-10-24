import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  role: string;
  status: string;
}

const MemberApproval: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        'http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/memberapproval.php'
      );
      const data: User[] = await res.json();
      setPendingUsers(data);
    } catch (err) {
      setError('Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch(
        'http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/memberapproval.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchPendingUsers();
      } else {
        alert(data.error || 'Failed to approve user');
      }
    } catch (error) {
      alert('Error approving user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🧾 Pending Approvals</h1>
        <p style={styles.subtitle}>Approve new users to grant them access to the system.</p>

        {loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : pendingUsers.length === 0 ? (
          <p style={styles.empty}>✅ All users are approved!</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user, index) => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>{user.role}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        backgroundColor:
                          user.status === 'pending' ? '#fef3c7' : '#d1fae5',
                        color:
                          user.status === 'pending' ? '#92400e' : '#065f46',
                      }}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => approveUser(user.id)}
                      style={styles.button}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// 💅 Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 60,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px 40px',
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: 900,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 25,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#f3f4f6',
    fontWeight: 600,
    color: '#374151',
    borderBottom: '2px solid #e5e7eb',
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '12px 16px',
    color: '#374151',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'background-color 0.3s ease',
  },
  status: {
    padding: '5px 10px',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 13,
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: 500,
  },
  loading: {
    color: '#4b5563',
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#065f46',
    backgroundColor: '#d1fae5',
    padding: 12,
    borderRadius: 8,
    fontWeight: 600,
  },
};

export default MemberApproval;
