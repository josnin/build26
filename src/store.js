
import { ref } from 'vue'

// grid state
export const refId = ref([])
export const gColNum = ref(3)
export const gRowNum = ref(5)
export const isSelected = ref(false)
export const isStarted = ref(true)
export const isEnded = ref(false)
export const mergedCells = ref([])
export const defaultGridCell = ref([])
export const currentRowStart = ref(null)
export const currentColStart = ref(null)
export const currentClassId = ref(null)
export const widthDelta = ref(null)
export const heightDelta = ref(null)


// site state
export const dragComponent = ref(null);

