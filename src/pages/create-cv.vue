<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- Top / Bottom Shapes -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <VCard
        class="auth-card"
        max-width="1200"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <!-- Logo -->
        <VCardItem class="justify-center">
          <VCardTitle>
            <RouterLink to="/">
              <div class="app-logo">
                <VNodeRenderer :nodes="themeConfig.app.logo" />
                <h1 class="app-logo-title">
                  {{ themeConfig.app.title }}
                </h1>
              </div>
            </RouterLink>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <h4 class="text-h4 mb-1">
            {{ $t('Create CV') }}
          </h4>
          <p class="mb-0">
            {{ $t('Please fill out the form below to create your CV.') }}
          </p>
        </VCardText>

        <VCardText>
          <template v-if="formSubmitted">
            <VAlert
              type="success"
              variant="tonal"
              class="text-center mb-4"
            >
              {{ $t('Your application has been received!') }}
            </VAlert>
            <div class="d-flex justify-center mt-6">
              <VBtn
                color="primary"
                class="px-10"
                @click="goToLogin"
              >
                {{ $t('Back To Login') }}
              </VBtn>
            </div>
          </template>

          <template v-else>
            <VForm
              ref="formRef"
              @submit.prevent="onSubmit"
            >
              <VRow>
                <!-- Basic Info -->
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.fullName"
                    :label="$t('Name Surname')"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.phone"
                    :label="$t('Phone (starting with 0)')"
                    maxlength="11"
                    :rules="[requiredValidator, phoneValidator]"
                    @input="form.phone = form.phone.replace(/\D/g, '')"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.email"
                    :label="$t('E Mail')"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.birthDate"
                    :label="$t('Birth Date')"
                    type="date"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppAutocomplete
                    v-model="form.gender"
                    :items="[$t('Male'), $t('Female')]"
                    :label="$t('Gender')"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppAutocomplete
                    v-model="form.educationStatus"
                    :items="[$t('Primary School'), $t('Middle School'), $t('High School'), $t('Associate Degree'), $t('Bachelor’s Degree'), $t('Master’s Degree')]"
                    :label="$t('Education Status')"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppAutocomplete
                    v-model="form.disabilityStatus"
                    :items="[$t('No'), $t('Yes')]"
                    :label="$t('Disability')"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppAutocomplete
                    v-model="form.title"
                    :items="[
                      $t('Caregiver'),
                      $t('Cleaning Staff'),
                      $t('Chef'),
                      $t('Assistant Chef'),
                      $t('Security Staff'),
                      $t('Driver'),
                      $t('Emergency Medical Technician'),
                      $t('Assistant Chef'),
                      $t('Child Development Specialist'),
                      $t('Midwife'),
                      $t('Assistant Midwife'),
                      $t('Occupational Therapist'),
                      $t('Physical Therapy Technician'),
                      $t('Physiotherapist'),
                      $t('Gerontologist'),
                      $t('Nurse'),
                      $t('Assistant Nurse'),
                      $t('Psychologist'),
                      $t('Psychological Counselor'),
                      $t('Health Officer'),
                      $t('Health Technician'),
                      $t('Social Worker'),
                      $t('Physician'),
                      $t('Cleaning Staff')
                    ]"
                    :label="$t('Appellation')"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppAutocomplete
                    v-model="form.city"
                    :items="cities"
                    :label="$t('City')"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.address"
                    :label="$t('Address')"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol cols="12">
                  <AppTextarea
                    v-model="form.preface"
                    :label="$t('Preface')"
                    :rules="[requiredValidator]"
                  />
                </VCol>
              </VRow>

              <!-- Education Section -->
              <h4 class="mt-8 mb-2">
                {{ $t('Education') }}
              </h4>
              <div
                v-for="(edu, index) in form.education"
                :key="'edu-' + index"
                class="dynamic-section"
              >
                <VRow>
                  <VCol
                    cols="12"
                    md="4"
                  >
                    <AppTextField
                      v-model="edu.school"
                      :label="$t('School Name')"
                      :rules="[requiredValidator]"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="4"
                  >
                    <AppTextField
                      v-model="edu.department"
                      :label="$t('Department Name')"
                      :rules="[requiredValidator]"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <AppTextField
                      v-model="edu.graduationYear"
                      type="date"
                      :label="$t('Graduation Date')"
                      :rules="[requiredValidator]"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="1"
                    class="d-flex align-center justify-center mt-4"
                  >
                    <VBtn
                      icon="tabler-trash"
                      color="error"
                      variant="plain"
                      class="rounded-circle"
                      @click="removeEducation(index)"
                    />
                  </VCol>
                </VRow>
              </div>
              <VBtn
                color="primary"
                variant="tonal"
                class="add-btn mt-3"
                @click="addEducation"
              >
                {{ $t('Add Education') }}
              </VBtn>

              <!-- Work Experience Section -->
              <h4 class="mt-8 mb-2">
                {{ $t('Work Experience') }}
              </h4>
              <div
                v-for="(job, index) in form.work"
                :key="'work-' + index"
                class="dynamic-section"
              >
                <VRow
                  class="align-center flex-nowrap"
                  style="gap: 8px;"
                >
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <AppTextField
                      v-model="job.company"
                      :label="$t('Company Name')"
                      :rules="[requiredValidator]"
                      dense
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <AppTextField
                      v-model="job.position"
                      :label="$t('Position')"
                      :rules="[requiredValidator]"
                      dense
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <AppTextField
                      v-model="job.startDate"
                      type="date"
                      :label="$t('Start Date')"
                      :rules="[requiredValidator]"
                      dense
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <AppTextField
                      v-if="!job.currentlyWorking"
                      v-model="job.endDate"
                      type="date"
                      :label="$t('End Date')"
                      :rules="[requiredValidator]"
                      dense
                    />
                    <div
                      v-else
                      class="mt-4 text-center"
                    >
                      {{ $t('Present') }}
                    </div>
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                    class="d-flex align-center"
                  >
                    <VCheckbox
                      v-model="job.currentlyWorking"
                      :label="$t('Currently Working')"
                      hide-details
                      dense
                      @change="onCurrentlyWorkingChange(job)"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="1"
                    class="d-flex align-center justify-center"
                  >
                    <VBtn
                      icon="tabler-trash"
                      color="error"
                      variant="plain"
                      @click="removeWork(index)"
                    />
                  </VCol>
                </VRow>
              </div>
              <VBtn
                color="primary"
                variant="tonal"
                class="add-btn mt-3"
                @click="addWork"
              >
                {{ $t('Add Work') }}
              </VBtn>

              <!-- Certificates Section -->
              <h4 class="mt-8 mb-2">
                {{ $t('Certificates') }}
              </h4>
              <div
                v-for="(cert, index) in form.certificates"
                :key="'cert-' + index"
                class="dynamic-section"
              >
                <VRow>
                  <VCol
                    cols="12"
                    md="4"
                  >
                    <AppTextField
                      v-model="cert.title"
                      :label="$t('Certificate Title')"
                      :rules="[requiredValidator]"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="4"
                  >
                    <AppTextField
                      v-model="cert.institution"
                      :label="$t('Institution')"
                      :rules="[requiredValidator]"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <AppTextField
                      v-model="cert.date"
                      type="date"
                      :label="$t('Date')"
                      :rules="[requiredValidator]"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="1"
                    class="d-flex align-center justify-center mt-4"
                  >
                    <VBtn
                      icon="tabler-trash"
                      color="error"
                      variant="plain"
                      @click="removeCertificate(index)"
                    />
                  </VCol>
                </VRow>
              </div>
              <VBtn
                color="primary"
                variant="tonal"
                class="add-btn mt-3"
                @click="addCertificate"
              >
                {{ $t('Add Certificate') }}
              </VBtn>

              <!-- Submit -->
              <VCol
                cols="12"
                class="d-flex justify-center mt-6"
              >
                <VBtn
                  type="submit"
                  :loading="isLoading"
                  class="px-10"
                >
                  {{ $t('Save') }}
                </VBtn>
              </VCol>

              <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center mt-2"
                  :to="{ name: 'login' }"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    size="20"
                    class="me-1 flip-in-rtl"
                  />
                  <span>{{ $t('Back To Login') }}</span>
                </RouterLink>
              </VCol>
            </VForm>
          </template>
        </VCardText>
      </VCard>
    </div>
  </div>

  <SnackBar ref="snackbar" />
</template>

<script setup>
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import SnackBar from '@/components/SnackBar.vue'
import citiesData from '@/layouts/cities.json'
import { useI18n } from 'vue-i18n'
import axios from '@/plugins/axios'

definePage({ meta: { layout: 'blank', unauthenticatedOnly: true } })

const { t } = useI18n()
const router = useRouter()
const snackbar = ref()
const formRef = ref()
const isLoading = ref(false)
const formSubmitted = ref(false)
const cities = ref(citiesData)

const form = ref({
  fullName: '',
  phone: '',
  birthDate: '',
  gender: '',
  educationStatus: '',
  disabilityStatus: '',
  title: '',
  city: '',
  address: '',
  education: [],
  work: [],
  certificates: [],
  preface: '',
  email: '',
})

const requiredValidator = val => (!!val ? true : t('This field is required'))
const phoneValidator = val => (!val ? t('This field is required') : !/^0\d{10}$/.test(val) ? t('Phone must start with 0 and be 11 digits') : true)

// Education
const addEducation = () => form.value.education.push({ school: '', department: '', graduationYear: '' })
const removeEducation = index => form.value.education.splice(index, 1)

// Work
const addWork = () => form.value.work.push({ company: '', position: '', startDate: '', endDate: '', currentlyWorking: false })
const removeWork = index => form.value.work.splice(index, 1)
const onCurrentlyWorkingChange = job => { job.currentlyWorking ? job.endDate = '9999-12-31' : job.endDate = '' }

// Certificates
const addCertificate = () => form.value.certificates.push({ title: '', institution: '', date: '' })
const removeCertificate = index => form.value.certificates.splice(index, 1)

const onSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  isLoading.value = true
  try {
    const response = await axios.post('/cvlist/', form.value)
    if (response.status >= 200 && response.status < 300) {
      formSubmitted.value = true
      snackbar.value.show(t('CV created successfully!'), 'success')
    } else {
      snackbar.value.show(response.data.message || t('Error occurred'), 'error')
    }
  } catch (error) {
    console.error(error)
    snackbar.value.show(error.response?.data?.message || t('Error occurred'), 'error')
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => { router.push({ name: 'login' }) }
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
.v-card { transition: box-shadow 0.2s ease-in-out; &:hover { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); } }
.v-btn { text-transform: none; font-weight: 500; }
.v-field__input { font-size: 0.95rem; }
.dynamic-section { margin-bottom: 12px; }
</style>
