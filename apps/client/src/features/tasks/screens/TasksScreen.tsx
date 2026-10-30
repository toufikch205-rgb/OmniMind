import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { InsertToolbar } from "../components/InsertToolbar";
import { TaskBlock } from "../components/TaskBlock";
import { loadPages, savePages } from "../storage";
import { createId, type BlockType, type FlatPage, type TaskBlockData, type TaskPage } from "../types";

export default function TasksScreen() {
  const [pages, setPages] = useState<TaskPage[]>([]);
  const [selected, setSelected] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [saveLabel, setSaveLabel] = useState("حفظ");

  useEffect(() => {
    const initial = loadPages();
    setPages(initial);
    setSelected(initial[0]?.id ?? "");
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) savePages(pages);
  }, [pages, ready]);

  const flat = useMemo<FlatPage[]>(() => {
    const result: FlatPage[] = [];
    const walk = (list: TaskPage[], depth: number, parent: string | null) => {
      list.forEach((page) => {
        result.push({ page, depth, parent });
        walk(page.children, depth + 1, page.id);
      });
    };
    walk(pages, 0, null);
    return result;
  }, [pages]);

  const current = flat.find((entry) => entry.page.id === selected)?.page ?? pages[0];

  const updateTree = (list: TaskPage[], id: string, update: (page: TaskPage) => TaskPage): TaskPage[] =>
    list.map((page) => page.id === id
      ? update(page)
      : { ...page, children: updateTree(page.children, id, update) });

  const createPage = (parentId: string | null = null) => {
    setSaveLabel("حفظ");
    const page: TaskPage = { id: createId(), title: "", icon: "📄", blocks: [], children: [] };
    setPages((old) => parentId
      ? updateTree(old, parentId, (parent) => ({ ...parent, children: [...parent.children, page] }))
      : [...old, page]);
    setSelected(page.id);
    setEditorOpen(true);
  };

  const openPage = (id: string) => {
    setSelected(id);
    setEditorOpen(true);
  };

  const insertBlock = (type: BlockType) => {
    if (!current) return;
    const block: TaskBlockData = type === "table"
      ? { id: createId(), type, rows: [["", ""], ["", ""]] }
      : type === "image"
        ? { id: createId(), type, url: "" }
        : { id: createId(), type, text: "", done: false };
    setPages((old) => updateTree(old, current.id, (page) => ({ ...page, blocks: [...page.blocks, block] })));
  };

  const updateBlock = (id: string, patch: Partial<TaskBlockData>) => {
    if (!current) return;
    setSaveLabel("حفظ");
    setPages((old) => updateTree(old, current.id, (page) => ({
      ...page,
      blocks: page.blocks.map((block) => block.id === id ? { ...block, ...patch } : block),
    })));
  };

  const deleteBlock = (id: string) => {
    if (!current) return;
    setSaveLabel("حفظ");
    setPages((old) => updateTree(old, current.id, (page) => ({
      ...page,
      blocks: page.blocks.filter((block) => block.id !== id),
    })));
  };

  const toggleTask = (id: string) => {
    const block = current?.blocks.find((item) => item.id === id);
    if (block) updateBlock(id, { done: !block.done });
  };

  const saveCurrentPage = () => {
    savePages(pages);
    setSaveLabel("تم الحفظ ✓");
  };

  const removePage = () => {
    if (!current || pages.length === 1) return;
    const remove = (list: TaskPage[]): TaskPage[] =>
      list.filter((page) => page.id !== current.id).map((page) => ({ ...page, children: remove(page.children) }));
    const next = remove(pages);
    setPages(next);
    setSelected(next[0]?.id ?? "");
    setEditorOpen(false);
  };

  if (editorOpen && current) {
    const taskCount = current.blocks.filter((block) => block.type === "task").length;
    const doneCount = current.blocks.filter((block) => block.type === "task" && block.done).length;

    return (
      <View style={s.fullEditor}>
        <View style={s.topBar}>
          <Pressable accessibilityRole="button" accessibilityLabel="إغلاق الصفحة والعودة" onPress={() => setEditorOpen(false)} style={s.closeButton}>
            <Text style={s.closeGlyph}>×</Text>
          </Pressable>
          <TextInput
            value={current.title}
            onChangeText={(title) => {
              setSaveLabel("حفظ");
              setPages((old) => updateTree(old, current.id, (page) => ({ ...page, title })));
            }}
            placeholder="عنوان الصفحة"
            placeholderTextColor="#AAB3C0"
            style={s.headerTitle}
            textAlign="right"
            returnKeyType="done"
          />
          <View style={s.topActions}>
            {current.id !== "inbox" && pages.length > 1 ? (
              <Pressable accessibilityRole="button" accessibilityLabel="حذف الصفحة" onPress={removePage} style={s.deleteTopButton}>
                <Text style={s.deleteTopText}>حذف</Text>
              </Pressable>
            ) : null}
            <Pressable accessibilityRole="button" accessibilityLabel="حفظ الصفحة" onPress={saveCurrentPage} style={s.saveButton}>
              <Text style={s.saveButtonText}>{saveLabel}</Text>
            </Pressable>
          </View>
        </View>

        <View style={s.toolbarArea}>
          <InsertToolbar onInsert={(type) => { setSaveLabel("حفظ"); insertBlock(type); }} />
        </View>

        <ScrollView style={s.canvasScroll} contentContainerStyle={s.canvasContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={s.canvas}>

            {taskCount > 0 ? <Text style={s.pageMeta}>{taskCount} مهام · {doneCount} مكتملة</Text> : null}

            {current.blocks.map((block) => (
              <TaskBlock key={block.id} block={block} onChange={(patch) => updateBlock(block.id, patch)} onDelete={() => deleteBlock(block.id)} onToggle={() => toggleTask(block.id)} />
            ))}

            {current.children.map((page) => (
              <Pressable key={page.id} onPress={() => openPage(page.id)} style={s.childPage}>
                <Text style={s.childEmoji}>{page.icon}</Text>
                <Text style={s.childTitle}>{page.title || "صفحة بدون عنوان"}</Text>
                <Text style={s.childArrow}>‹</Text>
              </Pressable>
            ))}

            {!current.blocks.length && !current.children.length ? (
              <View style={s.emptyHint}>
                <Text style={s.emptyTitle}>مساحة عمل بيضاء</Text>
                <Text style={s.emptyText}>ابدأ بكتابة عنوانك، أو أضف نصاً أو جدولاً أو قائمة مهام من الأعلى.</Text>
              </View>
            ) : null}


          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={s.listScreen}>
      <View style={s.listHeader}>
        <Text style={s.listTitle}>صفحاتي</Text>
        <Pressable accessibilityRole="button" onPress={() => createPage()} style={s.createButton}>
          <Text style={s.createButtonText}>＋ صفحة جديدة</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={s.listContent}>
        {flat.map(({ page, depth }) => (
          <Pressable key={page.id} onPress={() => openPage(page.id)} style={[s.listItem, { marginRight: depth * 17 }]}>
            <Text style={s.listIcon}>{page.icon}</Text>
            <View style={s.listTextWrap}>
              <Text style={s.listItemTitle}>{page.title || "صفحة بدون عنوان"}</Text>
              <Text style={s.listItemMeta}>{page.blocks.length} عناصر</Text>
            </View>
            <Text style={s.listArrow}>‹</Text>
          </Pressable>
        ))}
        {!flat.length ? <Text style={s.noPages}>لا توجد صفحات بعد. أنشئ صفحة جديدة للبدء.</Text> : null}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  fullEditor: { flex: 1, minHeight: 0, width: "100%", backgroundColor: "#FFFFFF" },
  topBar: { minHeight: 58, paddingHorizontal: 12, flexDirection: "row-reverse", alignItems: "center", gap: 9, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#F1F3F6" },
  closeButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: "#F5F7FA" },
  closeGlyph: { color: "#526176", fontSize: 25, lineHeight: 28 },
  headerTitle: { flex: 1, minWidth: 60, height: 42, color: "#172033", fontSize: 18, fontWeight: "800", paddingHorizontal: 3, paddingVertical: 5 },
  topActions: { flexDirection: "row-reverse", alignItems: "center", gap: 7 },
  saveButton: { minHeight: 36, minWidth: 58, paddingHorizontal: 12, alignItems: "center", justifyContent: "center", borderRadius: 9, backgroundColor: "#22C55E" },
  saveButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  deleteTopButton: { minHeight: 36, paddingHorizontal: 10, alignItems: "center", justifyContent: "center", borderRadius: 9, backgroundColor: "#FFF1F2" },
  deleteTopText: { color: "#D64555", fontSize: 11, fontWeight: "700" },
  toolbarArea: { paddingHorizontal: 10, backgroundColor: "#FFFFFF" },
  canvasScroll: { flex: 1, backgroundColor: "#FFFFFF" },
  canvasContent: { flexGrow: 1, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 70 },
  canvas: { width: "100%", maxWidth: 900, alignSelf: "center", minHeight: 500, backgroundColor: "#FFFFFF" },
  pageMeta: { color: "#A0AABA", fontSize: 10, textAlign: "right", marginBottom: 8 },
  emptyHint: { alignItems: "center", paddingTop: 70, paddingHorizontal: 20, gap: 8 },
  emptyTitle: { color: "#B0B9C6", fontSize: 14, fontWeight: "700" },
  emptyText: { color: "#C0C7D1", fontSize: 11, textAlign: "center", lineHeight: 19 },
  childPage: { minHeight: 44, flexDirection: "row-reverse", alignItems: "center", gap: 9 },
  childEmoji: { fontSize: 16 },
  childTitle: { flex: 1, color: "#397DEB", textAlign: "right", fontSize: 12, fontWeight: "700" },
  childArrow: { color: "#9AA5B4", fontSize: 22 },
  listScreen: { flex: 1, minHeight: 0, width: "100%", backgroundColor: "#FFFFFF", paddingHorizontal: 18, paddingTop: 22 },
  listHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  listTitle: { color: "#172033", fontSize: 21, fontWeight: "800" },
  createButton: { minHeight: 40, justifyContent: "center", paddingHorizontal: 14, borderRadius: 9, backgroundColor: "#397DEB" },
  createButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  listContent: { paddingBottom: 35 },
  listItem: { minHeight: 62, flexDirection: "row-reverse", alignItems: "center", gap: 11, paddingHorizontal: 12, marginBottom: 8, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#EDF0F4", borderRadius: 10 },
  listIcon: { fontSize: 21 },
  listTextWrap: { flex: 1, alignItems: "flex-end", gap: 3 },
  listItemTitle: { color: "#344256", fontSize: 12, fontWeight: "700" },
  listItemMeta: { color: "#A0AABA", fontSize: 9 },
  listArrow: { color: "#9AA5B4", fontSize: 23 },
  noPages: { color: "#9AA5B4", fontSize: 12, textAlign: "center", paddingTop: 40 },
});
