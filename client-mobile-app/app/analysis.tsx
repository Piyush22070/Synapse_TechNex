import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AnalysisScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cost vs. Growth</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Waterfall Header */}
        <View style={styles.waterfallHeader}>
          <Text style={styles.waterfallLabel}>INVESTMENT WATERFALL</Text>
          <View style={styles.netValueContainer}>
            <Text style={styles.netValue}>.14,500</Text>
            <Text style={styles.netLabel}>Net</Text>
          </View>
          <View style={styles.returnsRow}>
            <View style={styles.returnsBadge}>
              <Text style={styles.returnsText}>+45% Returns</Text>
            </View>
            <Text style={styles.categoryAvg}>vs. <div className=""></div>14,000 Category Avg</Text>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.barGroup}>
            <View style={[styles.bar, { height: 120, backgroundColor: '#9CA3AF' }]} />
            <Text style={styles.barLabel}>INITIAL</Text>
          </View>
          <View style={styles.barGroup}>
            <View style={[styles.bar, { height: 200, backgroundColor: '#4B5563' }]} />
            <Text style={styles.barLabel}>GROSS</Text>
          </View>
          <View style={styles.barGroup}>
            <View style={[styles.bar, { height: 40, backgroundColor: '#E5E7EB' }]} />
            <View style={styles.expenseLine} />
            <View style={styles.expenseLabelContainer}>
                <Text style={styles.expenseLabelTitle}>EXPENSE IMPACT</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                    <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: '#9CA3AF'}} />
                    <Text style={styles.expenseValue}>- ₹12,400</Text>
                </View>
            </View>
            <Text style={styles.barLabel}>FEES</Text>
          </View>
          <View style={styles.barGroup}>
            <View style={[styles.bar, { height: 180, backgroundColor: 'black' }]} />
            <View style={styles.netLabelFloating}>
                <Text style={styles.netLabelFloatingText}>14.5k</Text>
            </View>
            <Text style={styles.barLabel}>NET</Text>
          </View>
        </View>

        {/* Insight Card */}
        <View style={styles.insightCard}>
          <View style={styles.bulbIcon}>
            <Ionicons name="bulb" size={20} color="black" />
          </View>
          <Text style={styles.insightText}>
            A <Text style={styles.boldText}>1.5% expense ratio</Text> reduced your potential gains by <Text style={[styles.boldText, { textDecorationLine: 'underline' }]}>₹12,400</Text> over 5 years.
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
                <View style={styles.statIcon}>
                    <Ionicons name="cash-outline" size={20} color="black" />
                </View>
                <Ionicons name="receipt-outline" size={24} color="#E5E7EB" />
            </View>
            <Text style={styles.statCardLabel}>TOTAL FEES</Text>
            <Text style={styles.statCardValue}>500</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
                <View style={[styles.statIcon, { backgroundColor: 'black' }]}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>%</Text>
                </View>
                <Ionicons name="trending-up" size={24} color="#E5E7EB" />
            </View>
            <Text style={styles.statCardLabel}>NET PROFIT</Text>
            <Text style={styles.statCardValue}>45.2%</Text>
          </View>
        </View>

        {/* Optimize Button */}
        <TouchableOpacity style={styles.optimizeButton}>
          <Text style={styles.optimizeButtonText}>Optimize Portfolio</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  waterfallHeader: {
    marginBottom: 40,
  },
  waterfallLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  netValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  netValue: {
    fontSize: 40,
    fontWeight: '900',
    color: '#111827',
  },
  netLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  returnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  returnsBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  returnsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  categoryAvg: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 250,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  barGroup: {
    alignItems: 'center',
    gap: 12,
    position: 'relative',
  },
  bar: {
    width: 48,
    borderRadius: 24,
    // Gradient effect simulated with opacity or just solid color
  },
  barLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  expenseLine: {
    position: 'absolute',
    top: -40,
    left: 24,
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  expenseLabelContainer: {
    position: 'absolute',
    top: -80,
    left: -40,
    width: 120,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  expenseLabelTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 2,
  },
  expenseValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  netLabelFloating: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
  },
  netLabelFloatingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 20,
    borderRadius: 24,
    gap: 16,
    marginBottom: 32,
  },
  bulbIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#111827',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 30,
    height: 140,
    justifyContent: 'space-between',
  },
  statIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  optimizeButton: {
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
    marginBottom: 20,
  },
  optimizeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
