import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// Custom FAB component
const CustomTabBarButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow
    }}
    onPress={onPress}
  >
    <View style={{
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {children}
    </View>
  </TouchableOpacity>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 30,
          height: 70,
          ...styles.shadow,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#9CA3AF',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
              <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
              <Ionicons name={focused ? "pie-chart" : "pie-chart-outline"} size={24} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      
      {/* Middle FAB Button - pointing to a modal or action */}
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="add" size={30} color="white" />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          ),
        }}
        listeners={({ navigation }) => ({
            tabPress: (e) => {
                e.preventDefault();
                router.push({
                  pathname: '/fund/compare-benchmark',
                  params: {
                    min_sip: 5000,
                    min_lumpsum: 10000,
                    expense_ratio: 1.5,
                    fund_size_cr: 2000,
                    fund_age_yr: 5,
                    sortino: 0.5,
                    alpha: 2.0,
                    sd: 10.0,
                    beta: 1.0,
                    sharpe: 0.8,
                    risk_level: 3,
                    amc_name: 'HDFC Mutual Fund',
                    rating: 4.5,
                    category: 'Equity',
                    sub_category: 'FoFs Domestic',
                  },
                });
            },
        })}
      />

      <Tabs.Screen
        name="analysis"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
              <Ionicons name={focused ? "bar-chart" : "bar-chart-outline"} size={24} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
              <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />

      {/* Hide other screens from tabs if they exist in the folder */}
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
    elevation: 5,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'black',
    marginTop: 4,
  }
});
