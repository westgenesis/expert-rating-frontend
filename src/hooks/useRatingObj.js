import { useRoute } from 'vue-router'

const useRatingObj = () => {
  const route = useRoute()
  const query = route.query || {}

  return {
    name: query.name || '',
  }
}

export default useRatingObj
