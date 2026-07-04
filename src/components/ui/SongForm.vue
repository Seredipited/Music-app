<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Music, User, Disc, Clock, Tag } from 'lucide-vue-next'

const emit = defineEmits<{
  submit: [data: SongFormData]
  cancel: []
}>()

export interface SongFormData {
  name: string
  artist: string
  album: string
  duration: string
  genre: string
  cover: string
  audioFile: File | null
}

const formData = reactive<SongFormData>({
  name: '',
  artist: '',
  album: '',
  duration: '',
  genre: '',
  cover: '',
  audioFile: null
})

const audioInputRef = ref<HTMLInputElement | null>(null)
const audioFileName = ref('')

const errors = reactive<Partial<Record<string, string>>>({})

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    if (!file.type.startsWith('audio/')) {
      errors.audio = '请选择有效的音频文件'
      return
    }
    formData.audioFile = file
    audioFileName.value = file.name
    delete errors.audio
  } else {
    formData.audioFile = null
    audioFileName.value = ''
  }
}

function validateForm(): boolean {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!formData.name.trim()) errors.name = '请输入歌曲名称'
  if (!formData.artist.trim()) errors.artist = '请输入歌手名称'
  if (!formData.album.trim()) errors.album = '请输入专辑名称'
  const durationStr = String(formData.duration).trim()
  if (!durationStr || isNaN(Number(durationStr)) || Number(durationStr) <= 0) {
    errors.duration = '请输入有效的歌曲时长（如：240）'
  }

  return Object.keys(errors).length === 0
}

function handleSubmit() {
  formData.duration = String(formData.duration)
  if (validateForm()) {
    if (!formData.cover) {
      const covers = [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
      ]
      formData.cover = covers[Math.floor(Math.random() * covers.length)]
    }
    emit('submit', { ...formData })
  }
}

function handleReset() {
  formData.name = ''
  formData.artist = ''
  formData.album = ''
  formData.duration = ''
  formData.genre = ''
  formData.cover = ''
  formData.audioFile = null
  audioFileName.value = ''
  if (audioInputRef.value) audioInputRef.value.value = ''
  Object.keys(errors).forEach(key => delete errors[key])
}

const genres = ['流行', '摇滚', '古典', '爵士', '民谣', '电子', '说唱', 'R&B', 'Hip-Hop', '其他']

const defaultCovers = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
]

function selectRandomCover() {
  formData.cover = defaultCovers[Math.floor(Math.random() * defaultCovers.length)]
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- 歌曲名称 -->
    <div>
      <label class="flex items-center gap-1.5 text-sm font-medium text-[#606266] mb-1.5">
        歌曲名称 <span class="text-red-500">*</span>
      </label>
      <input
        v-model="formData.name"
        type="text"
        placeholder="如：夜曲"
        class="w-full px-3 py-2 bg-white border rounded-md text-[#303133] placeholder:text-[#c0c4cc] focus:outline-none focus:border-[#409eff] transition-colors text-sm"
        :class="errors.name ? 'border-red-400' : 'border-[#dcdfe6]'"
      />
      <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
    </div>

    <!-- 歌手名称 -->
    <div>
      <label class="flex items-center gap-1.5 text-sm font-medium text-[#606266] mb-1.5">
        歌手 <span class="text-red-500">*</span>
      </label>
      <input
        v-model="formData.artist"
        type="text"
        placeholder="如：周杰伦"
        class="w-full px-3 py-2 bg-white border rounded-md text-[#303133] placeholder:text-[#c0c4cc] focus:outline-none focus:border-[#409eff] transition-colors text-sm"
        :class="errors.artist ? 'border-red-400' : 'border-[#dcdfe6]'"
      />
      <p v-if="errors.artist" class="mt-1 text-xs text-red-500">{{ errors.artist }}</p>
    </div>

    <!-- 专辑名称 -->
    <div>
      <label class="flex items-center gap-1.5 text-sm font-medium text-[#606266] mb-1.5">
        专辑 <span class="text-red-500">*</span>
      </label>
      <input
        v-model="formData.album"
        type="text"
        placeholder="如：十一月的萧邦"
        class="w-full px-3 py-2 bg-white border rounded-md text-[#303133] placeholder:text-[#c0c4cc] focus:outline-none focus:border-[#409eff] transition-colors text-sm"
        :class="errors.album ? 'border-red-400' : 'border-[#dcdfe6]'"
      />
      <p v-if="errors.album" class="mt-1 text-xs text-red-500">{{ errors.album }}</p>
    </div>

    <!-- 时长和音乐类型 -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="flex items-center gap-1.5 text-sm font-medium text-[#606266] mb-1.5">
          时长(秒) <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.duration"
          type="number"
          placeholder="如：240"
          class="w-full px-3 py-2 bg-white border rounded-md text-[#303133] placeholder:text-[#c0c4cc] focus:outline-none focus:border-[#409eff] transition-colors text-sm"
          :class="errors.duration ? 'border-red-400' : 'border-[#dcdfe6]'"
        />
        <p v-if="errors.duration" class="mt-1 text-xs text-red-500">{{ errors.duration }}</p>
      </div>
      <div>
        <label class="flex items-center gap-1.5 text-sm font-medium text-[#606266] mb-1.5">音乐类型</label>
        <select
          v-model="formData.genre"
          class="w-full px-3 py-2 bg-white border border-[#dcdfe6] rounded-md text-[#303133] focus:outline-none focus:border-[#409eff] transition-colors text-sm"
        >
          <option value="">选择类型</option>
          <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>
    </div>

    <!-- 封面链接 -->
    <div>
      <label class="flex items-center gap-1.5 text-sm font-medium text-[#606266] mb-1.5">封面图片链接</label>
      <div class="flex gap-2">
        <input
          v-model="formData.cover"
          type="url"
          placeholder="https://..."
          class="flex-1 px-3 py-2 bg-white border border-[#dcdfe6] rounded-md text-[#303133] placeholder:text-[#c0c4cc] focus:outline-none focus:border-[#409eff] transition-colors text-sm"
        />
        <button
          type="button"
          @click="selectRandomCover"
          class="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-[#dcdfe6] rounded-md text-[#606266] text-sm transition-colors"
        >
          随机
        </button>
      </div>
      <p class="mt-1 text-xs text-[#c0c4cc]">留空将随机分配封面</p>
    </div>

    <!-- 音频文件上传 (替代原音频链接字段) -->
    <div>
      <label class="flex items-center gap-1.5 text-sm font-medium text-[#606266] mb-1.5">
        上传MP3文件
      </label>
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-1.5 px-4 py-2 bg-white border border-dashed border-[#dcdfe6] rounded-md text-[#606266] text-sm hover:border-[#409eff] hover:text-[#409eff] transition-colors cursor-pointer">
          <Music class="w-4 h-4" />
          选择音频文件
          <input
            ref="audioInputRef"
            type="file"
            accept="audio/mpeg,audio/mp3"
            class="hidden"
            @change="onFileChange"
          />
        </label>
        <span v-if="audioFileName" class="text-sm text-[#409eff] max-w-[200px] truncate">
          {{ audioFileName }}
        </span>
        <span v-else class="text-xs text-[#c0c4cc]">未选择文件（可选）</span>
      </div>
      <p v-if="errors.audio" class="mt-1 text-xs text-red-500">{{ errors.audio }}</p>
      <p class="mt-1 text-xs text-[#c0c4cc]">支持 MP3 格式，文件直接存入数据库，无需外部链接</p>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 mt-2">
      <button
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 bg-white hover:bg-gray-50 border border-[#dcdfe6] rounded-md text-[#606266] text-sm transition-colors cursor-pointer"
      >
        取消
      </button>
      <button
        type="button"
        @click="handleReset"
        class="px-4 py-2 bg-white hover:bg-gray-50 border border-[#dcdfe6] rounded-md text-[#606266] text-sm transition-colors cursor-pointer"
      >
        重置
      </button>
      <button
        type="submit"
        class="px-4 py-2 gradient-primary rounded-md text-white font-medium text-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <Music class="w-4 h-4" />
        添加歌曲
      </button>
    </div>
  </form>
</template>
