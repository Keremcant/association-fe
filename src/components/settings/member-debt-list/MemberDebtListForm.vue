<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <!-- Excel Dosyası -->
      <VCol cols="12">
        <VFileInput
          v-model="file"
          :label="$t('Excel File')"
          accept=".xls,.xlsx"
          :rules="[requiredValidator]"
        />
      </VCol>

      <!-- Butonlar -->
      <VCol
        cols="12"
        class="text-right"
      >
        <VBtn
          type="submit"
          color="primary"
          :loading="isLoading"
        >
          {{ $t('Upload') }}
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
import { ref } from 'vue'
import axios from '@/plugins/axios.js' // axios import

const emits = defineEmits(['saved', 'update:isDialogVisible'])
const formRef = ref()
const snackbar = ref()
const isLoading = ref(false)
const file = ref(null)
const requiredValidator = v => !!v || 'This field is required'

function resetForm() {
  formRef.value.reset()
  emits('update:isDialogVisible', false)
}

async function onSubmit() {
  formRef.value.validate().then(async ({ valid }) => {
    if (!valid) return
    if (!file.value) {
      snackbar.value.show('Excel file is required', 'error')
      
      return
    }

    isLoading.value = true

    try {
      const formData = new FormData()

      formData.append('file', file.value)

      const response = await axios.post('/memberdebtlist/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.status >= 200 && response.status < 300) {
        snackbar.value.show('Excel uploaded successfully', 'success')
        emits('saved', response.data) // backend’den dönen listeyi gönder
        emits('update:isDialogVisible', false)
      } else {
        snackbar.value.show('Upload failed', 'error')
      }
    } catch (error) {
      console.error(error)
      snackbar.value.show(error.response?.data?.message || 'Upload failed', 'error')
    } finally {
      isLoading.value = false
    }
  })
}
</script>
