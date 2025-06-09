import { ref } from 'vue'
const useUser = () => {
  // 用户信息
  const userInfo = ref({
    name: '张三',
    role: '专家',
    email: 'zhangsan@example.com',
  })

  return {
    userInfo,
  }
}

export default useUser
