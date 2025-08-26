<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="boxId"
          :label="$t('Box Id')"
          :placeholder="$t('Box Id')"
          :rules="[requiredValidator]"
        />
      </VCol>
      <VCol cols="12">
        <AppTextField
          v-model="vehicleName"
          :label="$t('Vehicle')"
          :placeholder="$t('Vehicle')"
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
  <SnackBar ref="snackbar" />
</template>

<script setup>
import { ref } from 'vue'
import axios from "@/plugins/axios.js"

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emits = defineEmits(['saved', 'update:isDialogVisible'])

const formRef = ref()
const boxId = ref()
const isLoading = ref(false)
const vehicleName = ref()
const snackbar = ref()



function resetForm() {
  formRef.value.reset()
  emits('update:isDialogVisible', false)
}

async function onSubmit(){
  formRef.value.validate().then(async ({ valid })=>{
    if(valid){
      const payload = {
        name: vehicleName.value,
        boxId: boxId.value,
      }

      isLoading.value=true
      try{
        const response = await axios.post('/vehicles/', payload)
        if(response.status >= 200 && response.status < 300){
          emits('saved')
        }else{
          snackbar.value.show('There is another machine with the same code.', 'error')
          isLoading.value = false
        }
      }
      catch(error){      
        isLoading.value = false
      }
    }

  })
}
</script>
