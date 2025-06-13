import { useRoute } from 'vue-router'

const useRatingObj = () => {
  const route = useRoute()
  const query = route.query || {}

  return {
    name: query.name || 'ECU_TEST_黑芝麻_Test_99121',
  }
}

export default useRatingObj
