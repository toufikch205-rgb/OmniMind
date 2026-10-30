import { ReactNode } from "react";
import { ScrollView, StyleSheet, useWindowDimensions } from "react-native";

export function PageFrame({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  return <ScrollView style={s.scroll} contentContainerStyle={[s.content, { paddingHorizontal: width >= 900 ? 34 : 18 }]} showsVerticalScrollIndicator={false}>{children}</ScrollView>;
}

const s = StyleSheet.create({
  scroll: { flex: 1 },
  content: { width: "100%", maxWidth: 920, alignSelf: "center", paddingTop: 12, paddingBottom: 12 },
});
