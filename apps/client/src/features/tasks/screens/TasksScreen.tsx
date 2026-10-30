import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { InsertToolbar } from "../components/InsertToolbar";
import { TaskBlock } from "../components/TaskBlock";
import { loadPages, savePages } from "../storage";
import { createId, type BlockType, type FlatPage, type TaskBlockData, type TaskPage } from "../types";

export default function TasksRoute() {
  const [pages, setPages] = useState<TaskPage[]>([]);
  const [selected, setSelected] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [ready, setReady] = useState(false);

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
    setPages((old) => updateTree(old, current.id, (page) => ({
      ...page,
      blocks: page.blocks.map((block) => block.id === id ? { ...block, ...patch } : block),
    })));
  };

  const deleteBlock = (id: string) => {
    if (!current) return;
    setPages((old) => updateTree(old, current.id, (page) => ({
      ...page,
      blocks: page.blocks.filter((block) => block.id !== id),
    })));
  };

  const toggleTask = (id: string) => {
    const block = current?.blocks.find((item) => item.id === id);
    if (block) updateBlock(id, { done: !block.done });
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
            <Text style={s.closeLabel}>إغلاق الصفحة</Text>
          </Pressable>
          <Text style={s.topHint}>مساحة تحرير مستقلة</Text>
        </View>

        <View style={s.toolbarArea}>
          <InsertToolbar onInsert={insertBlock} />
        </View>

        <ScrollView style={s.canvasScroll} contentContainerStyle={s.canvasContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={s.canvas}>
            <TextInput
              value={current.title}
              onChangeText={(title) => setPages((old) => updateTree(old, current.id, (page) => ({ ...page, title })))}
              placeholder="عنوان الصفحة"
              placeholderTextColor="#C1C8D2"
              style={s.titleInput}
              textAlign="right"
            />
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

            <Pressable onPress={() => createPage(current.id)} style={s.subPageButton}>
              <Text style={s.subPageText}>＋ إضافة صفحة فرعية</Text>
            </Pressable>
            {current.id !== "inbox" && pages.length > 1 ? <Pressable onPress={removePage} style={s.deletePage}><Text style={s.deleteText}>حذف الصفحة</Text></Pressable> : null}
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
  topBar: { height: 54, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: "#EEF1F5", flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" },
  closeButton: { minHeight: 40, flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 8, borderRadius: 8, backgroundColor: "#F5F7FA" },
  closeGlyph: { color: "#526176", fontSize: 23, lineHeight: 25 },
  closeLabel: { color: "#536176", fontSize: 11, fontWeight: "700" },
  topHint: { color: "#A0AABA", fontSize: 10 },
  toolbarArea: { paddingHorizontal: 14, backgroundColor: "#FFFFFF" },
  canvasScroll: { flex: 1, backgroundColor: "#FFFFFF" },
  canvasContent: { flexGrow: 1, paddingHorizontal: 18, paddingTop: 25, paddingBottom: 70 },
  canvas: { width: "100%", maxWidth: 900, alignSelf: "center", minHeight: 500, backgroundColor: "#FFFFFF" },
  titleInput: { width: "100%", minHeight: 55, color: "#172033", fontSize: 27, fontWeight: "800", paddingVertical: 8, paddingHorizontal: 2 },
  pageMeta: { color: "#A0AABA", fontSize: 10, textAlign: "right", marginBottom: 8 },
  emptyHint: { alignItems: "center", paddingTop: 85, paddingHorizontal: 20, gap: 8 },
  emptyTitle: { color: "#B0B9C6", fontSize: 14, fontWeight: "700" },
  emptyText: { color: "#C0C7D1", fontSize: 11, textAlign: "center", lineHeight: 19 },
  childPage: { minHeight: 44, flexDirection: "row-reverse", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: "#F1F3F6" },
  childEmoji: { fontSize: 16 },
  childTitle: { flex: 1, color: "#397DEB", textAlign: "right", fontSize: 12, fontWeight: "700" },
  childArrow: { color: "#9AA5B4", fontSize: 22 },
  subPageButton: { alignSelf: "flex-end", paddingVertical: 14, paddingHorizontal: 5 },
  subPageText: { color: "#397DEB", fontSize: 11, fontWeight: "700" },
  deletePage: { alignSelf: "flex-end", padding: 10 },
  deleteText: { color: "#D65C65", fontSize: 10 },
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
