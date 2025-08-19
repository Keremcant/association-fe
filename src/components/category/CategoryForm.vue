<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="brandCode"
          :label="$t('Code')"
          :placeholder="$t('Code')"
          :rules="[requiredValidator]"
        />
      </VCol>
      <VCol cols="12">
        <AppTextField
          v-model="brandName"
          :label="$t('brand Name')"
          :placeholder="$t('brand Name')"
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


const emits = defineEmits(['saved', 'update:isDialogVisible'])

const formRef = ref()
const brandCode = ref()
const isLoading = ref(false)
const brandName = ref()



function resetForm() {
  formRef.value.reset()
  emits('update:isDialogVisible', false)
}

async function onSubmit(){
  formRef.value.validate().then(async ({ valid })=>{
    if(valid){

      const payload = {
        name: brandName.value,
        code: brandCode.value,
      }

      isLoading.value=true

      const response = await axios.post('/brand/', payload)
      if(response.status >= 200 && response.status < 300){
        emits('saved')
      }else{
        isLoading.value = false

      }
    }

  })
}
</script>
