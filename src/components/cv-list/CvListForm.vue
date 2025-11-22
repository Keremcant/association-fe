<template>
  <div class="d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card"
      max-width="1200"
      :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
    >
      <VCardTitle class="text-center mb-2">
        {{ $t('CV Details') }}
      </VCardTitle>

      <VCardText>
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="form.fullName"
              :label="$t('Name Surname')"
              disabled
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="form.phone"
              :label="$t('Phone')"
              disabled
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="form.email"
              :label="$t('E Mail')"
              disabled
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="form.birthDate"
              :label="$t('Birth Date')"
              disabled
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="form.gender"
              :label="$t('Gender')"
              disabled
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="form.educationStatus"
              :label="$t('Education Status')"
              disabled
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="form.disabilityStatus"
              :label="$t('Disability')"
              disabled
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="form.title"
              :label="$t('Appellation')"
              disabled
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="form.city"
              :label="$t('City')"
              disabled
            />
          </VCol>

          <VCol cols="6">
            <AppTextField
              v-model="form.address"
              :label="$t('Address')"
              disabled
            />
          </VCol>

          <VCol cols="12">
            <AppTextarea
              v-model="form.preface"
              :label="$t('Preface')"
              disabled
            />
          </VCol>
        </VRow>

        <h4 class="mt-6 mb-2">
          {{ $t('Education') }}
        </h4>
        <div
          v-for="(edu, index) in form.education"
          :key="'edu-' + index"
        >
          <VRow>
            <VCol
              cols="12"
              md="4"
            >
              <AppTextField
                v-model="edu.school"
                :label="$t('School Name')"
                disabled
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <AppTextField
                v-model="edu.department"
                :label="$t('Department Name')"
                disabled
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <AppTextField
                v-model="edu.graduationYear"
                :label="$t('Graduation Date')"
                disabled
              />
            </VCol>
          </VRow>
        </div>

        <h4 class="mt-6 mb-2">
          {{ $t('Work Experience') }}
        </h4>
        <div
          v-for="(job, index) in form.work"
          :key="'job-' + index"
        >
          <VRow>
            <VCol
              cols="12"
              md="3"
            >
              <AppTextField
                v-model="job.company"
                :label="$t('Company Name')"
                disabled
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
            >
              <AppTextField
                v-model="job.position"
                :label="$t('Position')"
                disabled
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
            >
              <AppTextField
                v-model="job.startDate"
                :label="$t('Start Date')"
                disabled
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
            >
              <AppTextField
                :value="job.endDate === '31.12.9999' ? t('Present') : job.endDate"
                :label="$t('End Date')"
                disabled
              />
            </VCol>
          </VRow>
        </div>

        <h4 class="mt-6 mb-2">
          {{ $t('Certificates') }}
        </h4>
        <div
          v-for="(cert, index) in form.certificates"
          :key="'cert-' + index"
        >
          <VRow>
            <VCol
              cols="12"
              md="4"
            >
              <AppTextField
                v-model="cert.title"
                :label="$t('Certificate Title')"
                disabled
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <AppTextField
                v-model="cert.institution"
                :label="$t('Institution')"
                disabled
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <AppTextField
                v-model="cert.date"
                :label="$t('Date')"
                disabled
              />
            </VCol>
          </VRow>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import AppTextField from '@core/components/app-form-elements/AppTextField.vue'
import AppTextarea from '@core/components/app-form-elements/AppTextarea.vue'
import { DateTime } from 'luxon'
import { useI18n } from "vue-i18n"

const props = defineProps({
  uuid: String,
})

const form = ref({
  fullName: '',
  phone: '',
  email: '',
  birthDate: '',
  gender: '',
  educationStatus: '',
  disabilityStatus: '',
  title: '',
  city: '',
  address: '',
  preface: '',
  education: [],
  work: [],
  certificates: [],
})

const isLoading = ref(false)
const { t } = useI18n()

const fetchCv = async () => {
  if (!props.uuid) return
  isLoading.value = true
  try {
    const response = await axios.get(`/cvlist/${props.uuid}`)
    const data = response.data

    form.value.fullName = data.fullName
    form.value.phone = data.phone
    form.value.email = data.email
    form.value.birthDate = data.birthDate
      ? DateTime.fromISO(data.birthDate).toFormat('dd.MM.yyyy')
      : ''
    form.value.gender = data.gender
    form.value.educationStatus = data.educationStatus
    form.value.disabilityStatus = data.disabilityStatus
    form.value.title = data.title
    form.value.city = data.city
    form.value.address = data.address
    form.value.preface = data.preface

    // Education
    form.value.education = (data.educationDTOS || []).map(edu => ({
      ...edu,
      graduationYear: edu.graduationYear
        ? DateTime.fromISO(edu.graduationYear).toFormat('dd.MM.yyyy')
        : '',
    }))

    // Work
    form.value.work = (data.workExperienceDTOS || []).map(job => ({
      ...job,
      startDate: job.startDate
        ? DateTime.fromISO(job.startDate).toFormat('dd.MM.yyyy')
        : '',
      endDate: job.endDate
        ? DateTime.fromISO(job.endDate).toFormat('dd.MM.yyyy')
        : '',
    }))

    // Certificates
    form.value.certificates = (data.certificateDTOS || []).map(cert => ({
      ...cert,
      date: cert.date
        ? DateTime.fromISO(cert.date).toFormat('dd.MM.yyyy')
        : '',
    }))
  } catch (error) {
    console.error('Error fetching CV:', error)
  } finally {
    isLoading.value = false
  }
}


onMounted(() => {
  fetchCv()
})
</script>

<style scoped>
.auth-card {
  transition: box-shadow 0.2s ease-in-out;
}
.auth-card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
h4 {
  font-weight: 600;
}
</style>
