<template>
  <n-card title="专家列表">
    <template #header-extra>
      <n-space>
        <n-button secondary type="primary" @click="handleAddExpert">
          <template #icon>
            <NIcon>
              <Add />
            </NIcon>
          </template>
          添加专家
        </n-button>

        <n-button type="primary" @click="handleSubmit" :loading="submitting"> 提交更新 </n-button>
      </n-space>
    </template>

    <div>
      <n-skeleton v-if="loading" text :repeat="6" />
      <n-form :model="formData" inline ref="formRef">
        <n-data-table
          ref="tableRef"
          :max-height="400"
          size="small"
          :bordered="false"
          :columns="columns"
          :data="formData.data"
        />
      </n-form>
    </div>
  </n-card>
</template>

<script setup lang="jsx">
import { ref, onMounted, nextTick } from 'vue'
import { Add, Delete } from '@vicons/carbon'
import { useMessage } from 'naive-ui'
import { getTapExpertsEmail, updateExpertsEmail } from '@/services/apis.js'

const message = useMessage()
const formRef = ref(null)
const tableRef = ref(null)

const columns = [
  {
    title: '专家名称',
    key: 'name',
    render(row, index) {
      return (
        <n-form-item
          path={`data[${index}].name`}
          rule={[{ required: true, message: '专家名称不能为空', trigger: 'blur' }]}
        >
          <n-input
            placeholder="请输入专家名称"
            clearable
            value={row['name']}
            onUpdateValue={(val) => (row['name'] = val)}
          />
        </n-form-item>
      )
    },
  },
  {
    title: '专家邮箱',
    key: 'email',
    render(row, index) {
      return (
        <n-form-item
          path={`data[${index}].email`}
          rule={[{ required: true, message: '邮箱不能为空', trigger: 'blur' }]}
        >
          <n-input
            placeholder="请输入专家邮箱"
            clearable
            value={row['email']}
            onUpdateValue={(val) => (row['email'] = val)}
          />
        </n-form-item>
      )
    },
  },

  {
    title: '操作',
    key: 'action',
    width: 80,
    render(row, index) {
      return (
        <n-popconfirm
          onPositiveClick={() => handleRemove(index)}
          v-slots={{
            trigger: () => (
              <n-button quaternary type="error">
                <n-icon>
                  <Delete />
                </n-icon>
              </n-button>
            ),
            default: () => '是否删除该专家？',
          }}
        ></n-popconfirm>
      )
    },
  },
]

const formData = ref({
  data: [],
})
const loading = ref(false)
const submitting = ref(false)

const getData = async () => {
  try {
    loading.value = true
    const response = await getTapExpertsEmail()
    formData.value.data = response?.data || []
    // 处理获取到的数据
  } catch (error) {
    console.error('获取专家列表失败:', error)
  } finally {
    loading.value = false
  }
}

const submitData = () => {
  submitting.value = true
  updateExpertsEmail(formData.value.data)
    .then((data) => {
      if (data?.data?.status === '成功') {
        message.success('更新专家列表成功')
      }
    })
    .catch((error) => {
      message.error('更新专家列表失败:', error)
    })
    .finally(() => {
      submitting.value = false
    })
}

const handleAddExpert = () => {
  formData.value.data.push({
    email: '',
    name: '',
  })

  nextTick(() => {
    // 滚动到底部
    tableRef.value.scrollTo({
      top: tableRef.value.$el.querySelector('tbody').scrollHeight,
      behavior: 'smooth',
    })
  })
}

const handleRemove = (index) => {
  formData.value.data.splice(index, 1)
}

const handleSubmit = () => {
  formRef.value.validate().then(() => submitData())
}

onMounted(() => {
  getData()
})
</script>
