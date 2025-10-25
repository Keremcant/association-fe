<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="title"
          :label="$t('Title')"
          :rules="[requiredValidator]"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VSelect
          v-model="tags"
          :items="tagsOptions"
          :label="$t('Tags')"
          multiple
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VDatePicker
          v-model="decisionDate"
          :label="$t('Decision Date')"
          :rules="[requiredValidator]"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VFileInput
          v-model="file"
          :label="$t('File (optional)')"
          accept=".xlsx,.xls,.pdf,.docx"
        />
      </VCol>

      <VCol
        cols="12"
        class="text-right"
      >
        <VBtn
          type="submit"
          color="primary"
          :loading="isLoading"
          class="me-3"
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

const props = defineProps({ id: String })
const emits = defineEmits(['saved', 'update:isDialogVisible'])

const { t } = useI18n()
const formRef = ref()
const snackbar = ref()
const isLoading = ref(false)

// Form alanları
const title = ref('')
const tags = ref([])
const decisionDate = ref('')
const file = ref('')

// Örnek tag seçenekleri
const tagsOptions = ['Education', 'Health', 'Transport', 'Agriculture']

const requiredValidator = value => !!value || 'This field is required'

// Mevcut opinion verilerini getir
onBeforeMount(async () => {
  await getOpinion()
})

async function getOpinion() {
  try {
    const res = await axios.get(`/ministry-opinions-api/${props.id}`)
    if (res.status >= 200 && res.status < 300) {
      title.value = res.data.title
      tags.value = res.data.tags || []
      decisionDate.value = res.data.decisionDate
    }
  } catch (error) {
    snackbar.value.show(t('Failed to load data'), 'error')
  }
}

function resetForm() {
  formRef.value.reset()
  emits('update:isDialogVisible', false)
}

async function onSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const formData = new FormData()

  formData.append('title', title.value)
  formData.append('tags', tags.value.join(','))
  formData.append('decisionDate', decisionDate.value)
  if (file.value) formData.append('file', file.value)

  isLoading.value = true
  try {
    const res = await axios.put(`/ministry-opinions-api/${props.id}`, formData)
    if (res.status >= 200 && res.status < 300) {
      snackbar.value.show(t('Opinion updated successfully'), 'success')
      emits('saved')
      emits('update:isDialogVisible', false)
    }
  } catch (error) {
    snackbar.value.show(error.response?.data?.errorMessage || t('An error occurred'), 'error')
  } finally {
    isLoading.value = false
  }
}
</script>
