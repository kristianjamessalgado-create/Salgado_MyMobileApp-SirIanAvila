import React from 'react';
import { useRouter } from 'expo-router';
import { FiUsers, FiFolder } from 'react-icons/fi';
import { Image } from 'react-native';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    color: '#1f2937',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  navbar: {
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e5e7eb',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  navTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#4f46e5',
    cursor: 'pointer',
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: '#4b5563',
    textDecoration: 'none',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  navLinkHover: {
    color: '#4f46e5',
  },
  main: {
    padding: '1.5rem',
  },
  header: {
    marginBottom: '2rem',
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginBottom: '1rem',
  },
  headerTitle: {
    fontSize: '2.25rem',
    fontWeight: '800',
    color: '#111827',
    margin: 0,
  },
  headerSubtitle: {
    color: '#4b5563',
    fontSize: '1.125rem',
    margin: 0,
  },
  logoutButton: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  logoutButtonHover: {
    backgroundColor: '#4338ca',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'box-shadow 0.3s ease',
    border: '1px solid #f3f4f6',
  },
  statTitle: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280',
    margin: 0,
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#111827',
    margin: '0.25rem 0 0 0',
  },
  iconContainer: {
    marginLeft: '1rem',
    fontSize: '2rem',
  },
};

const responsiveStyles = `
  @media (max-width: 640px) {
    .stats-grid {
      grid-template-columns: 1fr !important;
    }
    .header {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    .logout-button {
      margin-top: 1rem;
      width: 100%;
    }
    nav ul {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
`;

const Dashboard: React.FC = () => {
  const router = useRouter();
  const rawUsername = localStorage.getItem('username');
  const username = rawUsername && rawUsername !== 'undefined' ? rawUsername : 'Error!';
  const logo = require('../assets/images/apale.jpg');

  const [fundAmount, setFundAmount] = React.useState<number | null>(null);
  const [fundError, setFundError] = React.useState<string | null>(null);
  const [isLogoutHovered, setLogoutHovered] = React.useState(false);
  const [hoveredLink, setHoveredLink] = React.useState<string | null>(null);
  const [memberCount, setMemberCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = responsiveStyles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  React.useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const response = await fetch('http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/count_users.php');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.count !== undefined) {
          setMemberCount(data.count);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchMemberCount();
  }, []);

  React.useEffect(() => {
    const fetchFundAmount = async () => {
      try {
        const res = await fetch('http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/funds.php');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setFundAmount(data.amount);
      } catch (error) {
        console.error('Error fetching funds:', error);
        setFundError('Failed to load funds');
      }
    };

    fetchFundAmount();
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Admin', path: '/admin' },
    { name: 'Member Approval', path: '/memberapproval' },
  ];

  return (
    <div style={styles.container} className="dashboard">
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => router.push('/dashboard')}
          >
            <Image source={logo} style={{ width: 40, height: 40, borderRadius: 8 }} />
            <span style={styles.navTitle}>Barangay IP Tracker</span>
          </div>

          <ul style={styles.navLinks}>
            {navLinks.map(({ name, path }) => (
              <li key={name}>
                <a
                  style={{
                    ...styles.navLink,
                    ...(hoveredLink === name ? styles.navLinkHover : {}),
                  }}
                  onMouseEnter={() => setHoveredLink(name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  onClick={() => router.push(path as any)}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="logout-button"
          onClick={() => router.push('/logout')}
          onMouseEnter={() => setLogoutHovered(true)}
          onMouseLeave={() => setLogoutHovered(false)}
          style={isLogoutHovered ? { ...styles.logoutButton, ...styles.logoutButtonHover } : styles.logoutButton}
        >
          Logout
        </button>
      </nav>

      <main style={styles.main}>
        <header style={styles.header} className="header">
          <div style={styles.headerTextContainer}>
            <h1 style={styles.headerTitle}>Dashboard</h1>
            <p style={styles.headerSubtitle}>Maayong pagbalik {username}!</p>
          </div>
        </header>

        <section style={styles.statsGrid} className="stats-grid">
        <StatCard
  title="Registered Members"
  value={memberCount !== null ? memberCount.toString() : 'Loading...'}
  icon={<FiUsers />}
  onClick={() => router.push('/registeredmembers')}
/>

          <StatCard
            title="Kwarta hinabang nga available"
            value={fundAmount !== null ? `₱${fundAmount.toLocaleString()}` : 'Loading...'}
            icon={<span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.5rem' }}>₱</span>}
            onClick={() => router.push('/funds')}
          />

          <StatCard
            title="Proyekto para sa katawhan sa Apale"
            value="12"
            icon={<FiFolder />}
            onClick={() => router.push('/project')}
          />
        </section>
      </main>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, onClick }) => {
  const [isHovered, setHovered] = React.useState(false);

  return (
    <div
      style={{
        ...styles.statCard,
        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.1)',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div>
        <p style={styles.statTitle}>{title}</p>
        <h2 style={styles.statValue}>{value}</h2>
      </div>
      <div style={styles.iconContainer}>{icon}</div>
    </div>
  );
};

export default Dashboard;
