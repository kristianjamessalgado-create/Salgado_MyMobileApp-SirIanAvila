'use client';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const addResponsiveStyles = () => {
    if (typeof document !== 'undefined') {
      const css = `
        @media (max-width: 480px) {
          form {
            padding: 20px !important;
            max-width: 100% !important;
            border-radius: 0 !important;
            height: 100vh !important;
            justify-content: center !important;
          }
          h2 {
            font-size: 20px !important;
            margin-bottom: 15px !important;
          }
          input, select, button {
            font-size: 14px !important;
            padding: 10px !important;
          }
          p {
            font-size: 14px !important;
          }
        }
      `;
      const style = document.createElement('style');
      style.innerHTML = css;
      document.head.appendChild(style);
    }
  };

  React.useEffect(() => {
    addResponsiveStyles();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('role', role);

      const response = await fetch(
        'http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/register.php',
        {
          method: 'POST',
          body: formData,
        }
      );

      const text = await response.text();
      console.log('Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        setErrorMsg('Invalid server response. Please check backend.');
        setLoading(false);
        return;
      }

      if (response.ok) {
        setSuccessMsg('Registration successful! Please wait for admin approval.');
        setUsername('');
        setPassword('');

        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setErrorMsg(data.error || 'Registration failed.');
      }
    } catch (error) {
      console.error('Register error:', error);
      setErrorMsg('Error connecting to server.');
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2 style={styles.title}>Create Account</h2>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
        {successMsg && <p style={styles.success}>{successMsg}</p>}

        <label style={styles.label}>Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={styles.input}
          required
        />

        <label style={styles.label}>Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{ ...styles.button, backgroundColor: '#6b7280', marginBottom: 10 }}
        >
          {showPassword ? 'Hide Password' : 'Show Password'}
        </button>

        <label style={styles.label}>Role</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value as 'admin' | 'member')}
          style={styles.input}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p style={{ marginTop: 15, textAlign: 'center' }}>
          Already have an account?{' '}
          <span
            style={{ color: '#4f46e5', cursor: 'pointer' }}
            onClick={() => router.push('/login')}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    padding: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: 350,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#374151',
  },
  input: {
    marginBottom: 15,
    padding: 12,
    fontSize: 16,
    border: '1px solid #ccc',
    borderRadius: 6,
  },
  button: {
    padding: 12,
    fontSize: 16,
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    marginTop: 10,
  },
  error: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    padding: '8px 12px',
    borderRadius: 6,
    marginBottom: 15,
    textAlign: 'center',
  },
  success: {
    color: '#065f46',
    backgroundColor: '#d1fae5',
    padding: '8px 12px',
    borderRadius: 6,
    marginBottom: 15,
    textAlign: 'center',
  },
};

export default Register;
