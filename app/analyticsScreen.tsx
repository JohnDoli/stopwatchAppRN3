import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('stopwatch.db');

interface Item {
  id: number;
  itemName: string;
  timeMs: number;
}

interface ChartData {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

function HeaderAnalyticsScreen() {
  return (
    <View style={stylesHeader.header}>
      <Link href="/" asChild>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Link>
      <Text style={stylesHeader.heading}>analytics</Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

export default function AnalyticsScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totalTime, setTotalTime] = useState(0);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#6C5CE7', '#A29BFE', '#FD79A8', '#E84393', '#00B894'
  ];

  function msToTime(ms: number) {
    const sec = Math.floor((ms / 1000) % 60);
    const min = Math.floor((ms / (1000 * 60)) % 60);
    const hr = Math.floor(ms / (1000 * 60 * 60));
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hr)}:${pad(min)}:${pad(sec)}`;
  }

  function msToHours(ms: number) {
    return (ms / (1000 * 60 * 60)).toFixed(1);
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await db.getAllAsync<Item>('SELECT * FROM stopwatch ORDER BY timeMs DESC');
        setItems(result);
        
        const total = result.reduce((sum, item) => sum + item.timeMs, 0);
        setTotalTime(total);

        // Filter out items with 0 time and create chart data
        const activeItems = result.filter(item => item.timeMs > 0);
        
        if (activeItems.length === 0) {
          setChartData([]);
          return;
        }

        const data: ChartData[] = activeItems.map((item, index) => ({
          name: item.itemName || `Item ${item.id}`,
          population: item.timeMs,
          color: colors[index % colors.length],
          legendFontColor: '#333',
          legendFontSize: 14,
        }));

        setChartData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchItems();
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  if (chartData.length === 0) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            header: () => <HeaderAnalyticsScreen />,
          }}
        />
        <View style={styles.emptyContainer}>
          <Ionicons name="analytics-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No data to display</Text>
          <Text style={styles.emptySubtext}>Start tracking some activities to see analytics</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <HeaderAnalyticsScreen />,
        }}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Total Time Tracked</Text>
          <Text style={styles.totalTime}>{msToTime(totalTime)}</Text>
          <Text style={styles.totalHours}>{msToHours(totalTime)} hours</Text>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Time Distribution</Text>
          <PieChart
            data={chartData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            center={[70, 0]}
            absolute={false}
            hasLegend={false}
          />
        </View>

        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Activities</Text>
          {chartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: item.color }]} />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendName}>{item.name}</Text>
                <Text style={styles.legendTime}>{msToTime(item.population)}</Text>
              </View>
              <Text style={styles.legendPercentage}>
                {((item.population / totalTime) * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Statistics</Text>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Activities:</Text>
            <Text style={styles.statValue}>{items.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Active Activities:</Text>
            <Text style={styles.statValue}>{chartData.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Average Time:</Text>
            <Text style={styles.statValue}>
              {chartData.length > 0 ? msToTime(totalTime / chartData.length) : '00:00:00'}
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eaed',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#888',
    marginTop: 16,
    fontFamily: 'monospace, sans-serif',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'monospace, sans-serif',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'monospace, sans-serif',
    marginBottom: 8,
  },
  totalTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'monospace, sans-serif',
  },
  totalHours: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'monospace, sans-serif',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'monospace, sans-serif',
    marginBottom: 16,
    textAlign: 'center',
  },
  legendContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'monospace, sans-serif',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'monospace, sans-serif',
  },
  legendTime: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'monospace, sans-serif',
    marginTop: 2,
  },
  legendPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'monospace, sans-serif',
    minWidth: 50,
    textAlign: 'right',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'monospace, sans-serif',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'monospace, sans-serif',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'monospace, sans-serif',
  },
});

const stylesHeader = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 64,
    padding: 16,
    backgroundColor: "#fff",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: "normal",
    fontFamily: "monospace, sans-serif",
    alignContent: "center",
  },
});
