<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <!-- Title -->
      <VCol cols="12">
        <AppTextField
          v-model="title"
          :label="$t('Title')"
          :placeholder="$t('Enter title')"
          :rules="[requiredValidator]"
        />
      </VCol>

      <!-- Tags -->
      <VCol cols="12">
        <AppSelect
          v-model="selectedTag"
          :label="$t('Tags')"
          :placeholder="$t('Tags')"
          :items="tags"
          :rules="[requiredValidator]"
          multiple
          persistent-hint
        />
      </VCol>

      <!-- Decision Date -->
      <VCol cols="12">
        <AppTextField
          v-model="decisionDate"
          :label="$t('Decision Date')"
          type="date"
          :rules="[requiredValidator]"
        />
      </VCol>

      <!-- File Upload (PDF only) -->
      <VCol cols="12">
        <VFileInput
          v-model="file"
          :label="$t('File (PDF only)')"
          accept=".pdf"
          :rules="[requiredValidator]"
        />
      </VCol>

      <!-- Buttons -->
      <VCol
        cols="12"
        class="text-right"
      >
        <VBtn
          type="submit"
          class="me-3"
          color="primary"
          :loading="isLoading"
        >
          {{ $t('Save') }}
        </VBtn>
        <VBtn
          variant="tonal"
          color="secondary"
          @click="resetForm"
        >
          {{ $t('Cancel') }}
        </VBtn>
      </VCol>
    </VRow>

    <SnackBar ref="snackbar" />
  </VForm>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from '@/plugins/axios.js'

const emits = defineEmits(['saved', 'update:isDialogVisible'])
const { t } = useI18n()

const requiredValidator = v => !!v || t('This field is required')

const formRef = ref()
const snackbar = ref()
const isLoading = ref(false)
const title = ref('')
const tags = ref([])
const decisionDate = ref('')
const file = ref(null)
const selectedTag = ref()

function resetForm() {
  formRef.value.reset()
  emits('update:isDialogVisible', false)
}

onBeforeMount(async () => {
  await tagsCall()
})

async function tagsCall() {
  const res = await axios.post('/tags/search-autocomplete-filter', { filters: [], pageNumber: 0, pageSize: 1000 })
  if (res.status >= 200 && res.status < 300) {
    tags.value = res.data.map(e => ({ title: e.label, value: e.value }))
  }
}

async function onSubmit() {
  formRef.value.validate().then(async ({ valid }) => {
    if (!valid) return

    // PDF kontrolü
    if (!file.value) {
      snackbar.value.show(t('File is required'), 'error')
      
      return
    }
    if (file.value.type !== 'application/pdf') {
      snackbar.value.show(t('Only PDF files are allowed'), 'error')
      
      return
    }

    const formData = new FormData()

    formData.append('title', title.value)
    formData.append('tags', selectedTag.value)

    const formattedDate = decisionDate.value.split('T')[0]


    formData.append('decisionDate', formattedDate)

    formData.append('file', file.value)

    isLoading.value = true
    try {
      const response = await axios.post('/ministryopinions/', formData)

      if (response.status >= 200 && response.status < 300) {
        snackbar.value.show(t('Saved successfully'), 'success')
        emits('saved')
        emits('update:isDialogVisible', false)
      } else {
        snackbar.value.show(response.data.message || t('An error occurred'), 'error')
      }
    } catch (error) {
      snackbar.value.show(error.response?.data?.message || t('An error occurred'), 'error')
    } finally {
      isLoading.value = false
    }
  })
}
</script>
