import React, { useMemo, useState, useRef, useContext } from 'react';
import { useAppContext } from '@/context/AppContext';
import { PieChart } from 'react-native-svg-charts';


import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ChartBar as BarChart3, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Analytics() {

  const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    Makanan: '#F87171',
    Transportasi: '#60A5FA',
    Hiburan: '#FBBF24',
    Kesehatan: '#34D399',
    Lainnya: '#A78BFA',
  };
  return colors[category] || '#D1D5DB';
};

 const { incomeList, expenseList } = useAppContext();


  const expenseCategories = useMemo(() => {
  const categoryTotals: { [key: string]: number } = {};

  expenseList.forEach(({ category, amount }) => {
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    categoryTotals[category] += amount;
  });

  const totalExpense = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  return Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    percentage: totalExpense === 0 ? 0 : (amount / totalExpense) * 100,
    color: getCategoryColor(category),
  }));
}, [expenseList]);



  const [selectedMonth, setSelectedMonth] = useState('Nov');
  const scrollViewRef = useRef<ScrollView | null>(null);


  const goBack = () => {
    router.back();
  };

  // Sample data for charts
  const monthlyDataWithCurrent = useMemo(() => {
  const dataPerMonth: { [key: string]: { income: number; expense: number } } = {};

   incomeList.forEach(({ amount, date }) => {
    const month = new Date(date).toLocaleString('default', { month: 'short' });
    if (!dataPerMonth[month]) dataPerMonth[month] = { income: 0, expense: 0 };
    dataPerMonth[month].income += amount;
  });

 expenseList.forEach(({ amount, date }) => {
    const month = new Date(date).toLocaleString('default', { month: 'short' });
    if (!dataPerMonth[month]) dataPerMonth[month] = { income: 0, expense: 0 };
    dataPerMonth[month].expense += amount;
  });

const currentMonth = new Date().toLocaleString('default', { month: 'short' });

  return Object.entries(dataPerMonth).map(([month, { income, expense }]) => ({
    month,
    income,
    expense,
    current: month === currentMonth,
  }));
}, [incomeList, expenseList]);


  const currentMonth = new Date().toLocaleString('default', { month: 'short' });

const currentMonthData = monthlyDataWithCurrent.find((m) => m.current) || monthlyDataWithCurrent[0];
const budgetUsed = currentMonthData.income === 0 
  ? 0 
  : (currentMonthData.expense / currentMonthData.income) * 100;


  const maxAmount = Math.max(...monthlyDataWithCurrent.map(m => Math.max(m.income, m.expense)));

  const formatCurrency = (amount: number) => {
    return `Rp ${(amount / 1000000).toFixed(1)}M`;
  };

  const scrollLeft = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const scrollRight = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const renderBarChart = () => {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Income vs Expenses</Text>
        
        <View style={styles.chartWrapper}>
          {/* Left Arrow */}
          <TouchableOpacity style={styles.arrowButton} onPress={scrollLeft}>
            <ChevronLeft size={20} color="#8B5CF6" strokeWidth={2} />
          </TouchableOpacity>

          {/* Scrollable Bar Chart */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.barChartContainer}
            style={styles.barChartScroll}
          >
            {monthlyDataWithCurrent.map((data, index) => (
              <TouchableOpacity
                key={index}
                style={styles.barGroup}
                onPress={() => setSelectedMonth(data.month)}
              >
                <View style={styles.barContainer}>
                  {/* Income Bar (Left) */}
                  <View 
                    style={[
                      styles.bar, 
                      styles.incomeBar,
                      data.current && styles.currentIncomeBar,
                      { height: (data.income / maxAmount) * 120 }
                    ]} 
                  />
                  {/* Expense Bar (Right) */}
                  <View 
                    style={[
                      styles.bar, 
                      styles.expenseBar,
                      data.current && styles.currentExpenseBar,
                      { height: (data.expense / maxAmount) * 120 }
                    ]} 
                  />
                </View>
                <Text style={[
                  styles.monthLabel, 
                  data.current && styles.currentMonthLabel
                ]}>
                  {data.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Right Arrow */}
          <TouchableOpacity style={styles.arrowButton} onPress={scrollRight}>
            <ChevronRight size={20} color="#8B5CF6" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#9CA3AF' }]} />
            <Text style={styles.legendText}>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#8B5CF6' }]} />
            <Text style={styles.legendText}>Expenses</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderBudgetSection = () => {
    return (
      <View style={styles.budgetContainer}>
        <View style={styles.budgetRow}>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Total Income</Text>
            <Text style={styles.budgetAmount}>{formatCurrency(currentMonthData.income)}</Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Total Expenses</Text>
            <Text style={[styles.budgetAmount, { color: '#8B5CF6' }]}>
              {formatCurrency(currentMonthData.expense)}
            </Text>
          </View>
        </View>
        
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>{Math.round(budgetUsed)}% of your budget</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min(budgetUsed, 100)}%` }

              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            You've spent {formatCurrency(currentMonthData.expense)} of {formatCurrency(currentMonthData.income)}
          </Text>
        </View>
      </View>
    );
  };

  const renderDonutChart = () => {
  const pieData = expenseCategories
    .filter(item => item.percentage > 0)
    .map((item, index) => ({
      key: `${item.name}-${index}`,
      value: item.percentage,
      svg: { fill: item.color },
      arc: { outerRadius: '100%', innerRadius: '70%' },
    }));

  return (
    <View style={styles.donutContainer}>
      <Text style={styles.donutTitle}>Expenses by category (%)</Text>
      <View style={styles.donutContent}>
        <View style={styles.categoryList}>
          {expenseCategories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <Text style={[styles.categoryPercentage, { color: category.color }]}>
                {category.percentage.toFixed(2)}%
              </Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
          ))}
        </View>

        <PieChart style={{ height: 150, width: 150 }} data={pieData} />
      </View>
    </View>
  );


  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#8B5CF6', '#A78BFA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <Text style={styles.pageTitle}>Analytics</Text>
            <Text style={styles.pageSubtitle}>Financial insights & trends</Text>
          </View>
          
          <View style={styles.chartIcon}>
            <BarChart3 size={24} color="#FFFFFF" strokeWidth={2} />
          </View>
        </View>
      </LinearGradient>

      {/* Bar Chart */}
      {renderBarChart()}

      {/* Budget Section */}
      {renderBudgetSection()}

      {/* Donut Chart */}
      {renderDonutChart()}

      {/* Bottom padding for navigation */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    alignItems: 'center',
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 1,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#F3F4F6',
    fontWeight: '500',
  },
  chartIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  barChartScroll: {
    flex: 1,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 10,
  },
  barGroup: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 12,
    marginHorizontal: 2,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  incomeBar: {
    backgroundColor: 'rgba(156, 163, 175, 0.4)', // Faded gray
  },
  currentIncomeBar: {
    backgroundColor: '#9CA3AF', // Higher opacity gray
  },
  expenseBar: {
    backgroundColor: 'rgba(139, 92, 246, 0.4)', // Faded purple
  },
  currentExpenseBar: {
    backgroundColor: '#8B5CF6', // Full opacity purple
  },
  monthLabel: {
    fontSize: 12,
    color: '#D1D5DB', // Light gray
    fontWeight: '500',
  },
  currentMonthLabel: {
    color: '#8B5CF6', // Bold purple
    fontWeight: '700',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  budgetContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  budgetItem: {
    flex: 1,
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 20,
    color: '#1F2937',
    fontWeight: '700',
  },
  progressSection: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '700',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  donutContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  donutTitle: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '700',
    marginBottom: 20,
  },
  donutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryList: {
    flex: 1,
    paddingRight: 20,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryPercentage: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  donutChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutChart: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutBackground: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
  },
  donutSegment: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: 0,
    left: 0,
  },
  donutInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currencySymbol: {
    fontSize: 18,
    color: '#D1D5DB',
    fontWeight: '300',
  },
  bottomPadding: {
    height: 100,
  },
});