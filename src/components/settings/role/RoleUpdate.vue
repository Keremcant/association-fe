<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="roleName"
          :label="$t('Role')"
          :placeholder="$t('Role')"
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
import axios from "@/plugins/axios.js"


const props = defineProps({
  id: Number,
})

const emits = defineEmits(['saved', 'update:isDialogVisible'])


const formRef = ref()
const isLoading = ref(false)
const roleName = ref()
const snackbar = ref()

onBeforeMount(async () => {
  const response = await axios.get(`/user-api/role/${props.id}`)
  if(response.status >= 200 && response.status < 300){
    roleName.value = response.data.name
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
        name: roleName.value,
        isStaff: true,
      }

      isLoading.value=true

      const response = await axios.put(`/user-api/role/${props.id}`, payload)
      if(response.status >= 200 && response.status < 300){
        emits('saved')
      }else{
        isLoading.value = false
        snackbar.value.show(response.data.error, 'error')
      }
    }

  })
}
</script>
