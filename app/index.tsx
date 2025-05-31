import { Ionicons } from '@expo/vector-icons';
import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import TimeItem from './components/timeItem';
import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('stopwatch.db');

interface Item {
  id: number;
  itemName: string;
  timeMs: number;
}

interface HeaderProps {
  onAddItem(): void;
}

function HeaderIndex({ onAddItem }: HeaderProps) {
  return (
    <View style={stylesHeader.header}>
      <Pressable onPress={() => console.log('Menu clicked')}>
        <Ionicons name="menu" size={24} color="black" />
      </Pressable>
      <Text style={stylesHeader.heading}>your time</Text>
      <Pressable onPress={() => {console.log('Plus clicked'); onAddItem();}}>
        <Ionicons name="add" size={24} color="black" />
      </Pressable>
    </View>
  );
}

export default function Index() {
  const [items, setItems] = useState<Item[]>([]);

  // Fetch items from DB
  const fetchItems = () => {
    db.getAllAsync<Item>('SELECT * FROM stopwatch ORDER BY id ASC').then(setItems);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Add item to DB
  function addItem() {
    db.runAsync(
      'INSERT INTO stopwatch (itemName, timeMs) VALUES (?, ?)',
      ['untilted', 0]
    ).then(fetchItems);
  }

  // Delete item from DB and update state
  function deleteItem(id: number) {
    db.runAsync('DELETE FROM stopwatch WHERE id = ?', [id]).then(fetchItems);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <HeaderIndex onAddItem={addItem} />,
        }}
      />
      <ScrollView style={styles.itemsWrapper}>
        <View style={{ height: 40 }} />
        {
          items.map((item) => (
            <TimeItem
              key={item.id}
              id={item.id}
              shownTime={msToTime(item.timeMs)}
              itemName={item.itemName}
              onDelete={deleteItem}
            />
          ))
        }
      </ScrollView>
    </View>
  );
}

// Helper to convert ms to hh:mm:ss
function msToTime(ms: number) {
  const sec = Math.floor((ms / 1000) % 60);
  const min = Math.floor((ms / (1000 * 60)) % 60);
  const hr = Math.floor(ms / (1000 * 60 * 60));
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hr)}:${pad(min)}:${pad(sec)}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eaed',
  },
  itemsWrapper: {
    paddingHorizontal: 40,
    alignSelf: "center",
    width: "100%",
    maxWidth: 600,
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
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: "normal",
    fontFamily: "monospace, sans-serif",
    alignContent: "center",
    userSelect: "none",
  },
});