import { Ionicons } from '@expo/vector-icons';
import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import TimeItem from './components/timeItem';
import { Stack } from 'expo-router';
import React, { useState } from 'react';


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
  
  const [items, setItems] = useState([{ shownTime: '00:00:00' }]);


  function addItem() {
    setItems(prevItems => [...prevItems, { shownTime: '00:00:00' }]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <HeaderIndex onAddItem={addItem} />,
        }}
      />
      <ScrollView style={styles.itemsWrapper}>
        <View style={{ height: 40, }}></View>
        {
          items.map((item, index) => {
            return <TimeItem key={index} shownTime={item.shownTime} />
          })
        }
      </ScrollView>
    </View>
  );
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