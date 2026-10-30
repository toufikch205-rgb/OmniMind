import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { InsertToolbar } from "../../src/features/tasks/components/InsertToolbar";
import { TaskBlock } from "../../src/features/tasks/components/TaskBlock";
import { loadPages, savePages } from "../../src/features/tasks/storage";
import { createId, PAGE_ICONS, type BlockType, type FlatPage, type TaskBlockData, type TaskPage } from "../../src/features/tasks/types";

export default function TasksRoute() {
  const [pages, setPages] = useState<TaskPage[]>([]);
  const [selected, setSelected] = useState("");
  const [ready, setReady] = useState(false);
  const [modal, setModal] = useState<"page" | "rename" | null>(null);
  const [draft, setDraft] = useState("");
  const [icon, setIcon] = useState("📄");
  const [parentId, setParentId] = useState<string | null>(null);

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

  const closeModal = () => {
    setModal(null);
    setDraft("");
    setIcon("📄");
    setParentId(null);
  };

  const openNewPage = (parent: string | null = null) => {
    setParentId(parent);
    setDraft("");
    setIcon("📄");
    setModal("page");
  };

  const createPage = () => {
    const title = draft.trim();
    if (!title) return;
    const page: TaskPage = { id: createId(), title, icon, blocks: [], children: [] };
    setPages((old) => parentId
      ? updateTree(old, parentId, (parent) => ({ ...parent, children: [...parent.children, page] }))
      : [...old, page]);
    setSelected(page.id);
    closeModal();
  };

  const renamePage = () => {
    if (!draft.trim() || !current) return;
    setPages((old) => updateTree(old, current.id, (page) => ({ ...page, title: draft.trim() })));
    closeModal();
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
    if (!current) return;
    const block = current.blocks.find((item) => item.id === id);
    if (block) updateBlock(id, { done: !block.done });
  };

  const removePage = () => {
    if (!current || pages.length === 1) return;
    const remove = (list: TaskPage[]): TaskPage[] =>
      list.filter((page) => page.id !== current.id).map((page) => ({ ...page, children: remove(page.children) }));
    const next = remove(pages);
    setPages(next);
    setSelected(next[0]?.id ?? "");
  };

  const taskCount = current?.blocks.filter((block) => block.type === "task").length ?? 0;
  const doneCount = current?.blocks.filter((block) => block.type === "task" && block.done).length ?? 0;

  return (
    <View style={s.root}>
      <View style={s.workspace}>
        <View style={s.sidebar}>
          <View style={s.sideHead}>
            <Text style={s.sideTitle}>مساحة الصفحات</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="إنشاء صفحة" onPress={() => openNewPage()} style={s.addSmall}><Text style={s.addSmallText}>＋</Text></Pressable>
          </View>
          <Pressable onPress={() => openNewPage()} style={s.newPage}><Text style={s.newPageText}>＋ صفحة جديدة</Text></Pressable>
          <ScrollView showsVerticalScrollIndicator={false}>
            {flat.map(({ page, depth }) => (
              <Pressable key={page.id} onPress={() => setSelected(page.id)} style={[s.pageItem, selected === page.id && s.pageSelected, { paddingRight: 10 + depth * 13 }]}>
                <Text style={s.pageEmoji}>{page.icon}</Text>
                <Text numberOfLines={1} style={[s.pageName, selected === page.id && s.pageNameActive]}>{page.title}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Text style={s.sidebarFoot}>تُحفظ الصفحات على هذا الجهاز حالياً</Text>
        </View>

        <View style={s.editor}>
          {current ? (
            <>
              <View style={s.editorTop}>
                <Text style={s.breadcrumb}>مساحة العمل / {current.title}</Text>
                <View style={s.actions}>
                  <Pressable onPress={() => openNewPage(current.id)} style={s.iconAction}><Text>＋</Text></Pressable>
                  <Pressable onPress={() => { setDraft(current.title); setModal("rename"); }} style={s.iconAction}><Text>✎</Text></Pressable>
                </View>
              </View>

              <View style={s.pageHero}>
                <Text style={s.heroEmoji}>{current.icon}</Text>
                <TextInput value={current.title} onChangeText={(title) => setPages((old) => updateTree(old, current.id, (page) => ({ ...page, title })))} style={s.pageTitle} placeholder="عنوان الصفحة" placeholderTextColor="#A0AABA" textAlign="right" />
                {taskCount > 0 ? <Text style={s.pageMeta}>{taskCount} مهام · {doneCount} مكتملة</Text> : null}
              </View>

              <InsertToolbar onInsert={insertBlock} />

              <ScrollView style={s.blocks} contentContainerStyle={s.blocksContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {current.blocks.map((block) => (
                  <TaskBlock key={block.id} block={block} onChange={(patch) => updateBlock(block.id, patch)} onDelete={() => deleteBlock(block.id)} onToggle={() => toggleTask(block.id)} />
                ))}

                {current.children.map((page) => (
                  <Pressable key={page.id} onPress={() => setSelected(page.id)} style={s.childPage}>
                    <Text style={s.pageEmoji}>{page.icon}</Text>
                    <Text style={s.childTitle}>{page.title}</Text>
                    <Text style={s.chevron}>‹</Text>
                  </Pressable>
                ))}

                {!current.blocks.length && !current.children.length ? (
                  <View style={s.empty}>
                    <Text style={s.emptyIcon}>✧</Text>
                    <Text style={s.emptyTitle}>مساحة فارغة وجاهزة</Text>
                    <Text style={s.emptyText}>اكتب مباشرة أو اختر نوع المحتوى الذي تريد إضافته.</Text>
                  </View>
                ) : null}

                <Pressable onPress={() => openNewPage(current.id)} style={s.subPageButton}><Text style={s.subPageText}>＋ إنشاء صفحة فرعية</Text></Pressable>
                {current.id !== "inbox" && pages.length > 1 ? <Pressable onPress={removePage} style={s.deletePage}><Text style={s.deleteText}>حذف هذه الصفحة</Text></Pressable> : null}
              </ScrollView>
            </>
          ) : (
            <View style={s.empty}><Text style={s.emptyTitle}>أنشئ صفحة للبدء</Text><Pressable onPress={() => openNewPage()} style={s.newPage}><Text style={s.newPageText}>＋ صفحة جديدة</Text></Pressable></View>
          )}
        </View>
      </View>

      <Modal visible={!!modal} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={s.overlay}>
          <View style={s.dialog}>
            <Text style={s.dialogTitle}>{modal === "page" ? "إنشاء صفحة جديدة" : "إعادة تسمية الصفحة"}</Text>
            <TextInput value={draft} onChangeText={setDraft} placeholder="عنوان الصفحة" placeholderTextColor="#9AA5B4" style={s.input} autoFocus />
            {modal === "page" ? (
              <View style={s.iconPicker}>
                {PAGE_ICONS.map((item) => <Pressable key={item} onPress={() => setIcon(item)} style={[s.iconChoice, icon === item && s.iconChosen]}><Text style={{ fontSize: 21 }}>{item}</Text></Pressable>)}
              </View>
            ) : null}
            <View style={s.dialogActions}>
              <Pressable onPress={closeModal} style={s.cancel}><Text style={s.cancelText}>إلغاء</Text></Pressable>
              <Pressable onPress={modal === "page" ? createPage : renamePage} style={s.confirm}><Text style={s.confirmText}>إنشاء</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, minHeight: 0, width: "100%", backgroundColor: "#F8FAFC" },
  workspace: { flex: 1, minHeight: 0, width: "100%", flexDirection: "row-reverse", backgroundColor: "#FFF", overflow: "hidden" },
  sidebar: { width: 150, backgroundColor: "#FBFCFE", borderLeftWidth: 1, borderLeftColor: "#E9EDF3", padding: 12 },
  sideHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  sideTitle: { fontSize: 11, fontWeight: "800", color: "#536176" },
  addSmall: { width: 25, height: 25, borderRadius: 8, backgroundColor: "#E8F1FF", alignItems: "center", justifyContent: "center" },
  addSmallText: { fontSize: 19, color: "#397DEB" },
  newPage: { backgroundColor: "#397DEB", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, alignItems: "center", marginBottom: 10 },
  newPageText: { color: "#FFF", fontSize: 10, fontWeight: "800" },
  pageItem: { minHeight: 35, borderRadius: 7, flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 5, marginBottom: 3 },
  pageSelected: { backgroundColor: "#E8F1FF" },
  pageEmoji: { fontSize: 14 },
  pageName: { flex: 1, fontSize: 11, color: "#64748B", textAlign: "right" },
  pageNameActive: { color: "#397DEB", fontWeight: "800" },
  sidebarFoot: { fontSize: 8, color: "#A0AABA", textAlign: "center", marginTop: 8 },
  editor: { flex: 1, minWidth: 0, paddingHorizontal: 24, paddingTop: 18 },
  editorTop: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  breadcrumb: { fontSize: 9, color: "#9AA5B4", flex: 1, textAlign: "right" },
  actions: { flexDirection: "row", gap: 5 },
  iconAction: { width: 28, height: 28, borderWidth: 1, borderColor: "#E9EDF3", borderRadius: 7, alignItems: "center", justifyContent: "center" },
  pageHero: { alignItems: "flex-end", marginTop: 20, marginBottom: 12 },
  heroEmoji: { fontSize: 30 },
  pageTitle: { width: "100%", fontSize: 24, fontWeight: "800", color: "#172033", marginTop: 6, paddingVertical: 3 },
  pageMeta: { fontSize: 10, color: "#9AA5B4", marginTop: 5 },
  blocks: { flex: 1, marginTop: 5 },
  blocksContent: { paddingBottom: 35 },
  childPage: { minHeight: 42, flexDirection: "row-reverse", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: "#F1F3F6" },
  childTitle: { flex: 1, fontSize: 12, color: "#397DEB", fontWeight: "700", textAlign: "right" },
  chevron: { fontSize: 22, color: "#9AA5B4" },
  empty: { alignItems: "center", paddingVertical: 42, gap: 7 },
  emptyIcon: { fontSize: 30, color: "#9658E8" },
  emptyTitle: { fontSize: 14, fontWeight: "800", color: "#344256", marginTop: 8 },
  emptyText: { fontSize: 11, color: "#9AA5B4", marginTop: 3, textAlign: "center" },
  subPageButton: { alignSelf: "flex-end", paddingVertical: 12, paddingHorizontal: 5 },
  subPageText: { color: "#397DEB", fontSize: 11, fontWeight: "700" },
  deletePage: { alignSelf: "flex-end", padding: 10 },
  deleteText: { fontSize: 10, color: "#D65C65" },
  overlay: { flex: 1, backgroundColor: "rgba(15,23,42,.35)", alignItems: "center", justifyContent: "center", padding: 22 },
  dialog: { width: "100%", maxWidth: 390, backgroundColor: "#FFF", borderRadius: 16, padding: 18 },
  dialogTitle: { fontSize: 17, fontWeight: "800", color: "#172033", textAlign: "right", marginBottom: 14 },
  input: { height: 45, borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 9, paddingHorizontal: 12, textAlign: "right", color: "#172033", fontSize: 13 },
  iconPicker: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 7, marginTop: 12 },
  iconChoice: { width: 34, height: 34, borderRadius: 8, backgroundColor: "#F4F7FB", alignItems: "center", justifyContent: "center" },
  iconChosen: { borderWidth: 2, borderColor: "#397DEB", backgroundColor: "#E8F1FF" },
  dialogActions: { flexDirection: "row-reverse", gap: 8, marginTop: 17 },
  cancel: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8, backgroundColor: "#F1F5F9" },
  cancelText: { color: "#64748B", fontSize: 12, fontWeight: "700" },
  confirm: { paddingHorizontal: 22, paddingVertical: 10, borderRadius: 8, backgroundColor: "#397DEB" },
  confirmText: { color: "#FFF", fontSize: 12, fontWeight: "800" },
});
