<template>
  <div class="w-full overflow-auto flex gap-6">
    <div class="flex-shrink-0 flex items-center" v-for="(item, index) in model" :key="index">
      <n-form-item :path="`data[${dataIndex}].configs[${index}]`" :rule="rule">
        <div class="flex items-center gap-2">
          <n-input-group>
            <n-input
              clearable
              style="width: 100px"
              placeholder="分值等级"
              v-model:value="item.name"
            />
            <n-input-number style="width: 100px" placeholder="分值" v-model:value="item.value" />
          </n-input-group>

          <div class="flex" v-if="index === model.length - 1">
            <n-button quaternary type="primary" @click="handleAdd">
              <n-icon>
                <Add />
              </n-icon>
            </n-button>
            <n-button quaternary type="error" @click="handleRemove(index)" v-if="model.length > 1">
              <n-icon>
                <Remove />
              </n-icon>
            </n-button>
          </div>
        </div>
      </n-form-item>
    </div>
  </div>
</template>

<script setup>
import { Remove, Add } from '@vicons/ionicons5'
const props = defineProps({
  model: {
    type: Array,
    default: () => [],
  },
  dataIndex: {
    type: Number,
    default: 0,
  },
})

const rule = {
  required: true,
  message: '分值等级和分值不能为空',
  trigger: 'blur',
  validator: (rule, value) => {
    if (!value || !value.name || value.value === undefined) {
      return new Error('分值等级和分值不能为空')
    }
    return true
  },
}

const handleAdd = () => {
  // eslint-disable-next-line vue/no-mutating-props
  props.model.push({ name: '', value: '' })
}

const handleRemove = (index) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.model.splice(index, 1)
}
</script>
