<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VCardTitle class="text-h4 text-center mb-5">
      {{ props.userPasswordDialogTitle.userName + " " + props.userPasswordDialogTitle.surname + " " + "Adlı Kullanıcının Şifre İşlemi" }}
    </VCardTitle>
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="userPassword"
          :label="$t('Password')"
          :rules="[requiredValidator]"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />
      </VCol>
      <VCol cols="12">
        <AppTextField
          v-model="userConfirmPassword"
          :label="$t('Confirm Password')"
          :rules="[requiredValidator]"
          :type="isConfirmPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
          @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
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
    <SnackBar ref="snackbar" />
  </VForm>
</template>

<script setup>
import { ref } from 'vue'
import axios from "@/plugins/axios.js"
    
    
const props=defineProps({
  userPasswordDialogTitle: Object,
  id: String,
})
    
const emits = defineEmits(['saved', 'update:isDialogVisible'])
    
const formRef = ref()
const isLoading = ref(false)
const userPassword = ref()
const snackbar = ref()
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const userConfirmPassword = ref()

function resetForm() {
  formRef.value.reset()
  emits('update:isDialogVisible', false)
}


async function onSubmit(){
  formRef.value.validate().then(async ({ valid })=>{
    if(valid){
    
      const payload = {
        password: userPassword.value,
      }
    
      isLoading.value=true
      if(userConfirmPassword.value === userPassword.value){
        const response = await axios.put(`/user-api/update-password/${props.id}`, payload)
        if(response.status >= 200 && response.status < 300){
          emits('saved')
          isLoading.value=false
          emits('update:isDialogVisible', false)
        }else{
          isLoading.value = false
          snackbar.value.show(response.data.error, 'error')
        }
        snackbar.value.show("Password update success !")

      }else{
        snackbar.value.show('Passwords do not match!', 'error')
        isLoading.value = false
      }

    }
    
  })
}
</script>
