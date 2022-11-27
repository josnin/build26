
import { ref } from 'vue'

// grid state
export const refId = ref([])
export const gColNum = ref(3)
export const gRowNum = ref(5)
export const isSelected = ref(false)
export const isStarted = ref(true)
export const isEnded = ref(false)
export const mergedCells = ref([])
export const defaultGridCell = ref([]);


// site state
export const dragComponent = ref(null);