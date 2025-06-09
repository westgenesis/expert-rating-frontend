<template>
  <n-form inline ref="formRef">
    <n-data-table :columns="columns" :data="$attrs.model.data" :bordered="false" />
  </n-form>
</template>

<script setup lang="jsx">
import { ref } from 'vue'
import { Delete } from '@vicons/carbon'
import RatingMatrixValuesConfig from './RatingMatrixValuesConfig.vue'
const emit = defineEmits(['remove'])

const formRef = ref(null)

const columns = ref([
  {
    title: '维度名称',
    key: 'dimensionName',
    width: 200,
    render(row, index) {
      // 这里的校验不生效
      return (
        <n-form-item
          path={`data[${index}].dimensionName`}
          rule={[{ required: true, message: '维度名称不能为空', trigger: 'blur' }]}
        >
          <n-input
            placeholder="请输入维度名称"
            clearable={true}
            value={row.dimensionName}
            onUpdate:value={(val) => (row.dimensionName = val)}
          />
        </n-form-item>
      )
    },
  },
  {
    title: '分值设置',
    key: 'configs',
    render(row, index) {
      return <RatingMatrixValuesConfig model={row.configs} dataIndex={index} />
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    render(row, index) {
      return (
        <n-popconfirm
          onPositiveClick={() => emit('remove', index)}
          v-slots={{
            trigger: () => (
              <n-button quaternary type="error">
                <n-icon>
                  <Delete />
                </n-icon>
              </n-button>
            ),
            default: () => '是否删除该维度？',
          }}
        ></n-popconfirm>
      )
    },
  },
])

defineExpose({
  validate(...args) {
    return formRef.value.validate(...args)
  },
})
</script>
