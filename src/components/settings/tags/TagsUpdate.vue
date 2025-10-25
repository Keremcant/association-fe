<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="tagsName"
          :label="$t('Tags')"
          :placeholder="$t('Tags')"
          :rules="[requiredValidator]"
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
const tagsName = ref()
const tagsCode=ref()
const snackbar = ref()

onBeforeMount(async () => {
  const response = await axios.get(`/tags/${props.uuid}`)
  if(response.status >= 200 && response.status < 300){
    tagsName.value = response.data.name
    tagsCode.value = response.data.code
  }
})

function resetForm() {
  formRef.value.reset()
  emits('update:isDialogVisible', false)
}

async function onSubmit(){
  formRef.value.validate().then(async ({ valid })=>{
    if(valid){

      const payload = {
        name: tagsName.value,
        code: tagsCode.value,
      }

      isLoading.value=true

      const response = await axios.put(`/tags/${props.uuid}`, payload)
      if(response.status >= 200 && response.status < 300){
        emits('saved')
      }else{
        snackbar.value.show('anErrorOccurredPleaseTryAgainLater', 'error')
        isLoading.value = false

      }
    }

  })
}
</script>
