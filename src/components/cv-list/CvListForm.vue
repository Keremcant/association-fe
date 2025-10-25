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
                v-model="job.endDate"
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
import { ref, watch } from 'vue'
import AppTextField from '@core/components/app-form-elements/AppTextField.vue'
import AppTextarea from '@core/components/app-form-elements/AppTextarea.vue'

const props = defineProps({
  formData: { type: Object, default: () => ({}) },
  readonly: { type: Boolean, default: false },
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

watch(
  () => props.formData,
  val => {
    if (val) form.value = { ...form.value, ...val }
  },
  { immediate: true },
)
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
