<template>
  <VCardText>
    <h4 class="text-h4 text-center mb-2">
      {{ t('Edit Company') }}
    </h4>

    <VForm @submit.prevent="onSubmit">
      <VRow>
        <VCol
          cols="12"
          md="12"
        >
          <AppTextField
            v-model="localUser.companyName"
            :label="t('Company Name')"
          />
        </VCol>

        <VCol
          cols="12"
          md="12"
        >
          <AppTextField
            v-model="localUser.companyPhone"
            :label="t('Company Phone')"
          />
        </VCol>

        <VCol
          cols="12"
          md="12"
        >
          <AppTextField
            v-model="localUser.companyEmail"
            :label="t('Company Email')"
          />
        </VCol>

        <VCol
          cols="12"
          md="12"
        >
          <AppSelect
            v-model="localUser.region"
            :items="regions"
            :label="t('Region')"
          />
        </VCol>

        <VCol
          cols="12"
          md="12"
        >
          <AppSelect
            v-model="localUser.city"
            :items="cities"
            :label="t('City')"
          />
        </VCol>
        <VCol
          cols="12"
          class="d-flex flex-wrap justify-center gap-4 mt-4"
        >
          <VBtn type="submit">
            {{ t('Save') }}
          </VBtn>

          <VBtn
            color="secondary"
            variant="tonal"
            @click="onCancel"
          >
            {{ t('Cancel') }}
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </VCardText>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from '@/plugins/axios.js'
import AppTextField from '@core/components/app-form-elements/AppTextField.vue'
import AppSelect from '@core/components/app-form-elements/AppSelect.vue'
import regionsData from '@/layouts/regions.json'

const props = defineProps({
  isUserInfoEditDialogVisible: Boolean,
  selectedInstitution: String,
})

const emit = defineEmits(['update:isUserInfoEditDialogVisible', 'updateUser'])
const { t } = useI18n()
const isInitialLoad = ref(true)
const regions = ref([])
const cities = ref([])
const isLoading = ref(false)
const formRef = ref(null)

const localUser = ref({
  companyName: '',
  companyPhone: '',
  companyEmail: '',
  region: '',
  city: '',
  workAddress: '',
})

onMounted(async () => {
  regions.value = Object.keys(regionsData)
  if (props.selectedInstitution) {
    try {
      const response = await axios.get(`/institution/${props.selectedInstitution}`)
      if (response.status >= 200 && response.status < 300 && response.data) {
        const data = response.data

        // Formu doldur
        localUser.value.companyName = data.institutionName || ''
        localUser.value.companyPhone = data.institutionPhone || ''
        localUser.value.companyEmail = data.institutionMail || ''
        localUser.value.region = data.institutionRegion || ''
        localUser.value.city = data.institutionProvince || ''
        localUser.value.workAddress = data.institutionAddress || ''

        if (data.institutionRegion && regionsData[data.institutionRegion]) {
          cities.value = regionsData[data.institutionRegion]
        }
      }
    } catch (error) {
      console.error('Institution verisi alınamadı:', error)
    }
  }
})


watch(
  () => localUser.value.region,
  (newRegion, oldRegion) => {
    if (isInitialLoad.value) {
      isInitialLoad.value = false
      
      return
    }

    if (newRegion && regionsData[newRegion]) {
      cities.value = regionsData[newRegion]
    } else {
      cities.value = []
    }

    if (newRegion !== oldRegion) {
      localUser.value.city = null
    }
  },
)
function onCancel() {
  emit('update:isUserInfoEditDialogVisible', false) // sadece dialog kapanacak
}

async function onSubmit() {
  if (!formRef.value) {
    await saveInstitution()
  } else {
    formRef.value.validate().then(async ({ valid }) => {
      if (valid) {
        await saveInstitution()
      }
    })
  }
}

async function saveInstitution() {
  try {
    isLoading.value = true

    const payload = {
      institutionName: localUser.value.companyName,
      institutionRegion: localUser.value.region,
      institutionProvince: localUser.value.city,
      institutionPhone: localUser.value.companyPhone,
      institutionAddress: localUser.value.workAddress,
      institutionMail: localUser.value.companyEmail,
    }

    const response = await axios.put(`/institution/${props.selectedInstitution}`, payload)

    if (response.status >= 200 && response.status < 300) {
      emit('updateUser') // parent’a güncellendi sinyali gönder
      emit('update:isUserInfoEditDialogVisible', false) // dialog kapansın
    } else {
      console.error('Güncelleme başarısız:', response.data)
    }
  } catch (error) {
    console.error('Kurum güncelleme hatası:', error)
  } finally {
    isLoading.value = false
  }
}
</script>


