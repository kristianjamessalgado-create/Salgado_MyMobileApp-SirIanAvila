'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { InteractionManager, Text, View } from 'react-native';

const HomeScreen = () => {
  const router = useRouter();
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      const isLoggedIn = localStorage.getItem('loggedIn');
      const role = localStorage.getItem('role');
      const status = localStorage.getItem('status'); // ✅ add this in login.tsx when approved
      console.log('Login check:', { isLoggedIn, role, status });

      if (isLoggedIn === 'true' && status === 'approved') {
        if (role === 'admin') {
          router.replace('/dashboard');
        } else {
          router.replace('/dashboardmember');
        }
      } else {
        // Either not logged in or not approved
        router.replace('/login');
      }

      setCheckingLogin(false);
    });
  }, [router]);

  if (checkingLogin) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Checking login status...</Text>
      </View>
    );
  }

  return null;
};

export default HomeScreen;
