'use client';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(
        'http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/login.php',
        { method: 'POST', body: formData }
      );

      const text = await response.text();
      console.log('Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        setErrorMsg('Invalid server response.');
        setLoading(false);
        return;
      }

      if (response.ok) {
        // ✅ Check approval first
        if (data.status !== 'approved') {
          setErrorMsg('Your account is still pending approval by the admin.');
          setLoading(false);
          return;
        }

        // ✅ Save session only if approved
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        localStorage.setItem('status', data.status);

        // ✅ Redirect based on role
        if (data.role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/dashboardmember');
        }
      } else {
        setErrorMsg(data.error || 'Login failed. Please check your username and password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Error connecting to server.');
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>IP Tracker</h2>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

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

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={styles.tip}>
          If dli kahibaw mo himo ug account please ug duol sa mga baranggay officials
        </p>

        <p style={styles.signupText}>
          No account yet?{' '}
          <span
            style={styles.signupLink}
            onClick={() => router.push('/register')}
          >
            Sign up here
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
  tip: {
    marginTop: 15,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  signupText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    color: '#374151',
  },
  signupLink: {
    color: '#4f46e5',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default Login;
