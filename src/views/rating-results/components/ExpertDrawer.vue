<template>
  <n-drawer :show="visible" :width="520" placement="right" @update:show="handleVisibleChange">
    <n-drawer-content closable title="选择评分专家">
      <div class="h-full flex flex-col">
        <!-- 全选栏 -->
        <n-checkbox
          v-model:checked="selectAll"
          :indeterminate="indeterminate"
          class="mb-5"
          @update:checked="handleSelectAll"
        >
          全部
        </n-checkbox>

        <!-- 专家列表 -->
        <n-checkbox-group v-model:value="selectedExperts" class="flex-1 overflow-y-auto">
          <n-grid :y-gap="16" :x-gap="12" :cols="2">
            <n-gi v-for="item in expertList" :key="item.email">
              <div
                class="border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50"
                :class="isExpertSelected(item) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
              >
                <n-checkbox :value="item" class="!items-center">
                  <div class="flex items-center gap-2.5">
                    <!-- 头像：取名字首字符 -->
                    <div
                      class="w-9 h-9 rounded-full bg-gray-100 text-slate-600 flex items-center justify-center text-sm flex-shrink-0"
                    >
                      {{ getAvatarChar(item.name) }}
                    </div>
                    <div class="flex flex-col min-w-0">
                      <div class="text-sm font-medium text-gray-800 mb-0.5">
                        {{ item.name }}
                      </div>
                      <div class="text-xs text-gray-400 truncate">
                        {{ item.email }}
                      </div>
                    </div>
                  </div>
                </n-checkbox>
              </div>
            </n-gi>
          </n-grid>
        </n-checkbox-group>

        <n-empty v-if="!expertList.length" description="暂无可用专家" class="py-20" />
      </div>

      <template #footer>
        <n-space>
          <n-button @click="handleCancel">取消</n-button>
          <n-button
            type="primary"
            :loading="loading"
            :disabled="!selectedExperts.length"
            @click="handleInviteSubmit"
          >
            邀请
          </n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMessage } from 'naive-ui'
import { getReportExperts, postReportInvitations } from '@/services/apis'

defineOptions({
  name: 'ExpertDrawer',
})

const props = defineProps({
  /** 抽屉可见性（支持 v-model:visible） */
  visible: {
    type: Boolean,
    default: false,
  },
  /** 测试评测任务唯一ID */
  dataId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:visible'])

const message = useMessage()

/** 专家列表 */
const expertList = ref([])

/** 已选专家列表 */
const selectedExperts = ref([])

/** 全选状态 */
const selectAll = ref(false)

/** 提交加载状态 */
const loading = ref(false)

/** 全选框的半选状态 */
const indeterminate = computed(() => {
  return (
    selectedExperts.value.length > 0 &&
    selectedExperts.value.length < expertList.value.length
  )
})

/** 获取专家列表 */
const fetchExperts = async () => {
  try {
    const { data } = await getReportExperts()
    expertList.value = data || []
  } catch (err) {
    console.error('获取专家列表失败:', err)
    expertList.value = []
  }
}

/**
 * 监听抽屉打开，拉取专家列表并重置选择状态
 */
watch(
  () => props.visible,
  (val) => {
    if (val) {
      fetchExperts()
      selectedExperts.value = []
      selectAll.value = false
    }
  },
)

/**
 * 判断专家是否已选中
 * @param {Object} expert - 专家对象
 */
const isExpertSelected = (expert) => {
  return selectedExperts.value.some((e) => e.email === expert.email)
}

/**
 * 全选/取消全选
 * @param {boolean} checked - 全选状态
 */
const handleSelectAll = (checked) => {
  if (checked) {
    selectedExperts.value = [...expertList.value]
  } else {
    selectedExperts.value = []
  }
}

/**
 * 取消按钮
 */
const handleCancel = () => {
  emit('update:visible', false)
}

/**
 * 抽屉可见性变更回调（n-drawer 的 @update:show 事件）
 * @param {boolean} val - 新的可见性状态
 */
const handleVisibleChange = (val) => {
  emit('update:visible', val)
}

/**
 * 提交邀请
 * 调用 POST /tpa/report/invitations
 */
const handleInviteSubmit = async () => {
  if (!selectedExperts.value.length) {
    message.warning('请至少选择一位专家')
    return
  }

  loading.value = true
  try {
    const { status } = await postReportInvitations({
      data_id: props.dataId,
      emails: selectedExperts.value.map((item) => item.email),
    })

    if (status === 200) {
      message.success(
        `已成功向 ${selectedExperts.value.map((e) => e.name).join('、')} 发送评分邀请`,
      )
      emit('update:visible', false)
    }
  } catch (err) {
    console.error('邀请专家失败:', err)
    message.error('邀请专家失败，请重试')
  } finally {
    loading.value = false
  }
}

/**
 * 获取头像首字符
 * @param {string} name - 专家名称
 */
const getAvatarChar = (name) => {
  if (!name) return '?'
  return name.slice(0, 1)
}
</script>
