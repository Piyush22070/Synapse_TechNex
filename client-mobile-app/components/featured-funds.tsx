import { MUTUAL_FUND_CATEGORIES } from '@/constants/funds';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FundApiResponse {
  meta: { scheme_name: string };
  data: { date: string; nav: string }[];
}

interface FundCardData {
  code: string;
  name: string;
  nav: number | null;
  return1y: number | null;
}

const SKELETON_COUNT = 5;

export const FeaturedFunds: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [fundsData, setFundsData] = useState<{ [catId: string]: FundCardData[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const categories = MUTUAL_FUND_CATEGORIES;
  const currentCategory = categories[selectedCategory];

  // Prefetch logic for second category
  useEffect(() => {
    if (categories.length > 1 && !fundsData[categories[1].id]) {
      fetchFundsForCategory(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fundsData[currentCategory.id]) {
      fetchFundsForCategory(selectedCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  async function fetchFundsForCategory(idx: number) {
    const category = categories[idx];
    setIsLoading(true);
    try {
      const results: FundCardData[] = await Promise.all(
        category.funds.map(async (fund) => {
          const res = await fetch(`https://api.mfapi.in/mf/${fund.code}`);
          const json: FundApiResponse = await res.json();
          const navToday = json.data[0] ? parseFloat(json.data[0].nav) : null;
          // Find NAV closest to 1 year ago
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          const nav1y = json.data.find(d => {
            const [dd, mm, yyyy] = d.date.split('-');
            const dt = new Date(`${yyyy}-${mm}-${dd}`);
            return Math.abs(dt.getTime() - oneYearAgo.getTime()) < 1000 * 60 * 60 * 24 * 15; // within 15 days
          });
          const nav1yValue = nav1y ? parseFloat(nav1y.nav) : null;
          let return1y: number | null = null;
          if (navToday && nav1yValue) {
            return1y = ((navToday - nav1yValue) / nav1yValue) * 100;
          }
          return {
            code: fund.code,
            name: fund.name,
            nav: navToday,
            return1y,
          };
        })
      );
      setFundsData(prev => ({ ...prev, [category.id]: results }));
    } catch (e) {
      setFundsData(prev => ({ ...prev, [category.id]: [] }));
    } finally {
      setIsLoading(false);
    }
  }

  const renderSkeleton = () => (
    <View>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonBar} />
          <View style={[styles.skeletonBar, { width: 80, marginTop: 8 }]} />
        </View>
      ))}
    </View>
  );

  const renderFund = ({ item }: { item: FundCardData }) => (
    <TouchableOpacity
      style={styles.fundCard}
      onPress={() => router.push({
        pathname: '/fund/[id]',
        params: { id: item.code, name: item.name }
      })}
    >
      <Text style={styles.fundName}>{item.name}</Text>
      <Text style={styles.fundNav}>NAV: {item.nav !== null ? item.nav.toFixed(2) : '--'}</Text>
      <Text style={styles.fundReturn}>
        {item.return1y !== null ? `${item.return1y > 0 ? '+' : ''}${item.return1y.toFixed(2)}% (1Y)` : '--'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Category Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {categories.map((cat, idx) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.tabPill, idx === selectedCategory && styles.tabPillActive]}
            onPress={() => setSelectedCategory(idx)}
          >
            <Text style={[styles.tabText, idx === selectedCategory && styles.tabTextActive]}>{cat.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Fund List */}
      <View style={styles.fundList}>
        {isLoading || !fundsData[currentCategory.id] ? (
          renderSkeleton()
        ) : (
          <FlatList
            data={fundsData[currentCategory.id]}
            keyExtractor={item => item.code}
            renderItem={renderFund}
            scrollEnabled={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  tabs: {
    flexGrow: 0,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  tabPill: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  tabPillActive: {
    backgroundColor: '#000',
    borderColor: '#fff',
  },
  tabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#fff',
  },
  fundList: {
    gap: 12,
  },
  fundCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#000',
    // Remove shadow for strict black and white
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  fundName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#000',
  },
  fundNav: {
    color: '#000',
    fontSize: 14,
    marginBottom: 4,
  },
  fundReturn: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  skeletonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#000',
  },
  skeletonBar: {
    height: 16,
    backgroundColor: '#000',
    opacity: 0.12,
    borderRadius: 8,
    width: 140,
  },
});
