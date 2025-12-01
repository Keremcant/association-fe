<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
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
</template>



<script setup>
import { ref } from 'vue'
import axios from "@/plugins/axios"
import { useI18n } from "vue-i18n"


const props = defineProps({
  uuid: String,
})

const emits = defineEmits(['saved', 'update:isDialogVisible'])


const formRef = ref()
const isLoading = ref(false)
const tagsName = ref()
const tagsCode=ref()
const snackbar = ref()
const { t } = useI18n()

const positions = [
  t('Caregiver'),
  t('Cleaning Staff'),
  t('Chef'),
  t('Assistant Chef'),
  t('Security Staff'),
  t('Driver'),
  t('Emergency Medical Technician'),
  t('Child Development Specialist'),
  t('Midwife'),
  t('Assistant Midwife'),
  t('Occupational Therapist'),
  t('Physical Therapy Technician'),
  t('Physiotherapist'),
  t('Gerontologist'),
  t('Nurse'),
  t('Assistant Nurse'),
  t('Psychologist'),
  t('Psychological Counselor'),
  t('Health Officer'),
  t('Health Technician'),
  t('Social Worker'),
  t('Physician'),
]


onBeforeMount(async () => {
  const response = await axios.get(`/job-posting/${props.uuid}`)
  if (response.status >= 200 && response.status < 300) {
    const data = response.data

    form.value.institutionName = data.institution?.institutionName || ''
    form.value.region = data.institution?.institutionRegion || ''
    form.value.city = data.institution?.institutionProvince || ''
    form.value.position = data.position || ''
    form.value.qualifications = data.qualifications || ''

    // Eğer tag veya kod lazım olursa
    tagsName.value = data.position
    tagsCode.value = data.uuid
  }
})



const form = ref({
  institutionName: '',
  region: '',
  city: '',
  position: '',
  qualifications: '',
})

function resetForm() {
  formRef.value.reset()
  emits('update:isDialogVisible', false)
}

async function onSubmit() {
  formRef.value.validate().then(async ({ valid }) => {
    if (valid) {

      const payload = {
        position: form.value.position,
        qualifications: form.value.qualifications,
      }

      isLoading.value = true

      try {
        const response = await axios.put(`/job-posting/${props.uuid}`, payload)
        if (response.status >= 200 && response.status < 300) {
          emits('saved')
          emits('update:isDialogVisible', false)
        }
      } catch (err) {
        snackbar.value.show('anErrorOccurredPleaseTryAgainLater', 'error')
      } finally {
        isLoading.value = false
      }
    }
  })
}
</script>
