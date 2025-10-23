<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
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
        max-width="600"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
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
            {{ $t('Register') }}
          </h4>
          <p class="mb-0">
            {{ $t('Please fill out the form below to submit your application.') }}
          </p>
        </VCardText>

        <VCardText>
          <VForm
            ref="formRef"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="form.phone"
                  :label="$t('Mobile Phone (starting with 0)')"
                  :rules="[requiredValidator, phoneValidator]"
                  maxlength="11"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="form.nationalId"
                  :label="$t('TR Identity No')"
                  :rules="[requiredValidator, nationalIdValidator]"
                  maxlength="11"
                  :disabled="disabledFields.nationalId"
                  @input="form.nationalId = form.nationalId.replace(/\D/g, '')"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="form.firstName"
                  :label="$t('First Name')"
                  :rules="[requiredValidator]"
                  :disabled="disabledFields.firstName"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="form.lastName"
                  :label="$t('Last Name')"
                  :rules="[requiredValidator]"
                  :disabled="disabledFields.lastName"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="form.userEmail"
                  :label="$t('User Email')"
                  :rules="[requiredValidator, emailValidator]"
                  :disabled="disabledFields.userEmail"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="form.companyName"
                  :label="$t('Company Name')"
                  :rules="[requiredValidator]"
                  :disabled="disabledFields.companyName"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="form.companyPhone"
                  :label="$t('Company Phone')"
                  :rules="[requiredValidator, phoneValidator]"
                  maxlength="11"
                  :disabled="disabledFields.companyPhone"
                  @input="form.companyPhone = form.companyPhone.replace(/\D/g, '')"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="form.companyEmail"
                  :label="$t('Company Email')"
                  :rules="[requiredValidator, emailValidator]"
                  :disabled="disabledFields.companyEmail"
                />
              </VCol>

              <VCol cols="12">
                <VRow>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VSelect
                      v-model="form.region"
                      :items="Object.keys(regionCityMap)"
                      :label="$t('Region')"
                      :rules="[requiredValidator]"
                      dense
                      :disabled="disabledFields.region"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VSelect
                      v-model="form.city"
                      :items="cities"
                      :label="$t('City')"
                      :rules="[requiredValidator]"
                      dense
                      :disabled="disabledFields.city"
                    />
                  </VCol>
                </VRow>
              </VCol>

              <VCol cols="12">
                <VTextarea
                  v-model="form.workAddress"
                  :label="$t('Work Address')"
                  :rules="[requiredValidator]"
                  :disabled="disabledFields.workAddress"
                />
              </VCol>

              <VCol
                cols="12"
                class="d-flex justify-center mt-4"
              >
                <VBtn
                  type="submit"
                  :loading="isLoading"
                  class="px-10"
                >
                  {{ $t('Submit Application') }}
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
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>

  <SnackBar ref="snackbar" />
</template>

<script setup>
import { ref, h, watch } from "vue"
import axios from "@/plugins/axios"
import { VNodeRenderer } from "@layouts/components/VNodeRenderer"
import { themeConfig } from "@themeConfig"
import authV1BottomShape from "@images/svg/auth-v1-bottom-shape.svg?raw"
import authV1TopShape from "@images/svg/auth-v1-top-shape.svg?raw"
import SnackBar from "@/components/SnackBar.vue"
import { useI18n } from 'vue-i18n'
import regionsData from '@/layouts/regions.json'

definePage({ meta: { layout: "blank", public: true } })

const form = ref({
  firstName: "",
  lastName: "",
  nationalId: "",
  region: "",
  city: "",
  workAddress: "",
  companyName: "",
  companyPhone: "",
  companyEmail: "",
  phone: "",
  userEmail: "",
})

const disabledFields = ref({
  firstName: true,
  lastName: true,
  nationalId: true,
  userEmail: true,
  companyName: true,
  companyPhone: true,
  companyEmail: true,
  region: true,
  city: true,
  workAddress: true,
})

const formRef = ref()
const snackbar = ref()
const isLoading = ref(false)
const { t } = useI18n()
const regionCityMap = regionsData
const regions = Object.keys(regionCityMap)
const cities = ref([])

watch(() => form.value.region, newRegion => {
  form.value.city = ""
  cities.value = regionCityMap[newRegion] || []
})

watch(() => form.value.phone, async (newPhone = '') => {
  if (newPhone.length !== 11) {
    Object.keys(disabledFields.value).forEach(key => {
      disabledFields.value[key] = key === 'phone' ? false : true
    })

    form.value.firstName = null
    form.value.lastName = null
    form.value.nationalId = null
    form.value.userEmail = null

    return
  }

  try {
    const { data } = await axios.get(`/user-api/by-gsm/${newPhone}`)

    if (data.success) {
      const { firstName, lastName, identityNumber, email } = data.data

      form.value.firstName = firstName
      form.value.lastName = lastName
      form.value.nationalId = identityNumber
      form.value.userEmail = email;

      ['firstName', 'lastName', 'nationalId', 'userEmail'].forEach(key => {
        disabledFields.value[key] = true
      })

      Object.keys(disabledFields.value).forEach(key => {
        if (!['firstName', 'lastName', 'nationalId', 'userEmail'].includes(key))
          disabledFields.value[key] = false
      })
    } else {
      Object.keys(disabledFields.value).forEach(key => disabledFields.value[key] = false)
    }
  } catch (err) {
    snackbar.value.show('Error checking phone', 'error')
  }
})



const requiredValidator = val => (!!val ? true : t('This field is required'))

const nationalIdValidator = val => {
  if (!val) return t('This field is required')
  if (!/^\d{11}$/.test(val)) return t('TR Identity No must be 11 digits')

  return true
}

const phoneValidator = val => {
  if (!val) return t('This field is required')
  if (!/^0\d{10}$/.test(val)) return t('Phone must start with 0 and be 11 digits')

  return true
}

const emailValidator = val => {
  if (!val) return t('This field is required')
  if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(val)) return t('Invalid email format')

  return true
}

const onSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  isLoading.value = true
  try {
    await axios.post("/api/applicants", form.value)
    snackbar.value.show("Application submitted successfully", "success")
    resetForm()
  } catch (err) {
    snackbar.value.show(err.response?.data?.message || "Submission failed", "error")
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.value = { firstName: "", lastName: "", nationalId: "", region: "", city: "", workAddress: "", companyName: "", companyPhone: "", companyEmail: "", phone: "", userEmail: "" }
  cities.value = []
  Object.keys(disabledFields.value).forEach(key => { if(key!=='phone') disabledFields.value[key] = true })
  formRef.value.resetValidation()
}
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
