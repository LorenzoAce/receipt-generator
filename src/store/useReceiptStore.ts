import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createBuilderSection,
  createFreeTextBlock,
  mapLayoutSeparatorStyle,
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
  removeBuilderSection: (sectionId: string) => void;
  moveBuilderSection: (draggedSectionId: string, targetSectionId: string) => void;
  updateFreeTextBlock: (sectionId: string, updates: Partial<ReceiptDraft["freeTextBlocks"][number]>) => void;
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
          draft:
            section !== "free-text" && state.draft.builderSections.some((entry) => entry.type === section)
              ? state.draft
              : (() => {
                  const builderSection = createBuilderSection(section);
                  const nextDraft: ReceiptDraft = {
                    ...state.draft,
                    builderSections: [...state.draft.builderSections, builderSection],
                    sectionSeparators: {
                      ...state.draft.sectionSeparators,
                      [builderSection.id]: mapLayoutSeparatorStyle(state.draft.layout.separatorStyle),
                    },
                    sectionSpacing: {
                      ...state.draft.sectionSpacing,
                      [builderSection.id]: state.draft.layout.sectionSpacing,
                    },
                    sectionSpacingTop: {
                      ...state.draft.sectionSpacingTop,
                      [builderSection.id]: 0,
                    },
                    sectionSpacingBottom: {
                      ...state.draft.sectionSpacingBottom,
                      [builderSection.id]: state.draft.layout.sectionSpacing,
                    },
                    sectionSeparatorHeight: {
                      ...state.draft.sectionSeparatorHeight,
                      [builderSection.id]: 0,
                    },
                    sectionSeparatorWidth: {
                      ...state.draft.sectionSeparatorWidth,
                      [builderSection.id]: 100,
                    },
                  };

                  if (section === "free-text") {
                    nextDraft.freeTextBlocks = [...state.draft.freeTextBlocks, createFreeTextBlock(builderSection.id)];
                  }

                  return nextDraft;
                })(),
        })),
      removeBuilderSection: (sectionId) =>
        set((state) => ({
          draft: {
            ...state.draft,
            builderSections: state.draft.builderSections.filter((entry) => entry.id !== sectionId),
            sectionSeparators: Object.fromEntries(
              Object.entries(state.draft.sectionSeparators).filter(([key]) => key !== sectionId),
            ),
            sectionSpacing: Object.fromEntries(
              Object.entries(state.draft.sectionSpacing).filter(([key]) => key !== sectionId),
            ),
            sectionSpacingTop: Object.fromEntries(
              Object.entries(state.draft.sectionSpacingTop).filter(([key]) => key !== sectionId),
            ),
            sectionSpacingBottom: Object.fromEntries(
              Object.entries(state.draft.sectionSpacingBottom).filter(([key]) => key !== sectionId),
            ),
            sectionSeparatorHeight: Object.fromEntries(
              Object.entries(state.draft.sectionSeparatorHeight).filter(([key]) => key !== sectionId),
            ),
            sectionSeparatorWidth: Object.fromEntries(
              Object.entries(state.draft.sectionSeparatorWidth).filter(([key]) => key !== sectionId),
            ),
            freeTextBlocks: state.draft.freeTextBlocks.filter((block) => block.id !== sectionId),
          },
        })),
      moveBuilderSection: (draggedSectionId, targetSectionId) =>
        set((state) => ({
          draft: {
            ...state.draft,
            builderSections: reorderBuilderSections(state.draft.builderSections, draggedSectionId, targetSectionId),
          },
        })),
      updateFreeTextBlock: (sectionId, updates) =>
        set((state) => ({
          draft: {
            ...state.draft,
            freeTextBlocks: state.draft.freeTextBlocks.map((block) =>
              block.id === sectionId
                ? {
                    ...block,
                    ...updates,
                  }
                : block,
            ),
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
