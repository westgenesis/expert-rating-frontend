import { ref } from 'vue'
const useUser = () => {
  // // TODO: 根据token获取用户信息,并且存入localStorage

  const userInfo = ref(null)

  if (localStorage.getItem('userInfo')) {
    // 如果用户信息已存在于 localStorage 中，直接使用
    userInfo.value = JSON.parse(localStorage.getItem('userInfo'))
  } else {
    // 模拟获取用户信息
    const token = localStorage.getItem('token')
    if (token) {
      // 模拟获取用户信息
      userInfo.value = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      }
      // 将用户信息存入 localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    }
  }

  return {
    userInfo,
  }
}

export default useUser
