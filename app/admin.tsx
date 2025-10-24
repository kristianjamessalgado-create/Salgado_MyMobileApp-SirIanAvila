import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

interface Admin {
  id: number;
  name: string;
  role: string;
  status: 'pending' | 'approved';
}

const AdminPage: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    try {
      const res = await fetch('http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/admin.php');
      const data = await res.json();
      setAdmins(data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handlePromote = async () => {
    if (!username.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/admin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username }),
      });
      const data = await res.json();
      console.log('Promote result:', data);
      setUsername('');
      fetchAdmins();
    } catch (error) {
      console.error('Error promoting admin:', error);
    }
    setLoading(false);
  };

  const handleApproveToggle = async (id: number, currentStatus: 'pending' | 'approved') => {
    // Toggle status
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';

    try {
      const res = await fetch(`http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/admin.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      console.log('Status update result:', data);
      fetchAdmins();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const renderItem = ({ item }: { item: Admin }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.role}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <TouchableOpacity
        style={[styles.button, item.status === 'approved' ? styles.approved : styles.pending]}
        onPress={() => handleApproveToggle(item.id, item.status)}
      >
        <Text style={styles.buttonText}>
          {item.status === 'approved' ? 'Revoke Approval' : 'Approve'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Management</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Enter existing username to promote"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <Button
          title={loading ? 'Processing...' : 'Promote to Admin'}
          onPress={handlePromote}
          disabled={loading}
        />
      </View>

      <FlatList
        data={admins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No admins found.</Text>}
      />
    </View>
  );
};

export default AdminPage;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 5,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  approved: {
    backgroundColor: '#22c55e',
  },
  pending: {
    backgroundColor: '#f97316',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
