import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { BlockType } from "../types";

const actions: { type: BlockType; label: string; symbol: string }[] = [
  { type: "paragraph", label: "نص", symbol: "¶" },
  { type: "heading", label: "عنوان", symbol: "T" },
  { type: "task", label: "قائمة مهام", symbol: "☑" },
  { type: "bullet", label: "قائمة", symbol: "•" },
  { type: "table", label: "جدول", symbol: "▦" },
  { type: "image", label: "صورة", symbol: "▧" },
];

export function InsertToolbar({ onInsert }: { onInsert: (type: BlockType) => void }) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wrap}>
        {actions.map((item) => (
          <Pressable key={item.type} accessibilityRole="button" accessibilityLabel={`إضافة ${item.label}`} onPress={() => onInsert(item.type)} style={styles.button}>
            <Text style={styles.symbol}>{item.symbol}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#F1F3F6" },
  wrap: { flexDirection: "row-reverse", alignItems: "center", gap: 8, paddingVertical: 9, paddingHorizontal: 2 },
  button: { minHeight: 38, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 11, borderRadius: 9, backgroundColor: "#F7F9FC", borderWidth: 1, borderColor: "#E9EEF4" },
  symbol: { color: "#334155", fontSize: 16, fontWeight: "800" },
  label: { color: "#475569", fontSize: 11, fontWeight: "700" },
});
