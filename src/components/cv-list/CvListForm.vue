<template>
  <div class="page-wrapper">
    <!--
      ==========================
      NORMAL EKRAN (NO PRINT)
      =========================== 
    -->
    <div class="screen-wrapper no-print">
      <div class="d-flex align-center justify-center pa-4">
        <VCard
          class="auth-card"
          max-width="1200"
          :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
        >
          <VCardTitle class="d-flex align-center justify-space-between mb-2">
            <div class="text-center flex-grow-1">
              {{ $t('CV Details') }}
            </div>

            <VBtn
              color="primary"
              class="ml-2"
              icon="tabler-printer"
              @click="printPage"
            />
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
                  v-model="form.educabilityStatus"
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

              <VCol cols="12">
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
    </div>

    <!--
      ==========================
      PRINT VERSION (PDF GÖRÜNÜMÜ)
      =========================== 
    -->
    <div class="print-cv-page">
      <h1>{{ form.fullName }}</h1>

      <p><strong>{{ $t('Phone') }}:</strong> {{ form.phone }}</p>
      <p><strong>{{ $t('E Mail') }}:</strong> {{ form.email }}</p>
      <p><strong>{{ $t('Birth Date') }}:</strong> {{ form.birthDate }}</p>
      <p><strong>{{ $t('Gender') }}:</strong> {{ form.gender }}</p>
      <p><strong>{{ $t('Address') }}:</strong> {{ form.address }}</p>

      <hr>

      <h2>{{ $t('Preface') }}</h2>
      <p>{{ form.preface }}</p>

      <hr>

      <h2>{{ $t('Education') }}</h2>
      <div
        v-for="(edu, i) in form.education"
        :key="'edu-print-'+i"
      >
        <strong>{{ edu.school }}</strong><br>
        {{ edu.department }} — {{ edu.graduationYear }} <br><br>
      </div>

      <hr>

      <h2>{{ $t('Work Experience') }}</h2>
      <div
        v-for="(job, i) in form.work"
        :key="'job-print-'+i"
      >
        <strong>{{ job.company }}</strong><br>
        {{ job.position }}<br>
        {{ job.startDate }} →
        {{ job.endDate === '31.12.9999' ? t('Present') : job.endDate }}
        <br><br>
      </div>

      <hr>

      <h2>{{ $t('Certificates') }}</h2>
      <div
        v-for="(cert, i) in form.certificates"
        :key="'cert-print-'+i"
      >
        <strong>{{ cert.title }}</strong><br>
        {{ cert.institution }} — {{ cert.date }}
        <br><br>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue"
import axios from "@/plugins/axios"
import AppTextField from "@core/components/app-form-elements/AppTextField.vue"
import AppTextarea from "@core/components/app-form-elements/AppTextarea.vue"
import { DateTime } from "luxon"
import { useI18n } from "vue-i18n"

const props = defineProps({
  uuid: String,
})

const { t } = useI18n()

const form = ref({
  fullName: "",
  phone: "",
  email: "",
  birthDate: "",
  gender: "",
  educationStatus: "",
  disabilityStatus: "",
  title: "",
  city: "",
  address: "",
  preface: "",
  education: [],
  work: [],
  certificates: [],
})

const fetchCv = async () => {
  if (!props.uuid) return
  try {
    const { data } = await axios.get(`/cvlist/${props.uuid}`)

    form.value.fullName = data.fullName
    form.value.phone = data.phone
    form.value.email = data.email
    form.value.birthDate = data.birthDate
      ? DateTime.fromISO(data.birthDate).toFormat("dd.MM.yyyy")
      : ""
    form.value.gender = data.gender
    form.value.educationStatus = data.educationStatus
    form.value.disabilityStatus = data.disabilityStatus
    form.value.title = data.title
    form.value.city = data.city
    form.value.address = data.address
    form.value.preface = data.preface

    form.value.education = (data.educationDTOS || []).map(e => ({
      ...e,
      graduationYear: e.graduationYear
        ? DateTime.fromISO(e.graduationYear).toFormat("dd.MM.yyyy")
        : "",
    }))

    form.value.work = (data.workExperienceDTOS || []).map(w => ({
      ...w,
      startDate: w.startDate
        ? DateTime.fromISO(w.startDate).toFormat("dd.MM.yyyy")
        : "",
      endDate: w.endDate
        ? DateTime.fromISO(w.endDate).toFormat("dd.MM.yyyy")
        : "",
    }))

    form.value.certificates = (data.certificateDTOS || []).map(c => ({
      ...c,
      date: c.date
        ? DateTime.fromISO(c.date).toFormat("dd.MM.yyyy")
        : "",
    }))
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchCv)

/* =============================
    GARANTİLİ PRINT YÖNTEMİ
 =============================*/
const printPage = () => {
  const content = document.querySelector(".print-cv-page").innerHTML

  const printWindow = window.open("", "", "width=900,height=700")

  printWindow.document.write(`
    <html>
      <head>
        <title>CV</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            padding: 20px;
          }

          h1 { font-size: 26px; margin-bottom: 10px; }
          h2 { font-size: 18px; margin-top: 20px; margin-bottom: 8px; }

          hr { margin: 15px 0; }

          @media print {
            * { page-break-inside: avoid; }
            html, body {
              height: auto !important;
              overflow: visible !important;
            }
            @page { margin: 15mm; }
          }
        </style>
      </head>

      <body>${content}</body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
}
</script>


<style>
.print-cv-page {
  display: none;
}

@media print {
  .no-print {
    display: none !important;
  }
  .print-cv-page {
    display: block !important;
  }
}
</style>
