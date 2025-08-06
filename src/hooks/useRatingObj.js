import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getTapGetTestObjList } from '@/services/apis'

const useRatingObj = () => {
  const route = useRoute()
  const query = route.query || {}

  const dataId = query.data_id || ''

  const testObjList = ref([])
  const getTestObjList = async () => {
    const res = await getTapGetTestObjList()

    testObjList.value = res.data || []
  }

  onMounted(() => {
    if (testObjList.value.length) {
      return
    }
    getTestObjList()
  })

  const name = computed(() => {
    const obj = testObjList.value.find((item) => item.data_id === dataId)
    return obj?.['测试对象'] || ''
  })

  return {
    testObjList,
    dataId,
    name,
  }
}

export default useRatingObj
