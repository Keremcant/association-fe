<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="title"
          :label="$t('Explanation')"
          :placeholder="$t('Enter Explanation')"
          :rules="[requiredValidator]"
        />
      </VCol>
      <VCol cols="12">
        <VFileInput
          v-model="file"
          :label="$t('Excel File')"
          accept=".xls,.xlsx"
          :rules="[requiredValidator]"
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
    isLoading.value = true

    try {
      // Mock Excel veri
      const payload = [
        { phone: '05312347447', amount: 45000, uploadedAt: new Date().toLocaleString(), uploadedBy: 'User 1' },
        { phone: '05414785987', amount: 100000, uploadedAt: new Date().toLocaleString(), uploadedBy: 'User 1' },
        { phone: '05322347447', amount: 7500, uploadedAt: new Date().toLocaleString(), uploadedBy: 'User 1' },
        { phone: '05314785987', amount: 1000, uploadedAt: new Date().toLocaleString(), uploadedBy: 'User 1' },
      ]

      emits('saved', payload)
      emits('update:isDialogVisible', false)
      isLoading.value = false
    } catch (error) {
      console.error(error)
      isLoading.value = false
    }
  })
}
</script>
