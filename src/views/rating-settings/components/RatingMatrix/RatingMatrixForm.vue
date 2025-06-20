<template>
  <n-form inline ref="formRef">
    <n-data-table
      ref="tableRef"
      :columns="columns"
      :data="$attrs.model.data"
      size="small"
      :bordered="false"
      :max-height="400"
    />
  </n-form>
</template>

<script setup lang="jsx">
import { ref, nextTick } from 'vue'
import { Delete } from '@vicons/carbon'
import RatingMatrixValuesConfig from './RatingMatrixValuesConfig.vue'
const emit = defineEmits(['remove'])

const formRef = ref(null)
const tableRef = ref(null)

const columns = ref([
  {
    title: '维度名称',
    key: 'dimensionName',
    width: 200,
    render(row, index) {
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
    title() {
      return (
        <div>
          分值设置 <span className="title-desc">设置分数等级和分值</span>
        </div>
      )
    },
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

const scrollToBottom = () => {
  nextTick(() => {
    // 滚动到底部
    tableRef.value.scrollTo({
      top: tableRef.value.$el.querySelector('tbody').scrollHeight,
      behavior: 'smooth',
    })
  })
}

defineExpose({
  scrollToBottom,
  validate(...args) {
    return formRef.value.validate(...args)
  },
})
</script>

<style>
.title-desc {
  font-size: 12px;
  color: #999;
  margin-left: 4px;
}
</style>
