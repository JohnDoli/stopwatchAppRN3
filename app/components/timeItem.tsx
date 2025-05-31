import { Link } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";



interface TimeItemProps {
    id: number;
    shownTime: string;
    itemName: string;
}

function TimeItem({ id, shownTime, itemName }: TimeItemProps) {
    return (
        <Link href="/stopwatchScreen" asChild>
            <TouchableOpacity onPress={() => console.log('Item clicked', id)}>
                <View style={styles.item}>
                    <View>
                        <Text style={styles.itemId}>#{id}</Text>
                        <Text style={styles.itemName}>{itemName}</Text>
                    </View>
                    <Text style={styles.itemTime}>{shownTime}</Text>
                </View>
            </TouchableOpacity>
        </Link>
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
    },
    itemId: {
        fontSize: 14,
        color: '#888',
        fontFamily: "monospace, sans-serif",
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