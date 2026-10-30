import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { TaskBlockData } from "../types";

type Props = {
  block: TaskBlockData;
  onChange: (patch: Partial<TaskBlockData>) => void;
  onDelete: () => void;
  onToggle: () => void;
};

export function TaskBlock({ block, onChange, onDelete, onToggle }: Props) {
  const inputStyle = [styles.input, block.type === "heading" ? styles.heading : null];
  return (
    <View style={styles.block}>
      {block.type === "task" ? (
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: Boolean(block.done) }} onPress={onToggle} style={[styles.checkbox, block.done && styles.checked]}>
          {block.done ? <Text style={styles.tick}>✓</Text> : null}
        </Pressable>
      ) : null}

      {block.type === "bullet" ? <Text style={styles.bullet}>•</Text> : null}

      {block.type === "image" ? (
        <View style={styles.imageWrap}>
          {block.url ? <Image source={{ uri: block.url }} resizeMode="contain" style={styles.image} /> : <Text style={styles.imagePlaceholder}>أضف رابط الصورة من زر التعديل</Text>}
          <TextInput value={block.url ?? ""} onChangeText={(url) => onChange({ url })} placeholder="رابط الصورة (https://...)" placeholderTextColor="#9AA5B4" style={styles.urlInput} autoCapitalize="none" />
        </View>
      ) : block.type === "table" ? (
        <View style={styles.tableWrap}>
          {(block.rows ?? [["", ""], ["", ""]]).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {row.map((cell, cellIndex) => (
                <TextInput key={cellIndex} value={cell} onChangeText={(text) => {
                  const rows = (block.rows ?? [["", ""], ["", ""]]).map((row, currentRow) =>
                    currentRow === rowIndex
                      ? row.map((cell, currentCell) => currentCell === cellIndex ? text : cell)
                      : [...row],
                  );
                  onChange({ rows });
                }} placeholder="..." placeholderTextColor="#A0AABA" style={styles.cell} />
              ))}
            </View>
          ))}
          <View style={styles.tableActions}>
            <Pressable onPress={() => onChange({ rows: [...(block.rows ?? [["", ""], ["", ""]]), Array((block.rows?.[0]?.length ?? 2)).fill("")] })}><Text style={styles.tableActionText}>＋ صف</Text></Pressable>
            <Pressable onPress={() => onChange({ rows: (block.rows ?? [["", ""], ["", ""]]).map((row) => [...row, ""]) })}><Text style={styles.tableActionText}>＋ عمود</Text></Pressable>
          </View>
        </View>
      ) : (
        <TextInput
          value={block.text ?? ""}
          onChangeText={(text) => onChange({ text })}
          placeholder={block.type === "heading" ? "عنوان جديد" : block.type === "task" ? "اكتب المهمة..." : block.type === "bullet" ? "عنصر في القائمة..." : "اكتب هنا..."}
          placeholderTextColor="#A0AABA"
          style={[...inputStyle, block.done && block.type === "task" ? styles.completed : null]}
          multiline
          textAlign="right"
        />
      )}

      <Pressable accessibilityRole="button" accessibilityLabel="حذف العنصر" onPress={onDelete} style={styles.delete}><Text style={styles.deleteText}>×</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { minHeight: 42, flexDirection: "row-reverse", alignItems: "flex-start", gap: 8, paddingVertical: 5, backgroundColor: "#FFFFFF" },
  input: { flex: 1, minWidth: 0, color: "#263244", fontSize: 14, lineHeight: 24, paddingVertical: 5, paddingHorizontal: 2, textAlignVertical: "center", backgroundColor: "#FFFFFF", borderWidth: 0 },
  heading: { fontSize: 21, lineHeight: 30, fontWeight: "800", color: "#172033", paddingTop: 10, paddingBottom: 8 },
  completed: { color: "#9AA5B4", textDecorationLine: "line-through" },
  checkbox: { width: 19, height: 19, marginTop: 8, borderWidth: 1.5, borderColor: "#B8C3D1", borderRadius: 5, alignItems: "center", justifyContent: "center" },
  checked: { backgroundColor: "#35BE62", borderColor: "#35BE62" },
  tick: { fontSize: 12, color: "#FFF", fontWeight: "900" },
  bullet: { color: "#64748B", fontSize: 22, lineHeight: 29, width: 18, textAlign: "center" },
  delete: { width: 25, height: 29, alignItems: "center", justifyContent: "center" },
  deleteText: { color: "#A0AABA", fontSize: 20 },
  imageWrap: { flex: 1, gap: 7, alignItems: "stretch" },
  image: { width: "100%", height: 190, backgroundColor: "#F8FAFC", borderRadius: 8 },
  imagePlaceholder: { color: "#9AA5B4", textAlign: "center", padding: 25, backgroundColor: "#F8FAFC", borderRadius: 8, fontSize: 11 },
  urlInput: { borderWidth: 1, borderColor: "#E5EAF1", borderRadius: 7, paddingHorizontal: 9, paddingVertical: 7, textAlign: "right", color: "#344256", fontSize: 11 },
  tableWrap: { flex: 1, gap: 1, borderWidth: 1, borderColor: "#E5EAF1", borderRadius: 7, overflow: "hidden" },
  tableRow: { flexDirection: "row-reverse" },
  cell: { flex: 1, minWidth: 55, minHeight: 38, paddingHorizontal: 7, borderLeftWidth: 1, borderBottomWidth: 1, borderColor: "#E5EAF1", color: "#344256", fontSize: 11, textAlign: "right" },
  tableActions: { flexDirection: "row-reverse", gap: 14, padding: 8 },
  tableActionText: { color: "#397DEB", fontSize: 10, fontWeight: "700" },
});
