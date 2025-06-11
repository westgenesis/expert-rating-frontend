import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const useRatingObj = () => {
  const route = useRoute()
  const query = route.query || {}

  const ratingObjId = query.ratingObjId || ''

  const objInfo = ref(null)

  if (localStorage.getItem('objInfo')) {
    // 如果对象信息已存在于 localStorage 中，直接使用
    objInfo.value = JSON.parse(localStorage.getItem('objInfo'))
    if (!ratingObjId || objInfo.value.id === ratingObjId) {
      return objInfo
    } else {
      // 如果路由中的 ratingObjId 与 localStorage 中的对象信息不匹配，清除 localStorage 中的对象信息
      localStorage.removeItem('objInfo')
      onMounted(() => {
        // 在组件挂载时重新获取对象信息
        fetchObjInfo(ratingObjId)
      })
    }
  } else {
    onMounted(() => {
      // 在组件挂载时重新获取对象信息
      fetchObjInfo(ratingObjId)
    })
  }

  const fetchObjInfo = async (id) => {
    try {
      // 模拟 API 调用获取对象信息
      // 实际应用中应替换为真实的 API 调用
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              id: id,
              name: `ECU_TEST_黑芝麻_Test_99121`,
              description: `Description for object ${id}`,
            },
          })
        }, 1000)
      })

      objInfo.value = response.data
      localStorage.setItem('objInfo', JSON.stringify(objInfo.value))
    } catch (error) {
      console.error('获取对象信息失败:', error)
    }
  }

  return objInfo
}

export default useRatingObj
