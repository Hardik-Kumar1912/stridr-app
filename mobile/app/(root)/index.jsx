import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

import PageLoader from '../../components/PageLoader';
import { useAuth } from '@clerk/clerk-expo';

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const { signOut } = useAuth();

  useEffect(() => {
    if (imageLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [imageLoaded]);

  if (isLoading) return <PageLoader />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 30,
          paddingBottom: 30,
          justifyContent: 'space-between',
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Side: Welcome Info */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/favicon.png')}
              style={{ width: 33, height: 33 }}
              resizeMode="contain"
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 12, color: '#444' }}>Welcome,</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111' }}>
                {user?.emailAddresses[0]?.emailAddress.split('@')[0]}
              </Text>
            </View>
          </View>

          {/* Right Side: Buttons */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#30a46c',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 10,
              }}
              onPress={() => router.push('/create-route')}
            >
              <Ionicons name="map-outline" size={18} color="#fff" />
              <Text style={{ color: '#fff', marginLeft: 5, fontSize: 15 }}>Create Route</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => signOut()}>
              <Ionicons name="log-out-outline" size={24} color="red" style={{ marginLeft: 18 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Middle Content */}
        <View style={{ flex: 1, justifyContent: 'center', marginTop: 20 }}>
          {/* Hero Image */}
          <View style={{ alignItems: 'center', height: 220, width: '100%' }}>
            {!imageLoaded && (
              <ActivityIndicator size="small" color="#30a46c" style={{ marginTop: 90 }} />
            )}
            <Animated.Image
              source={require('../../assets/images/hero.png')}
              style={{
                width: '100%',
                height: 220,
                resizeMode: 'contain',
                position: 'absolute',
                opacity: fadeAnim,
                borderRadius: 30,
              }}
              onLoadEnd={() => setImageLoaded(true)}
            />
          </View>

          {/* Texts */}
          <Text
            style={{
              fontSize: 26,
              fontWeight: 'bold',
              color: '#222',
              textAlign: 'center',
              marginTop: 30,
            }}
          >
            Stridr: Your Running Companion
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#555',
              lineHeight: 24,
              textAlign: 'center',
              marginTop: 10,
            }}
          >
            Discover smarter jogging routes that match your schedule and fitness goals. Whether it's
            15 minutes or 5 kilometers – Stridr makes every run count.
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#666',
              lineHeight: 23,
              textAlign: 'center',
              marginTop: 14,
            }}
          >
            Built for passionate runners and beginners alike, Stridr keeps track of your runs,
            calories burned, and helps build consistency with smart route suggestions based on
            real-world conditions.
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontStyle: 'italic',
              color: '#888',
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            "Every step you take brings you closer to your goal."
          </Text>
        </View>

        {/* Bottom CTA Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#30a46c',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          onPress={() => router.push('/create-route')}
        >
          <Ionicons name="map-outline" size={22} color="#fff" />
          <Text style={{ color: '#fff', marginLeft: 10, fontSize: 17 }}>Create a New Route</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
