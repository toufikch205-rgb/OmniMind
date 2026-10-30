import { AppIcon } from "../AppIcon";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const workspaceNavigation = [
  { path: "/(workspace)", label: "الرئيسية", short: "الرئيسية", icon: "home" },
  { path: "/(workspace)/tasks", label: "المهام", short: "المهام", icon: "tasks" },
  { path: "/(workspace)/planning", label: "التخطيط", short: "التخطيط", icon: "calendar" },
  { path: "/(workspace)/knowledge", label: "المعرفة", short: "المعرفة", icon: "book" },
  { path: "/(workspace)/projects", label: "المشاريع", short: "المشاريع", icon: "projects" },
] as const;

const C = { blue: "#397DEB", muted: "#8793A3" };

export function NavItem({ item, active, compact, onPress }: {
  item: (typeof workspaceNavigation)[number];
  active: boolean;
  compact?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[compact ? s.mobileItem : s.navItem, active && (compact ? s.mobileActive : s.navActive)]}>
      <View style={compact ? s.mobileIcon : s.navIcon}><AppIcon name={item.icon} color={active ? C.blue : C.muted} size={compact ? 23 : 21} /></View>
      <Text numberOfLines={1} style={[compact ? s.mobileLabel : s.navLabel, active && s.activeText]}>{item.label}</Text>
      {!compact && active ? <View style={s.rail} /> : null}
    </Pressable>
  );
}

const s = StyleSheet.create({
  navItem: { minHeight: 47, borderRadius: 11, paddingHorizontal: 12, marginBottom: 5, flexDirection: "row-reverse", alignItems: "center", gap: 12, position: "relative" },
  navActive: { backgroundColor: "#E8F1FF" },
  navIcon: { width: 24, height: 27, alignItems: "center", justifyContent: "center" },
  navLabel: { color: "#64748B", fontSize: 12, fontWeight: "600", textAlign: "right" },
  activeText: { color: C.blue },
  rail: { position: "absolute", right: 0, top: 10, bottom: 10, width: 3, borderRadius: 4, backgroundColor: C.blue },
  mobileItem: { minWidth: 58, flex: 1, height: 66, flexDirection: "column", gap: 5, justifyContent: "center", alignItems: "center" },
  mobileActive: { backgroundColor: "transparent" },
  mobileIcon: { height: 28, alignItems: "center", justifyContent: "center" },
  mobileLabel: { color: "#7D899A", fontSize: 10, fontWeight: "700", letterSpacing: 0.1 },
});
