'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { InteractionManager, Text } from 'react-native';

const Logout = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
   
    localStorage.removeItem('loggedIn');

 
    fetch('http://localhost/Salgado_MyMobileApp/Salgado_MyMobileApp/backend/logout.php', {
      method: 'POST',
    }).catch(err => console.error('Logout API error:', err));

    
    InteractionManager.runAfterInteractions(() => {
      if (pathname !== '/login') {  
        router.replace('/login');
       
      }
    });
  }, [router, pathname]);

  return <Text>Logging out...</Text>;
};

export default Logout;