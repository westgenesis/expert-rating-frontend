<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div class="p-2 cursor-pointer">
        <n-icon class="text-[#f3ab40]">
          <TipsAndUpdatesFilled />
        </n-icon>
      </div>
    </template>
    <div class="flex items-center gap-2">
      <div class="min-w-0 flex-1 break-keep leading-relaxed text-pretty">
        <template v-for="item in list" :key="item.text">
          <n-tag type="warning" v-if="item.isKeyword" class="mx-2">
            <span class="whitespace-nowrap" v-html="item.text"> </span>
          </n-tag>

          <span v-else v-html="item.text"></span>
        </template>
      </div>
    </div>
  </n-tooltip>
</template>

<script setup>
import { TipsAndUpdatesFilled } from '@vicons/material'
import { computed } from 'vue'
const props = defineProps({
  formula: {
    type: String,
    default: '',
  },
  keyword: {
    type: String,
    default: '',
  },
})

const keywordRange = computed(() => {
  const index = props.formula.indexOf(props.keyword)
  if (index === -1) {
    return null
  }

  return [index, index + props.keyword.length]
})

const list = computed(() => {
  if (!props.keyword) {
    return [
      {
        text: props.formula,
        range: [0, props.formula.length],
        isKeyword: false,
      },
    ]
  }
  const keyword = {
    text: props.keyword,
    range: keywordRange.value,
    isKeyword: true,
  }
  const list = props.formula.split(props.keyword).map((item) => ({
    text: item,
    range: [props.formula.indexOf(item), props.formula.indexOf(item) + item.length],
    isKeyword: false,
  }))

  let result = [...list]
  if (keywordRange.value[0] === 0) {
    result.unshift(keyword)
  } else {
    result.splice(1, 0, keyword)
  }
  return result
})
</script>
