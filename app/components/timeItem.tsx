import { Link } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Pressable } from "react-native";

interface TimeItemProps {
    text: string;
}

const TimeItem: React.FC<TimeItemProps> = (props) => {
    return (
        <Link href="/stopwatchScreen" asChild>
            <TouchableOpacity onPress={() => console.log('Item clicked')}>
                <View style={styles.item}>
                    <Text style={styles.itemTime}>{props.text}</Text>
                    <Text style={styles.itemName}>untilted</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
}

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
    },
    itemName: {
        fontSize: 20,
        fontWeight: "semibold",
        fontFamily: "monospace, sans-serif",
    },
    itemTime: {
        fontSize: 20,
        fontWeight: "normal",
        fontFamily: "monospace, sans-serif",
    },
});

export default TimeItem;