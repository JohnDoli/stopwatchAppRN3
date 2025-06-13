import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, TextInput, Keyboard } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useTimerContext } from "./timerContext";

const db = SQLite.openDatabaseSync('stopwatch.db');

function HeaderStopwatchScreen({ itemName, id, onRename }: { itemName: string, id: number, onRename: (name: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(itemName);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setName(itemName);
  }, [itemName]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleSubmit = () => {
    setEditing(false);
    if (name.trim() && name !== itemName) {
      onRename(name.trim());
    }
    Keyboard.dismiss();
  };

  return (
    <View style={stylesHeader.header}>
      <Link href="/" asChild>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Link>
      {editing ? (
        <TextInput
          ref={inputRef}
          value={name}
          onChangeText={setName}
          onBlur={handleSubmit}
          onSubmitEditing={handleSubmit}
          style={[
            stylesHeader.heading, 
            { 
              minWidth: 100, 
              backgroundColor: "#eee", 
              borderRadius: 6, 
              paddingHorizontal: 8,
              height: 36,
              lineHeight: 24, 
              paddingVertical: 6, 
              textAlignVertical: "center", 
            }
          ]}
          maxLength={32}
        />
      ) : (
        <Text
          style={stylesHeader.heading}
          onPress={() => setEditing(true)}
        >
          {itemName}
        </Text>
      )}
      <Text style={stylesHeader.id}>#{id}</Text>
    </View>
  );
}

export default function StopwatchScreen() {
  const { id, itemName = "untilted" } = useLocalSearchParams<{ id: string, itemName?: string }>();
  const itemId = Number(id);

  const [time, setTime] = useState('00:00:00');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [paused, setPaused] = useState(true);
  const [currentName, setCurrentName] = useState(itemName);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDbUpdateRef = useRef<number>(0);
  const globalTimerRunningRef = useRef(false); 
  const { anyRunning, setAnyRunning, runningTimerId, setRunningTimerId } = useTimerContext();

  function pad(unit: number) {
    return unit.toString().padStart(2, '0');
  }

  function msToTime(ms: number) {
    const sec = Math.floor((ms / 1000) % 60);
    const min = Math.floor((ms / (1000 * 60)) % 60);
    const hr = Math.floor(ms / (1000 * 60 * 60));
    return `${pad(hr)}:${pad(min)}:${pad(sec)}`;
  }

  function updateTimer() {
    setElapsedTime(prev => {
      const newElapsed = prev + 1000;
      setTime(msToTime(newElapsed));

      // Save to DB every second
      const now = Date.now();
      if (!lastDbUpdateRef.current || now - lastDbUpdateRef.current >= 1000) {
        if (!isNaN(itemId)) {
          db.runAsync('UPDATE stopwatch SET timeMs = ? WHERE id = ?', [newElapsed, itemId]);
        }
        lastDbUpdateRef.current = now;
      }
      return newElapsed;
    });
  }

  function startTimer() {
    if (paused && !globalTimerRunningRef.current && !anyRunning) {
      setPaused(false);
      intervalRef.current = setInterval(updateTimer, 1000);
      globalTimerRunningRef.current = true;
      setAnyRunning(true);
      setRunningTimerId(itemId);
    }
  }

  function stopTimer() {
    if (!paused) {
      setPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      globalTimerRunningRef.current = false;
      setAnyRunning(false);
      setRunningTimerId(null);
    }
  }

  function resetTimer() {
    setPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setElapsedTime(0);
    setTime('00:00:00');
    if (!isNaN(itemId)) {
      db.runAsync('UPDATE stopwatch SET timeMs = 0 WHERE id = ?', [itemId]);
    }
    globalTimerRunningRef.current = false;
    setAnyRunning(false);
    setRunningTimerId(null);
  }

  useEffect(() => {
    let dbInterval: NodeJS.Timeout | null = null;

    const fetchTime = async () => {
      if (!isNaN(itemId) && paused) {
        const row = await db.getFirstAsync<{ timeMs: number }>(
          'SELECT timeMs FROM stopwatch WHERE id = ?',
          [itemId]
        );
        if (row) {
          setElapsedTime(row.timeMs);
          setTime(msToTime(row.timeMs));
        }
      }
    };

    fetchTime();

    if (paused) {
      dbInterval = setInterval(fetchTime, 1000);
    }

    return () => {
      if (dbInterval) clearInterval(dbInterval);
    };
  }, [itemId, paused]);

  useEffect(() => {
    if (runningTimerId === itemId && anyRunning) {
      setPaused(false);
      if (!intervalRef.current) {
        intervalRef.current = setInterval(updateTimer, 1000);
        globalTimerRunningRef.current = true;
      }
    } else {
      setPaused(true);
      globalTimerRunningRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [itemId, runningTimerId, anyRunning]);

  useEffect(() => {
    const fetchName = async () => {
      if (!isNaN(itemId)) {
        const row = await db.getFirstAsync<{ itemName: string }>(
          'SELECT itemName FROM stopwatch WHERE id = ?',
          [itemId]
        );
        if (row && row.itemName !== currentName) setCurrentName(row.itemName);
      }
    };
    fetchName();
  }, [itemId]);

  const handleRename = async (newName: string) => {
    if (!isNaN(itemId)) {
      await db.runAsync('UPDATE stopwatch SET itemName = ? WHERE id = ?', [newName, itemId]);
      setCurrentName(newName);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <HeaderStopwatchScreen itemName={currentName} id={itemId} onRename={handleRename} />,
        }}
      />
      <View style={styles.menu}>
        <Text style={styles.time}>{time}</Text>
        <View style={styles.containerButtons}>
          <Pressable
            style={paused ? styles.buttonStart : styles.buttonStop}
            onPress={paused ? startTimer : stopTimer}
          >
            <Text style={styles.buttonText}>{paused ? "start" : "stop"}</Text>
          </Pressable>
          <Pressable style={styles.buttonStop} onPress={resetTimer}>
            <Text style={styles.buttonText}>reset</Text>
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
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 8
  },
  containerButtons: {
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
  id: {
    fontSize: 12,
    fontWeight: "normal",
    fontFamily: "monospace, sans-serif",
    color: "#888",
  },
});