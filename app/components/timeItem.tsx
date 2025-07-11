import { Link } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Animated, PanResponder } from "react-native";
import { Ionicons } from '@expo/vector-icons';
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
    const [isSwipedLeft, setIsSwipedLeft] = React.useState(false);
    const translateX = React.useRef(new Animated.Value(0)).current;
    const deleteButtonOpacity = React.useRef(new Animated.Value(0)).current;
    
    const panResponder = React.useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 50;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx < 0 && gestureState.dx > -120) {
                    translateX.setValue(gestureState.dx);
                    // Show delete button as we swipe left
                    const opacity = Math.min(Math.abs(gestureState.dx) / 80, 1);
                    deleteButtonOpacity.setValue(opacity);
                } else if (gestureState.dx > 0 && isSwipedLeft) {
                    // Allow swiping back to close
                    const newValue = Math.max(-80 + gestureState.dx, gestureState.dx);
                    translateX.setValue(newValue);
                    const opacity = Math.max(0, 1 - gestureState.dx / 80);
                    deleteButtonOpacity.setValue(opacity);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx < -50 && !isSwipedLeft) {
                    // Swipe left to reveal delete button
                    setIsSwipedLeft(true);
                    Animated.parallel([
                        Animated.spring(translateX, {
                            toValue: -80,
                            useNativeDriver: true,
                            tension: 100,
                            friction: 8,
                        }),
                        Animated.timing(deleteButtonOpacity, {
                            toValue: 1,
                            duration: 200,
                            useNativeDriver: true,
                        })
                    ]).start();
                } else if (gestureState.dx > 20 && isSwipedLeft) {
                    // Swipe right to close
                    setIsSwipedLeft(false);
                    Animated.parallel([
                        Animated.spring(translateX, {
                            toValue: 0,
                            useNativeDriver: true,
                            tension: 100,
                            friction: 8,
                        }),
                        Animated.timing(deleteButtonOpacity, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                        })
                    ]).start();
                } else {
                    // Return to current state
                    Animated.parallel([
                        Animated.spring(translateX, {
                            toValue: isSwipedLeft ? -80 : 0,
                            useNativeDriver: true,
                            tension: 100,
                            friction: 8,
                        }),
                        Animated.timing(deleteButtonOpacity, {
                            toValue: isSwipedLeft ? 1 : 0,
                            duration: 200,
                            useNativeDriver: true,
                        })
                    ]).start();
                }
            },
            onPanResponderTerminate: () => {
                // Return to current state
                Animated.parallel([
                    Animated.spring(translateX, {
                        toValue: isSwipedLeft ? -80 : 0,
                        useNativeDriver: true,
                        tension: 100,
                        friction: 8,
                    }),
                    Animated.timing(deleteButtonOpacity, {
                        toValue: isSwipedLeft ? 1 : 0,
                        duration: 200,
                        useNativeDriver: true,
                    })
                ]).start();
            },
        })
    ).current;

    const handleDelete = () => {
        // Animate out and then delete
        Animated.timing(translateX, {
            toValue: -400,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            onDelete(id);
        });
    };

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
        <View style={styles.itemContainer}>
            {/* Delete button background */}
            <Animated.View 
                style={[
                    styles.deleteBackground,
                    {
                        opacity: deleteButtonOpacity,
                    }
                ]}
            >
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash" size={24} color="white" />
                </TouchableOpacity>
            </Animated.View>

            {/* Main item */}
            <Animated.View
                style={[
                    styles.item,
                    disabled && { backgroundColor: '#bbb', opacity: 0.5, borderColor: '#888', borderWidth: 2 },
                    {
                        transform: [{ translateX }],
                    }
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
        </View>
    );
}

export default TimeItem

const styles = StyleSheet.create({
    itemContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    deleteBackground: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 80,
        backgroundColor: '#e74c3c',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    deleteButton: {
        width: 80,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        zIndex: 2,
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