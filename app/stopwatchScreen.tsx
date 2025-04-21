import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { useState } from 'react';
import { Text, View, StyleSheet, Pressable, Button } from 'react-native';

function HeaderStopwatchScreen() {
  return (
    <View style={stylesHeader.header}>
      <Link href="/" asChild>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Link>

      <Text style={stylesHeader.heading}>untilted</Text>

      <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target='_blank'>
        <View style={{ width: 24 }} />
      </Link>
    </View>
  );
}

let elapsedTime = 0;
let startTime = 0;
let paused = true;
let intervalID: NodeJS.Timeout;

let secs = 0;
let mins = 0;
let hours = 0;


export default function StopwatchScreen() {
  function updateTimer() {
    elapsedTime = Date.now() - startTime;
  
    secs = Math.floor(elapsedTime / 1000 % 60);
    mins = Math.floor(elapsedTime / (1000 * 60) % 60);
    hours = Math.floor(elapsedTime / (1000 * 60 * 60) % 60);

    const paddedSecs = pad(secs);
    const paddedMins = pad(mins);
    const paddedHours = pad(hours);

    setTime(`${paddedHours}:${paddedMins}:${paddedSecs}`);

    function pad(unit: number) {
      return ("0" + unit).length > 2 ? unit : "0" + unit;
    }
  }

  function startTimer() {
    if (paused) {
      paused = false;
      startTime = Date.now() - elapsedTime; 
      intervalID = setInterval(updateTimer, 75);
    }
  }
  
  function stopTimer() {
    if (!paused) {
      paused = true;
      elapsedTime = Date.now() - startTime;
      clearInterval(intervalID);
    }
  }
  
  function resetTimer() {
    paused = true;
    clearInterval(intervalID);
    elapsedTime = 0;
    startTime = 0;
    secs = 0;
    mins = 0;
    hours = 0;
    setTime('00:00:00');
  }
  
  function flagTimer() {
    // flag current time
  }


  // takzvany react hook
  const [time, setTime] = useState('00:00:00');

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <HeaderStopwatchScreen />,
        }}
      />
    
      <View style={styles.menu}>
        <Text style={styles.time}>{time}</Text>
        <View style={styles.containerButtons}>
          <Pressable style={styles.buttonStart} onPress={() => { startTimer(); console.log('Start'); }}>
            <Text style={styles.buttonText}>start</Text>
          </Pressable>
          <Pressable style={styles.buttonStop} onPress={() => { stopTimer(); console.log('Stop'); }}>
            <Text style={styles.buttonText}>stop</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eaed',
    alignItems: 'center',
  },
  menu: {
    justifyContent: 'space-between',
    padding: 32,
    width: '100%',
    height: '100%',
    maxWidth: 600,
    maxHeight: 1800,
    alignItems: 'center',
  },
  time: {
    marginTop: 64,
    padding: 16,
    color: '#000',
    fontFamily: 'monospace, sans-serif',
    fontSize: 48,
    // backgroundColor: '#666',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 8
  },
  containerButtons: {
    // backgroundColor: '#ddd',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignSelf: 'center',
  },
  buttonStart: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    width: 128,
    backgroundColor: 'rgb(70, 159, 73)',
    borderRadius: 12,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
  },
  buttonStop: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    width: 128,
    backgroundColor: '#c93939',
    borderRadius: 12,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
  },
  buttonText: {
    color: '#fff',
    backgroundColor: '000',
    fontFamily: 'monospace, sans-serif',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4
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