import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

import { SignOutButton } from '../../components/SignOutButton';
import PageLoader from '../../components/PageLoader';
import BalanceCard from '../../components/BalanceCard';
import { styles } from '../../assets/styles/home.styles'

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  if (isLoading && !refreshing) return <PageLoader />;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 👋 Header */}
        <View style={styles.header}>
          {/* Left */}
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/favicon.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split('@')[0]}
              </Text>
            </View>
          </View>

          {/* Right */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/create-route')}
            >
              <Ionicons name="map-outline" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Create Route</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => user?.signOut?.()}>
    <Ionicons name="log-out-outline" size={22} color="red" style={{ marginLeft: 12 }} />
  </TouchableOpacity>
          </View>
        </View>

        {/* 🖼️ Hero Illustration */}
        <Image
          source={require('../../assets/images/hero.png')}
          style={{
            width: '100%',
            height: 200,
            resizeMode: 'contain',
            marginBottom: 16,
            marginTop: 10,
          }}
        />

        {/* ✍️ Branding Text */}
        <Text style={styles.sectionTitle}>Stridr: Your Running Companion</Text>
        <Text
          style={{
            fontSize: 14,
            color: '#777',
            marginBottom: 20,
            lineHeight: 20,
            marginTop: 10,
          }}
        >
          Plan personalized jogging routes based on your time, distance, and
          calories. Track goals and stay consistent with Stridr.
        </Text>

        {/* 📊 User Summary / Stats */}
        <BalanceCard />

        {/* Optionally, motivational quote or CTA */}
        <Text
          style={{
            fontSize: 16,
            fontStyle: 'italic',
            color: '#888',
            textAlign: 'center',
            marginTop: 30,
            marginBottom: 60,
          }}
        >
          "Every step you take brings you closer to your goal."
        </Text>
      </ScrollView>
    </View>
  );
}
