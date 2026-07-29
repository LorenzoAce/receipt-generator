import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createDefaultSectionSeparators,
  type BuilderSectionType,
  createDefaultDraft,
  createEmptyItem,
  normalizeDraft,
  reorderBuilderSections,
  receiptTemplates,
  type PaperWidth,
  type ReceiptDraft,
  type ReceiptItem,
  type ReceiptLayout,
  type ReceiptSectionKey,
} from "../utils/receipt";

type ReceiptStore = {
  draft: ReceiptDraft;
  replaceDraft: (draft: Partial<ReceiptDraft>) => void;
  setPaperWidth: (paperWidth: PaperWidth) => void;
  updateDraft: <K extends keyof ReceiptDraft>(field: K, value: ReceiptDraft[K]) => void;
  updateLayout: <K extends keyof ReceiptLayout>(field: K, value: ReceiptLayout[K]) => void;
  addBuilderSection: (section: BuilderSectionType) => void;
  removeBuilderSection: (section: BuilderSectionType) => void;
  moveBuilderSection: (draggedSection: BuilderSectionType, targetSection: BuilderSectionType) => void;
  toggleSection: (section: ReceiptSectionKey) => void;
  addItem: () => void;
  updateItem: <K extends keyof ReceiptItem>(id: string, field: K, value: ReceiptItem[K]) => void;
  removeItem: (id: string) => void;
  applyTemplate: (templateId: string) => void;
  resetDraft: () => void;
};

const mergeTemplate = (current: ReceiptDraft, templateId: string) => {
  const template = receiptTemplates.find((entry) => entry.id === templateId);

  if (!template) {
    return current;
  }

  return normalizeDraft({
    ...current,
    ...template.draft,
    templateId,
    layout: {
      ...current.layout,
      ...template.draft.layout,
    },
    sections: {
      ...current.sections,
      ...template.draft.sections,
    },
    sectionSeparators:
      template.draft.sectionSeparators ??
      createDefaultSectionSeparators(template.draft.layout?.separatorStyle ?? current.layout.separatorStyle),
  });
};

export const useReceiptStore = create<ReceiptStore>()(
  persist(
    (set) => ({
      draft: createDefaultDraft(),
      replaceDraft: (draft) =>
        set(() => ({
          draft: normalizeDraft(draft),
        })),
      setPaperWidth: (paperWidth) =>
        set((state) => ({
          draft: {
            ...state.draft,
            paperWidth,
          },
        })),
      updateDraft: (field, value) =>
        set((state) => ({
          draft: {
            ...state.draft,
            [field]: value,
          },
        })),
      updateLayout: (field, value) =>
        set((state) => ({
          draft: {
            ...state.draft,
            layout: {
              ...state.draft.layout,
              [field]: value,
            },
          },
        })),
      addBuilderSection: (section) =>
        set((state) => ({
          draft: {
            ...state.draft,
            builderSections: state.draft.builderSections.includes(section)
              ? state.draft.builderSections
              : [...state.draft.builderSections, section],
          },
        })),
      removeBuilderSection: (section) =>
        set((state) => ({
          draft: {
            ...state.draft,
            builderSections: state.draft.builderSections.filter((entry) => entry !== section),
          },
        })),
      moveBuilderSection: (draggedSection, targetSection) =>
        set((state) => ({
          draft: {
            ...state.draft,
            builderSections: reorderBuilderSections(state.draft.builderSections, draggedSection, targetSection),
          },
        })),
      toggleSection: (section) =>
        set((state) => ({
          draft: {
            ...state.draft,
            sections: {
              ...state.draft.sections,
              [section]: !state.draft.sections[section],
            },
          },
        })),
      addItem: () =>
        set((state) => ({
          draft: {
            ...state.draft,
            items: [...state.draft.items, createEmptyItem()],
          },
        })),
      updateItem: (id, field, value) =>
        set((state) => ({
          draft: {
            ...state.draft,
            items: state.draft.items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    [field]: value,
                  }
                : item,
            ),
          },
        })),
      removeItem: (id) =>
        set((state) => ({
          draft: {
            ...state.draft,
            items: state.draft.items.filter((item) => item.id !== id),
          },
        })),
      applyTemplate: (templateId) =>
        set((state) => ({
          draft: mergeTemplate(state.draft, templateId),
        })),
      resetDraft: () =>
        set(() => ({
          draft: createDefaultDraft(),
        })),
    }),
    {
      name: "receipt-generator-draft",
      partialize: (state) => ({ draft: state.draft }),
      merge: (persistedState, currentState) => {
        const typedState = persistedState as { draft?: Partial<ReceiptDraft> } | undefined;

        return {
          ...currentState,
          ...typedState,
          draft: normalizeDraft(typedState?.draft),
        };
      },
    },
  ),
);
