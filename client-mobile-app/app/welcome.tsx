import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <FontAwesome5 name="cube" size={24} color="black" />
            <Text style={styles.logoText}>Alpha</Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Invest like the</Text>
          <Text style={styles.titleBold}>top 1%.</Text>
          <Text style={styles.subtitle}>
            Elite mutual fund strategies, democratized.
          </Text>

          {/* Membership Card */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.chip} />
                <Ionicons name="wifi" size={24} color="#9CA3AF" style={{ transform: [{ rotate: '90deg' }] }} />
              </View>
              
              <View style={styles.cardProgress}>
                <View style={styles.progressBar}>
                    <View style={styles.progressFill} />
                </View>
                <View style={styles.progressDots} />
              </View>

              <View style={styles.cardFooter}>
                <View>
                    <Text style={styles.membershipLabel}>MEMBERSHIP</Text>
                    <View style={styles.membershipIdContainer}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <Text style={styles.membershipId}>8829</Text>
                    </View>
                </View>
                <View style={styles.eliteBadge}>
                  <Text style={styles.eliteText}>ELITE</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.regulatedContainer}>
            <MaterialIcons name="verified-user" size={16} color="#6B7280" />
            <Text style={styles.regulatedText}>REGULATED BY SEBI</Text>
          </View>

          <TouchableOpacity style={styles.unlockButton} onPress={() => router.push('/login')}>
            <Text style={styles.unlockButtonText}>Unlock Access</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Very light gray
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    letterSpacing: 1,
  },
  menuButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  mainContent: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 48,
  },
  titleBold: {
    fontSize: 40,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 18,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 40,
    maxWidth: '80%',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    aspectRatio: 1.6,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    width: 40,
    height: 28,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cardProgress: {
    gap: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    flexDirection: 'row',
  },
  progressFill: {
    width: '60%',
    backgroundColor: 'black',
    borderRadius: 2,
  },
  progressDots: {
    // Placeholder for dots if needed
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  membershipLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  membershipIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#111827',
  },
  membershipId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 4,
  },
  eliteBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eliteText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  footer: {
    marginBottom: 40,
    gap: 20,
    alignItems: 'center',
  },
  regulatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  regulatedText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  unlockButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 30,
    paddingVertical: 18,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  unlockButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
