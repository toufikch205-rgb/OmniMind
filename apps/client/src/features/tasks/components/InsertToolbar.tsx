import { Pressable, StyleSheet, Text, View } from "react-native";
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
    <View style={styles.wrap}>
      {actions.map((item) => (
        <Pressable key={item.type} accessibilityRole="button" onPress={() => onInsert(item.type)} style={styles.button}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 7, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: "#EEF1F5" },
  button: { minHeight: 36, flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 9, borderRadius: 8, backgroundColor: "#F4F7FB" },
  symbol: { color: "#397DEB", fontSize: 15, fontWeight: "800" },
  label: { color: "#536176", fontSize: 10, fontWeight: "700" },
});
