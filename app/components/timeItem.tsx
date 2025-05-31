import { Link } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Animated, PanResponder } from "react-native";

interface TimeItemProps {
    id: number;
    shownTime: string;
    itemName: string;
    onDelete(id: number): void;
}

function TimeItem({ id, shownTime, itemName, onDelete }: TimeItemProps) {
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
                    // Swiped left enough, trigger delete
                    Animated.timing(translateX, {
                        toValue: -500,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => onDelete(id));
                } else {
                    // Not enough, snap back
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

    return (
        <Animated.View
            style={[styles.item, { transform: [{ translateX }] }]}
            {...panResponder.panHandlers}
        >
            <Link href={{ pathname: "/stopwatchScreen", params: { id, itemName } }} asChild>
                <TouchableOpacity onPress={() => console.log('Item clicked', id)}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: 260 }}>
                        <View>
                            <Text style={styles.itemId}>#{id}</Text>
                            <Text style={styles.itemName}>{itemName}</Text>
                        </View>
                        <Text style={styles.itemTime}>{shownTime}</Text>
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