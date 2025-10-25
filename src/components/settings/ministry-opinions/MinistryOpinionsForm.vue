<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <!-- Title -->
      <VCol cols="12">
        <AppTextField
          v-model="title"
          :label="$t('Title')"
          :placeholder="$t('Enter title')"
          :rules="[requiredValidator]"
        />
      </VCol>

      <!-- Tags -->
      <VCol cols="12">
        <AppAutocomplete
          v-model="selectedTag"
          :label="$t('Tags')"
          :placeholder="$t('Tags')"
          :items="tags"
          :rules="[requiredValidator]"
        />
      </VCol>

      <!-- Decision Date -->
      <VCol cols="12">
        <AppDateTimePicker
          v-model="decisionDate"
          :label="$t('Decision Date')"
          :rules="[requiredValidator]"
          placeholder="YYYY-MM-DD"
        />
      </VCol>

      <!-- File Upload -->
      <VCol cols="12">
        <VFileInput
          v-model="file"
          :label="$t('File')"
          accept=".pdf,.doc,.docx"
          :rules="[requiredValidator]"
        />
      </VCol>

      <!-- Buttons -->
      <VCol
        cols="12"
        class="text-right"
      >
        <VBtn
          type="submit"
          class="me-3"
          color="primary"
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
import { useI18n } from 'vue-i18n'
import axios from '@/plugins/axios.js'

const emits = defineEmits(['saved', 'update:isDialogVisible'])
const { t } = useI18n()

const requiredValidator = v => !!v || t('This field is required')

const formRef = ref()
const snackbar = ref()
const isLoading = ref(false)
const title = ref('')
const tags = ref([])
const decisionDate = ref('')
const file = ref(null)
const selectedTag = ref()

function resetForm() {
  formRef.value.reset()
  emits('update:isDialogVisible', false)
}

onBeforeMount( async ()=> {

  await tagsCall()

})

async function tagsCall(){
  const tagsCall = await axios.post('/tags/search-autocomplete-filter', { filters: [], pageNumber: 0, pageSize: 1000 })
  if(tagsCall.status >= 200 && tagsCall.status < 300){
    tags.value=tagsCall.data.map(e => {
      return { title: e.label, value: e.value, disabled: false }})
  }
}


async function onSubmit() {
  formRef.value.validate().then(async ({ valid }) => {
    if (!valid) return

    const formData = new FormData()

    formData.append('title', title.value)
    formData.append('tags', selectedTag.value)
    formData.append('decisionDate', decisionDate.value)
    formData.append('file', file.value)

    isLoading.value = true
    try {
      const response = await axios.post('/ministryopinions/', formData)

      if (response.status >= 200 && response.status < 300) {
        snackbar.value.show(t('Saved successfully'), 'success')
        emits('saved')
        emits('update:isDialogVisible', false)
      } else {
        snackbar.value.show(response.data.message || t('An error occurred'), 'error')
      }
    } catch (error) {
      snackbar.value.show(error.response?.data?.message || t('An error occurred'), 'error')
    } finally {
      isLoading.value = false
    }
  })
}
</script>
