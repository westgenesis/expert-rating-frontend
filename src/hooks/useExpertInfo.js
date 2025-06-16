import { onMounted, ref } from 'vue'
import { getTapExportInfo } from '@/services/apis'

const useExperInfo = () => {
  const exportInfo = ref(null)

  if (localStorage.getItem('expertInfo')) {
    exportInfo.value = JSON.parse(localStorage.getItem('expertInfo'))
  }

  const getExportInfo = async () => {
    if (!localStorage.getItem('token')) {
      return
    }
    const res = await getTapExportInfo()
    exportInfo.value = res.data
    localStorage.setItem('expertInfo', JSON.stringify(res.data))
  }

  onMounted(() => {
    if (!exportInfo.value) {
      getExportInfo()
    }
  })

  return {
    exportInfo, // 推荐返回解构对象，自动暴露 .value
  }
}

export default useExperInfo
