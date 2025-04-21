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
        <Ionicons name="airplane" size={24} color="black" />
      </Pressable>

      <Text style={stylesHeader.heading}>your time</Text>

      <Pressable onPress={() => {console.log('Plus clicked'); onAddItem();}}>
        <Ionicons name="home" size={24} color="black" />
        <Ionicons name="home" size={24} color="black" />
      </Pressable>
    </View>
  );
}

export default function Index() {
  
  const [items, setItems] = useState([{ text: '00:00:00' }]);

  

  const addItem = () => {
    setItems(prevItems => [...prevItems, { text: '00:00:00' }]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <HeaderIndex onAddItem={addItem} />,
        }}
      />

      <ScrollView style={styles.itemsWrapper}>
        {
          items.map((item, index) => {
            return <TimeItem key={index} text={item.text} />
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
    paddingTop: 40,
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