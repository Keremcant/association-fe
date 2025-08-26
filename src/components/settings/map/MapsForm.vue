<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="mapName"
          :label="$t('Map Name')"
          :placeholder="$t('Map Name')"
          :rules="[requiredValidator]"
        />
      </VCol>
      <VCol cols="12">
        <VFileInput
          v-model="MapFile"
          clearable
          chips
          :label="$t('Select File')"
        />
      </VCol>
      <VCol
        cols="12"
        class="text-right"
      >
        <VBtn
          type="submit"
          class="me-3"
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
  </VForm>
</template>
  
<script setup>
import { ref } from 'vue'
import axios from "@/plugins/axios"


const emits = defineEmits(['saved', 'update:isDialogVisible'])
  
const formRef = ref()
const isLoading = ref(false)
const mapName = ref()
const MapFile=ref()
  
  
function resetForm() {
  formRef.value.reset()
  emits('update:isDialogVisible', false)
}
  
async function onSubmit() {
  try {
    const validationResult = await formRef.value.validate()
    if (validationResult.valid) {
      const file = MapFile.value
      if (!file) {
        console.error('Dosya seçilmedi.')
        
        return 
      }

      const formData = new FormData()

      formData.append('name', mapName.value)
      formData.append('file', MapFile.value)

      console.log(MapFile.value)
      isLoading.value = true

      const response = await axios.post('/maps/', formData)
      if (response.status >= 200 && response.status < 300) {
        emits('saved')
      } else {
        console.error('Dosya yükleme hatası')
        isLoading.value = false
      }
    }
  } catch (error) {
    console.error('Dosya yükleme hatası: error', error)
    isLoading.value = false
  }
}
</script>
