import { Stack, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Layout() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in');
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
