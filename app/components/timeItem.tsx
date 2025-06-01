import { Link } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Animated, PanResponder } from "react-native";
import * as SQLite from 'expo-sqlite';

interface TimeItemProps {
    id: number;
    shownTime: string;
    itemName: string;
    onDelete(id: number): void;
    disabled?: boolean;
}

function TimeItem({ id, shownTime, itemName, onDelete, disabled }: TimeItemProps) {
    const db = SQLite.openDatabaseSync('stopwatch.db');
    const [dbTime, setDbTime] = React.useState(shownTime);
    const translateX = React.useRef(new Animated.Value(0)).current;
    const panResponder = React.useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx < 0) {
                    translateX.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx < -100) {
                    Animated.timing(translateX, {
                        toValue: -500,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => onDelete(id));
                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
            onPanResponderTerminate: () => {
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            },
        })
    ).current;

    function msToTime(ms: number) {
        const sec = Math.floor((ms / 1000) % 60);
        const min = Math.floor((ms / (1000 * 60)) % 60);
        const hr = Math.floor(ms / (1000 * 60 * 60));
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(hr)}:${pad(min)}:${pad(sec)}`;
    }

    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        const fetchTime = async () => {
            const row = await db.getFirstAsync<{ timeMs: number }>(
                'SELECT timeMs FROM stopwatch WHERE id = ?',
                [id]
            );
            if (row) setDbTime(msToTime(row.timeMs));
        };

        fetchTime();
        interval = setInterval(fetchTime, 1000);

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [id]);

    return (
        <Animated.View
            style={[
                styles.item,
                disabled && { backgroundColor: '#bbb', opacity: 0.5, borderColor: '#888', borderWidth: 2 }
            ]}
            {...(!disabled ? panResponder.panHandlers : {})}
        >
            <Link
                href={{ pathname: "/stopwatchScreen", params: { id, itemName } }}
                asChild
            >
                <TouchableOpacity
                    onPress={() => console.log('Item clicked', id)}
                    disabled={disabled}
                    style={{ opacity: disabled ? 0.7 : 1 }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: 260 }}>
                        <View>
                            <Text style={styles.itemId}>#{id}</Text>
                            <Text style={styles.itemName}>{itemName}</Text>
                        </View>
                        <Text style={styles.itemTime}>{dbTime}</Text>
                    </View>
                </TouchableOpacity>
            </Link>
        </Animated.View>
    );
}

export default TimeItem

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
    },
    itemId: {
        fontSize: 14,
        color: '#888',
        fontFamily: "monospace, sans-serif",
    },
    itemName: {
        fontSize: 20,
        fontWeight: "600",
        fontFamily: "monospace, sans-serif",
    },
    itemTime: {
        fontSize: 20,
        fontWeight: "normal",
        fontFamily: "monospace, sans-serif",
    },
});