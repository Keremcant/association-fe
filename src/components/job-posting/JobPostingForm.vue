<template>
  <VCard>
    <VCardTitle class="mt-3">
      {{ t('Add Job Posting') }}
    </VCardTitle>

    <VCardText>
      <VForm
        ref="formRef"
        @submit.prevent="submitForm"
      >
        <VRow>
          <VCol cols="12">
            <AppTextField
              v-model="form.institutionName"
              :label="t('Institution Name')"
              disabled
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="form.region"
              :label="t('Region')"
              disabled
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="form.city"
              :label="t('City')"
              disabled
            />
          </VCol>

          <VCol cols="12">
            <AppAutocomplete
              v-model="form.position"
              :items="positions"
              :label="t('Position')"
              :placeholder="t('Seçiniz')"
              :rules="[requiredValidator]"
              clearable
            />
          </VCol>

          <VCol cols="12">
            <AppTextarea
              v-model="form.qualifications"
              :label="t('Qualifications')"
              :placeholder="t('Enter qualifications')"
              rows="4"
              auto-grow
            />
          </VCol>

          <VCol
            cols="12"
            class="d-flex justify-end"
          >
            <VBtn
              color="primary"
              :loading="isLoading"
              type="submit"
            >
              {{ t('Save') }}
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
  <SnackBar ref="snackbar" />
</template>

<script setup>
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import axios from "@/plugins/axios.js"

const props = defineProps({
  isDialogVisible: Boolean,
})

const emits = defineEmits(['saved', 'update:isDialogVisible'])

const { t } = useI18n()
const formRef = ref(null)
const isLoading = ref(false)
const snackbar = ref()
const institutionId = ref()

// Positions listesi
const positions = [
  t('Caregiver'),
  t('Cleaning Staff'),
  t('Chef'),
  t('Assistant Chef'),
  t('Security Staff'),
  t('Driver'),
]

// Form verileri
const form = ref({
  institutionName: '',
  region: '',
  city: '',
  position: '',
  qualifications: '',
})

const requiredValidator = value => !!value || t('This field is required')

onBeforeMount(async () => {
  try {
    const response = await axios.get(`/institution/get-user-active-institution`)
    if (response.status >= 200 && response.status < 300) {
      const data = response.data

      form.value.institutionName = data.institutionName
      form.value.region = data.institutionRegion
      form.value.city = data.institutionProvince
      institutionId.value = data.institutionId

    } else {
      snackbar.value.show(t('Failed to load active institution'), 'error')
    }
  } catch (error) {
    console.error(error)
    snackbar.value.show(t('Failed to load active institution'), 'error')
  }
})

async function submitForm() {
  if (!formRef.value.validate()) return

  isLoading.value = true
  try {
    // Payload'u sadece gereken alanlarla oluştur
    const payload = {
      institutionId: institutionId.value,
      position: form.value.position,
      qualifications: form.value.qualifications,
    }

    const response = await axios.post('/job-posting/', payload)
    if(response.status >= 200 && response.status < 300){
      emits('saved')  // parent component varsa tetikle
    }else{
      isLoading.value = false
      snackbar.value.show(response.data.error, 'error')
    }

  } catch (error) {
    snackbar.value.show(t('Save failed'), 'error')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>
