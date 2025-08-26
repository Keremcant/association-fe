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
      <VCol
        cols="12"
        md="12"
      >
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

const props = defineProps({
  uuid: String,
})
  
const emits = defineEmits(['saved', 'update:isDialogVisible'])
  
  
const formRef = ref()
const isLoading = ref(false)
const mapName = ref()
const MapFile=ref()
const snackbar = ref()
  
onBeforeMount(async () => {
  const response = await axios.get(`/maps/${props.uuid}`)
  if(response.status >= 200 && response.status < 300){
    mapName.value = response.data.name

  }
})
  
function resetForm() {
  formRef.value.reset()
  emits('update:isDialogVisible', false)
}
  
async function onSubmit() {
  try {
    const validationResult = await formRef.value.validate()
    if (validationResult.valid) {
      const formData = new FormData()


      formData.append('name', mapName.value)
      formData.append('file', MapFile.value)

      isLoading.value = true

      const response = await axios.put(`/maps/${props.uuid}`, formData)

      if (response.status >= 200 && response.status < 300) {
        emits('saved')
      } else {
        snackbar.value.show('An error occurred. Please try again later.', 'error')
        isLoading.value = false
      }
    }
  } catch (error) {
    console.error('Dosya yükleme hatası:', error)
    snackbar.value.show('An error occurred. Please try again later.', 'error')
    isLoading.value = false
  }
}
</script>
