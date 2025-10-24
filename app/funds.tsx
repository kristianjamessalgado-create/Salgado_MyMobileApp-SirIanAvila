import React from 'react';
import { useRouter } from 'expo-router';

const styles = {
  container: {
    maxWidth: 600,
    margin: '2rem auto',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#111827',
  },
  label: {
    fontWeight: 600,
    fontSize: '1rem',
    color: '#4b5563',
    marginBottom: '0.5rem',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1.25rem',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    marginBottom: '1rem',
    boxSizing: 'border-box' as const,
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
  },
  button: {
    padding: '0.5rem 1.5rem',
    fontWeight: 600,
    fontSize: '1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    color: '#fff',
  },
  saveButtonHover: {
    backgroundColor: '#4338ca',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
  },
  errorText: {
    color: 'red',
    marginTop: '0.5rem',
  },
  loadingText: {
    color: '#4b5563',
    marginTop: '0.5rem',
  },
};

const Funds: React.FC = () => {
  const router = useRouter();
  const [donorName, setDonorName] = React.useState('');
  const [fundAmount, setFundAmount] = React.useState<number | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saveHover, setSaveHover] = React.useState(false);

  React.useEffect(() => {
    const fetchFund = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/funds.php');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (typeof data.amount === 'number') {
          setFundAmount(data.amount);
          setInputValue(data.amount.toString());
        } else {
          throw new Error('Invalid response data');
        }
      } catch (err) {
        setError('Failed to load funds.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFund();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const numValue = Number(inputValue);
      if (isNaN(numValue) || numValue < 0) {
        setError('Please enter a valid non-negative number.');
        setLoading(false);
        return;
      }

      const payload = {
        amount: numValue,
        donor_name: donorName.trim() === '' ? 'Anonymous' : donorName.trim(),
      };

      const res = await fetch('http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/funds.php', {
        method: 'POST', // or 'PUT' depending on your backend
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update fund.');

      setFundAmount(numValue);
      router.push('/dashboard'); // Redirect back to dashboard after save
    } catch (err) {
      setError('Failed to save funds.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manage Fund Amount</h1>

      {loading && <p style={styles.loadingText}>Loading...</p>}

      {!loading && (
        <>
          <label htmlFor="fund-input" style={styles.label}>
            Current Fund Amount (₱)
          </label>
          <input
            id="fund-input"
            type="number"
            min={0}
            step="0.01"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={styles.input}
            disabled={loading}
          />

          <label htmlFor="donor-input" style={styles.label}>
            Donor Name (optional)
          </label>
          <input
            id="donor-input"
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="Anonymous"
            style={styles.input}
            disabled={loading}
          />

          {error && <p style={styles.errorText}>{error}</p>}

          <div style={styles.buttonContainer}>
            <button
              style={{ ...styles.button, ...styles.saveButton, ...(saveHover ? styles.saveButtonHover : {}) }}
              onClick={handleSave}
              disabled={loading}
              onMouseEnter={() => setSaveHover(true)}
              onMouseLeave={() => setSaveHover(false)}
            >
              Save
            </button>

            <button
              style={{ ...styles.button, ...styles.cancelButton }}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Funds;
