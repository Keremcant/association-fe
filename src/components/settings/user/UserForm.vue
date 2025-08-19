<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="userName"
          :label="$t('User Name')"
          :placeholder="$t('User')"
          :rules="[requiredValidator,emailValidator]"
        />
      </VCol>
      <VCol cols="12">
        <AppTextField
          v-model="userFirstName"
          :label="$t('First Name')"
          :placeholder="$t('First Name')"
          :rules="[requiredValidator]"
        />
      </VCol>
      <VCol cols="12">
        <AppTextField
          v-model="userLastName"
          :label="$t('Last Name')"
          :placeholder="$t('Last Name')"
          :rules="[requiredValidator]"
        />
      </VCol>
      <VCol cols="12">
        <AppAutocomplete
          v-model="selectedRole"
          :label="$t('Role')"
          :placeholder="$t('Role')"
          :items="roles"
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
    <SnackBar ref="snackbar" />
  </VForm>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import axios from "@/plugins/axios.js"
import AppAutocomplete from "@core/components/app-form-elements/AppAutocomplete.vue"

const emits = defineEmits(['saved', 'update:isDialogVisible'])

const formRef = ref()
const isLoading = ref(false)
const userName = ref()
const userFirstName = ref()
const userLastName = ref()
const snackbar = ref()
const roles = ref([])
const selectedRole = ref()

onBeforeMount( async ()=> {

  await roleCall()

})

async function roleCall(){
  const roleCall = await axios.post('/user-api/role/search-autocomplete-filter', { filters: [{ key: 'isStaff', value: true, operation: '=' }], pageNumber: 0, pageSize: 1000 })
  if(roleCall.status >= 200 && roleCall.status < 300){
    roles.value=roleCall.data.map(e => {
      return { title: e.label, value: e.value, disabled: false }})
  }
}


function resetForm() {
  formRef.value.reset()
  emits('update:isDialogVisible', false)
}


async function onSubmit(){
  formRef.value.validate().then(async ({ valid })=>{
    if(valid){

      const payload = {
        username: userName.value,
        firstName: userFirstName.value,
        lastName: userLastName.value,
        role: selectedRole.value,
      }

      isLoading.value=true
      try{
        const response = await axios.post(`/user-api/create-user`, payload)
        if(response.status >= 200 && response.status < 300){
          emits('saved')
        }else{
          isLoading.value = false
          snackbar.value.show(response.data.error, 'error')
        }
      }
      catch(error){
        isLoading.value = false
        snackbar.value.show(error.response.data.errorMessage, 'error')

      }

    }

  })
}
</script>
