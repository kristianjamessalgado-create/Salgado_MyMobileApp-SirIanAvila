'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { FiFileText } from 'react-icons/fi';
import { Platform } from 'react-native';

// Base URL with Android emulator support; override via EXPO_PUBLIC_API_BASE_URL if set
const DEFAULT_BASE = 'http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend';
const ANDROID_BASE = 'http://10.0.2.2/Salgado_MyMobileApp/Salgado_MyMobileApp/backend';
const ENV_BASE =
  (typeof process !== 'undefined' && (process as any).env && (process as any).env.EXPO_PUBLIC_API_BASE_URL) || '';
const API_BASE: string = (ENV_BASE as string) || (Platform.OS === 'android' ? ANDROID_BASE : DEFAULT_BASE);

interface Report {
    id: number;
    title: string;
    description: string;
    created_at: string; // Included again to display the date
}

const MyReports: React.FC = () => {
    const router = useRouter();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loggedIn = localStorage.getItem('loggedIn');
        const storedUser = localStorage.getItem('username');

        if (!loggedIn || loggedIn !== 'true' || !storedUser) {
            router.push('/login');
            return;
        }

        // CRUCIAL: Force username to lowercase to guarantee a match with the database
        const normalizedUser = storedUser.toLowerCase(); 
        
        console.log('Fetching reports for username:', normalizedUser);
        fetchReports(normalizedUser);
    }, [router]);

    const fetchReports = async (user: string) => {
        try {
            setLoading(true);
            const url = `${API_BASE}/get_reports.php?username=${encodeURIComponent(user)}`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (!res.ok) {
                throw new Error(`HTTP Error! Status: ${res.status}.`);
            }
            
            const data = await res.json();
            console.log('Fetched reports:', data);

            if (Array.isArray(data.reports)) {
                setReports(data.reports);
                setError(null);
            } else if (data.error) {
                setReports([]);
                setError(`Server Error: ${data.error}`); 
            } else {
                setReports([]);
                setError(null);
            }
        } catch (err: any) {
            console.error("Fetch failed:", err);
            const isAbort = err?.name === 'AbortError';
            setError(
                `Failed to fetch reports: ${isAbort ? 'Request timed out' : err?.message || 'Network issue'}. ` +
                'Ensure your server is running and the API base URL is reachable.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.push('/dashboardmember');
    };

    if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
    
    if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>My Reports</h1>
                <button style={styles.backButton} onClick={handleBack}>
                    ← Back to Dashboard
                </button>

                {reports.length > 0 ? (
                    <div style={styles.reportList}>
                        {reports.map((report) => (
                            <div key={report.id} style={styles.reportCard}>
                                <div style={styles.reportIcon}>
                                    <FiFileText size={24} color="#4A90E2" />
                                </div>
                                <div style={styles.reportContent}>
                                    <h3 style={{ margin: 0 }}>{report.title}</h3>
                                    <p style={{ marginTop: 4, color: '#555' }}>{report.description}</p>
                                    <small style={{ color: '#888' }}>
                                        Created at: {new Date(report.created_at).toLocaleString()}
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No reports available.</p>
                )}
            </div>
        </div>
    );
};

export default MyReports;

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
    backButton: {
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        padding: '8px 12px',
        cursor: 'pointer',
        marginBottom: 20,
    },
    reportList: { display: 'flex', flexDirection: 'column', gap: 12 },
    reportCard: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f9fafb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    reportIcon: { flexShrink: 0 },
    reportContent: { flex: 1, textAlign: 'left' },
};