import { computed, ref, type Ref } from "vue";
import type { CampusEvent, Category } from "../types";

// TODO E1 (refactor): move the filtering logic from week 4's EventList.vue here,
// so any page can reuse it. Return { search, category, visible }.
// The test "filters the list with the search box" in EventsPage.test.ts checks it.
export function useEventFilters(events: Ref<CampusEvent[]>) {
  // TODO 2: two refs for the filters
  const search = ref("");
  const category = ref<Category | "all">("all");

  // TODO 3: a computed `visible` list:
  //   - keep events of the selected category (or all)
  //   - keep events whose title OR location contains the search text, ignoring case
  const visible = computed(() => {
    const searchText = search.value.toLowerCase().trim();

    return events.value.filter((event) => {
      const matchesCategory =
        category.value === "all" || event.category === category.value;

      const matchesSearch =
        event.title.toLowerCase().includes(searchText) ||
        event.location.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  });

  return { search, category, visible };
}