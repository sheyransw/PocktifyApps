import { AppProvider } from '@/context/AppContext';
import { Tabs } from 'expo-router';
import { LayoutDashboard, TrendingUp, TrendingDown, ChartBar as BarChart3 } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <AppProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            bottom: 0,
            left: -60,
            right: 0,
            height: 72,
            paddingTop: 12,
            paddingBottom: 12,
            paddingHorizontal: 24,
            borderTopWidth: 0,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -1,
            },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          },
          tabBarActiveTintColor: '#7E57C2',
          tabBarInactiveTintColor: '#B0B0B0',
          tabBarLabelStyle: {
            fontSize: 9,
            fontWeight: '500',
            marginTop: 0,
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
          tabBarItemStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarStyle: { display: 'none' },
            tabBarButton: () => null,
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ size, color }) => (
              <LayoutDashboard size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="income"
          options={{
            title: 'Income',
            tabBarIcon: ({ size, color }) => (
              <TrendingUp size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="expense"
          options={{
            title: 'Expanse',
            tabBarIcon: ({ size, color }) => (
              <TrendingDown size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ size, color }) => (
              <BarChart3 size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </AppProvider>
  );
}
