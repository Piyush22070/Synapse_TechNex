

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { FUND_TRADINGVIEW_SYMBOLS } from '../../constants/fund-tradingview-symbols';
// Gemini-powered insight fetcher
async function fetchGeminiInsight(fund: {
  name: string;
  returns_1yr?: number;
  returns_3yr?: number;
  returns_5yr?: number;
  risk_level?: string;
  fund_size_cr?: number;
  category?: string;
  sub_category?: string;
}) {
  // Replace with your Gemini endpoint URL
  const endpoint = 'https://your-gemini-endpoint.com/insight';
  // Example payload, adjust as needed
  const body = {
    name: fund.name,
    returns_1yr: fund.returns_1yr,
    returns_3yr: fund.returns_3yr,
    returns_5yr: fund.returns_5yr,
    risk_level: fund.risk_level,
    fund_size_cr: fund.fund_size_cr,
    category: fund.category,
    sub_category: fund.sub_category,
  };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to fetch insight');
  const data = await res.json();
  return data.insight as string;
}


// Helper to generate TradingView widget HTML
function getTradingViewWidgetHtml(symbol: string, interval: string) {
  const width = Math.round(Dimensions.get('window').width - 48);
  return '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
    '<style>body { background: #000; margin: 0; }</style>' +
    '</head>' +
    '<body>' +
    '<div id="tradingview_widget"></div>' +
    '<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>' +
    '<script type="text/javascript">' +
    'new TradingView.widget({' +
    '  container_id: "tradingview_widget",' +
    '  width: ' + width + ',' +
    '  height: 250,' +
    '  symbol: "' + symbol + '",' +
    '  interval: "' + interval + '",' +
    '  timezone: "Asia/Kolkata",' +
    '  theme: "dark",' +
    '  style: "1",' +
    '  locale: "en",' +
    '  backgroundColor: "#000",' +
    '  gridColor: "#fff",' +
    '  hide_top_toolbar: true,' +
    '  hide_legend: true,' +
    '  hide_side_toolbar: true,' +
    '  withdateranges: true,' +
    '  allow_symbol_change: false,' +
    '  save_image: false,' +
    '  studies: [],' +
    '  support_host: "https://www.tradingview.com"' +
    '});' +
    '</script>' +
    '</body>' +
    '</html>';
}


const timeRanges = ['1M', '6M', '1Y', '3Y', '5Y', 'ALL'];
const intervalMap: Record<string, string> = {
  '1M': 'D', // Daily
  '6M': 'W', // Weekly
  '1Y': 'M', // Monthly
  '3Y': 'M',
  '5Y': 'M',
  'ALL': 'M',
};


export default function FundDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedRange, setSelectedRange] = useState('1Y');
  const [chartKey, setChartKey] = useState(0); // To force WebView reload


  // Find the fund name from id (id is fund name or code)
  // Try to match by name first, fallback to code if needed
  let fundName = typeof id === 'string' ? decodeURIComponent(id) : '';
  // If id is a code, find the name from MUTUAL_FUND_CATEGORIES
  if (!FUND_TRADINGVIEW_SYMBOLS[fundName]) {
    try {
      const { MUTUAL_FUND_CATEGORIES } = require('../../constants/funds');
      for (const cat of MUTUAL_FUND_CATEGORIES) {
        for (const fund of cat.funds) {
          if (fund.code === id) {
            fundName = fund.name;
            break;
          }
        }
      }
    } catch {}
  }
  const tradingViewSymbol = FUND_TRADINGVIEW_SYMBOLS[fundName] || 'NSE:ABFRL';
  const tradingViewInterval = intervalMap[selectedRange] || 'M';

  // When time range changes, reload the chart
  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    setChartKey((k) => k + 1); // Force WebView reload
  };

  // Live fund data state
  const [fundData, setFundData] = useState<any>(null);
  const [fundLoading, setFundLoading] = useState(true);
  const [fundError, setFundError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setFundLoading(true);
    setFundError(null);
    // Find code for this fund
    let code = id;
    let name = fundName;
    try {
      const { MUTUAL_FUND_CATEGORIES } = require('../../constants/funds');
      for (const cat of MUTUAL_FUND_CATEGORIES) {
        for (const fund of cat.funds) {
          if (fund.name === fundName) code = fund.code;
          if (fund.code === id) name = fund.name;
        }
      }
    } catch {}
    fetch(`https://api.mfapi.in/mf/${code}`)
      .then(res => res.json())
      .then(json => {
        if (cancelled) return;
        const navToday = json.data[0] ? parseFloat(json.data[0].nav) : null;
        // Find NAV closest to 1 year ago
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const nav1y = json.data.find(d => {
          const [dd, mm, yyyy] = d.date.split('-');
          const dt = new Date(`${yyyy}-${mm}-${dd}`);
          return Math.abs(dt.getTime() - oneYearAgo.getTime()) < 1000 * 60 * 60 * 24 * 15;
        });
        const nav1yValue = nav1y ? parseFloat(nav1y.nav) : null;
        let return1y: number | null = null;
        if (navToday && nav1yValue) {
          return1y = ((navToday - nav1yValue) / nav1yValue) * 100;
        }
        setFundData({
          name,
          nav: navToday,
          return1y,
          // Add more fields as needed, fallback to defaults
          min_lumpsum: 10000,
          expense_ratio: 1.5,
          fund_size_cr: 2400,
          fund_age_yr: 5,
          sortino: 0.5,
          alpha: 2.0,
          sd: 10.0,
          beta: 1.0,
          sharpe: 0.8,
          risk_level: 'High',
          amc_name: 'HDFC Mutual Fund',
          rating: 4.5,
          category: 'Equity',
          sub_category: 'Mid Cap',
        });
      })
      .catch(() => {
        if (!cancelled) setFundError('Could not load fund data');
      })
      .finally(() => {
        if (!cancelled) setFundLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, fundName]);

  // Gemini insight state
  const [insight, setInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  useEffect(() => {
    if (!fundData) return;
    let cancelled = false;
    setInsightLoading(true);
    setInsightError(null);
    fetchGeminiInsight(fundData)
      .then((text) => {
        if (!cancelled) setInsight(text);
      })
      .catch((e) => {
        if (!cancelled) setInsightError('Could not load insight');
      })
      .finally(() => {
        if (!cancelled) setInsightLoading(false);
      });
    return () => { cancelled = true; };
  }, [fundData]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerSubtitle}>GROWTH FUND</Text>
            <Text style={styles.headerTitle}>{fundData ? fundData.name : '--'}</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Price Info */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{fundData && fundData.nav !== null ? `₹${fundData.nav.toFixed(2)}` : '--'}</Text>
          <View style={styles.changeContainer}>
            <View style={styles.changeBadge}>
              <Ionicons name="trending-up" size={12} color="black" />
              <Text style={styles.changeText}>{fundData && fundData.return1y !== null ? `${fundData.return1y > 0 ? '+' : ''}${fundData.return1y.toFixed(2)}%` : '--'}</Text>
            </View>
            <Text style={styles.changeLabel}>1Y Change</Text>
          </View>
        </View>

        {/* TradingView Chart */}
        <View style={styles.graphContainer}>
          <WebView
            key={chartKey}
            style={{ flex: 1, backgroundColor: 'black', borderRadius: 16, overflow: 'hidden' }}
            originWhitelist={["*"]}
            source={{ html: getTradingViewWidgetHtml(tradingViewSymbol, tradingViewInterval) }}
            scrollEnabled={false}
            javaScriptEnabled={true}
            automaticallyAdjustContentInsets={false}
          />
        </View>

        {/* Time Range Selector */}
        <View style={styles.rangeSelector}>
          {timeRanges.map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.rangeButton, selectedRange === range && styles.rangeButtonActive]}
              onPress={() => handleRangeChange(range)}
            >
              <Text style={[styles.rangeText, selectedRange === range && styles.rangeTextActive]}>{range}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Compare Button */}
        <TouchableOpacity
          style={styles.compareButton}
          onPress={() => {
            // Pass all fund details as params for auto-filling in predict-dashboard
            router.push({
              pathname: '/fund/predict-dashboard',
              params: {
                ...fundData,
                min_lumpsum: fundData.min_lumpsum || 10000,
                expense_ratio: fundData.expense_ratio || 1.5,
                fund_size_cr: fundData.fund_size_cr || 2000,
                sortino: fundData.sortino || 0.5,
                alpha: fundData.alpha || 2.0,
                sd: fundData.sd || 10.0,
                beta: fundData.beta || 1.0,
                sharpe: fundData.sharpe || 0.8,
                risk_level: fundData.risk_level || 3,
                amc_name: fundData.amc_name || 'HDFC Mutual Fund',
                rating: fundData.rating || 4.5,
                code: id,
                name: fundData.name,
              },
            });
          }}
        >
          <Ionicons name="git-compare-outline" size={20} color="black" />
          <Text style={styles.compareButtonText}>Predict</Text>
        </TouchableOpacity>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MIN INVEST</Text>
            <Text style={styles.statValue}>₹500</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>FUND SIZE</Text>
            <View style={styles.statValueContainer}>
                <Text style={styles.statValue}>₹2.4k</Text>
                <Text style={styles.statUnit}>Cr</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>RISK LEVEL</Text>
            <View style={styles.riskContainer}>
                <Ionicons name="flash" size={12} color="black" />
                <Text style={styles.statValue}>High</Text>
            </View>
          </View>
        </View>

        {/* Performance Insight (Gemini-powered) */}
        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Ionicons name="trending-up" size={24} color="black" />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Performance Insight</Text>
            {insightLoading ? (
              <Text style={styles.insightText}>Loading insight...</Text>
            ) : insightError ? (
              <Text style={styles.insightText}>{insightError}</Text>
            ) : insight ? (
              <Text style={styles.insightText}>{insight}</Text>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#6B7280',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  changeLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  graphContainer: {
    height: 250,
    marginBottom: 32,
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    top: 0,
    right: 80,
    backgroundColor: 'black',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    zIndex: 10,
  },
  tooltipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    backgroundColor: 'black',
    transform: [{ rotate: '45deg' }],
  },
  graphLineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  graphLine: {
    width: '100%',
    height: 100,
    borderTopWidth: 4,
    borderTopColor: 'black',
    borderRadius: 100, // Fake curve
    transform: [{ scaleX: 1.5 }, { rotate: '-10deg' }],
  },
  graphDot: {
    position: 'absolute',
    top: 80,
    right: 100,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: 'black',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  axisLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  rangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 30,
    padding: 4,
    marginBottom: 24,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 26,
  },
  rangeButtonActive: {
    backgroundColor: 'black',
  },
  rangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  rangeTextActive: {
    color: 'white',
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
    marginBottom: 32,
  },
  compareButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'flex-start',
    height: 100,
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  statUnit: {
    fontSize: 12,
    color: '#6B7280',
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB', // Or white with border
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 16,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#111827',
  },
});
