<template>
  <n-alert title="公式说明" type="info">
    <div
      v-if="isLatex"
      ref="katexRef"
      class="formula-tips-latex min-w-0 flex-1 break-keep text-sm leading-relaxed text-pretty"
    />
    <div v-else class="min-w-0 flex-1 break-keep text-sm leading-relaxed text-pretty">
      <template v-for="(item, i) in plainSegments" :key="i">
        <span
          v-if="item.isKeyword"
          class="mx-0.5 inline-block align-baseline whitespace-nowrap rounded-sm bg-gray-100 px-2 py-0.5 font-bold text-[#0C53FD]"
        >
          {{ item.text }}
        </span>
        <span v-else>{{ item.text }}</span>
      </template>
    </div>
  </n-alert>
</template>

<script setup>
import { computed, useTemplateRef, watchPostEffect } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const props = defineProps({
  formula: {
    type: String,
    default: '',
  },
  /** 纯文案场景：单个高亮词 */
  keyword: {
    type: String,
    default: '',
  },
  /** 公式 / LaTeX 场景：一个或多个需要高亮的子串 */
  keywords: {
    type: Array,
    default: () => [],
  },
})

const katexRef = useTemplateRef('katexRef')

/** 含反斜杠的 LaTeX 片段走 KaTeX；纯中文说明走内联高亮，避免用公式引擎解析 */
const isLatex = computed(() => {
  if (!props.formula) {
    return false
  }
  return /\\[A-Za-z@]/.test(props.formula)
})

const termsToHighlight = computed(() => {
  const fromList = (props.keywords ?? []).filter((t) => typeof t === 'string' && t)
  if (fromList.length) {
    return fromList
  }
  if (props.keyword) {
    return [props.keyword]
  }
  return []
})

function buildPlainSegments(text, term) {
  if (!text) {
    return []
  }
  if (!term) {
    return [{ text, isKeyword: false }]
  }
  const out = []
  const parts = text.split(term)
  for (let i = 0; i < parts.length; i++) {
    if (i > 0) {
      out.push({ text: term, isKeyword: true })
    }
    out.push({ text: parts[i], isKeyword: false })
  }
  return out
}

/** 纯文案时用于 split 的词条：优先 `keyword`（系统设置里都用它），否则取 `keywords[0]` */
const plainSplitTerm = computed(() => {
  if (isLatex.value) {
    return ''
  }
  if (props.keyword) {
    return props.keyword
  }
  if (Array.isArray(props.keywords) && props.keywords.length) {
    return String(props.keywords[0])
  }
  return ''
})

const plainSegments = computed(() => {
  if (isLatex.value) {
    return []
  }
  return buildPlainSegments(props.formula, plainSplitTerm.value)
})

const highlightedLatex = computed(() => {
  if (!isLatex.value) {
    return props.formula
  }
  let out = props.formula
  const terms = termsToHighlight.value.slice().sort((a, b) => b.length - a.length)
  for (const term of terms) {
    if (!out.includes(term)) {
      continue
    }
    out = out.split(term).join(`\\textcolor{#0C53FD}{${term}}`)
  }
  return out
})

watchPostEffect((onCleanup) => {
  if (!isLatex.value) {
    return
  }
  const el = katexRef.value
  if (!el) {
    return
  }
  katex.render(highlightedLatex.value, el, {
    displayMode: false,
    throwOnError: false,
    strict: 'ignore',
  })
  onCleanup(() => {
    el.textContent = ''
  })
})
</script>

<style scoped>
.formula-tips-latex :deep(.katex) {
  font: inherit;
  line-height: inherit;
}
</style>
