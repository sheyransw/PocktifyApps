import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wallet, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#A78BFA', '#C4B5FD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <View style={styles.heroContent}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Wallet size={48} color="#FFFFFF" strokeWidth={2} />
            </View>
          </View>

          {/* App Title */}
          <Text style={styles.appTitle}>POCKTIFY</Text>

          {/* Tagline */}
          <Text style={styles.tagline}>
            Mengatur Keuangan dalam Genggaman
          </Text>

          {/* CTA Button */}
          <TouchableOpacity style={styles.ctaButton} onPress={navigateToDashboard}>
            <Text style={styles.ctaText}>Start Now</Text>
            <ArrowRight size={20} color="#8B5CF6" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: '#F3F4F6',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 26,
    fontWeight: '500',
    paddingHorizontal: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 20,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5CF6',
    marginRight: 8,
  },
});