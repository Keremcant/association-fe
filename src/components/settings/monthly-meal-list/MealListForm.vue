<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol
        cols="12"
        md="12"
      >
        <AppAutocomplete
          v-model="year"
          :items="yearOptions"
          placeholder="Seçiniz"
          :label="$t('Year')"
          :rules="[requiredValidator]"
        />
      </VCol>

      <VCol
        cols="12"
        md="12"
      >
        <AppAutocomplete
          v-model="month"
          :items="monthOptions"
          placeholder="Seçiniz"
          :label="$t('Month')"
          :rules="[requiredValidator]"
        />
      </VCol>

      <VCol
        cols="12"
        md="12"
      >
        <AppAutocomplete
          v-model="region"
          :items="regionOptions"
          placeholder="Seçiniz"
          :label="$t('Region')"
          :rules="[requiredValidator]"
        />
      </VCol>

      <VCol
        cols="12"
        md="12"
      >
        <VFileInput
          v-model="file"
          :label="$t('Excel File')"
          accept=".xlsx, .xls"
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


const requiredValidator = val => (!!val ? true : t('This field is required'))


const { t } = useI18n()
const formRef = ref()
const snackbar = ref()
const isLoading = ref(false)
const year = ref()
const month = ref()
const region = ref()
const file = ref()

const yearOptions = Array.from({ length: 6 }, (_, i) => 2025 + i)



const monthOptions = [
  { title: t('January'), value: "Ocak" },
  { title: t('February'), value: "Şubat" },
  { title: t('March'), value: "Mart" },
  { title: t('April'), value: "Nisan" },
  { title: t('May'), value: "Mayıs" },
  { title: t('June'), value: "Haziran" },
  { title: t('July'), value: "Temmuz" },
  { title: t('August'), value: "Ağustos" },
  { title: t('September'), value: "Eylül" },
  { title: t('October'), value: "Ekim" },
  { title: t('November'), value: "Kasım" },
  { title: t('December'), value: "Aralık" },
]

const regionOptions = [
  { title: t('Mediterranean Region'), value: "Akdeniz Bölgesi" },
  { title: t('Eastern Anatolia Region'), value: "Doğu Anadolu Bölgesi" },
  { title: t('Aegean Region'), value: "Ege Bölgesi" },
  { title: t('Southeastern Anatolia Region'), value: "Güneydoğu Anadolu Bölgesi" },
  { title: t('Central Anatolia Region'), value: "İç Anadolu Bölgesi" },
  { title: t('Black Sea Region'), value: "Karadeniz Bölgesi" },
  { title: t('Marmara Region'), value: "Marmara Bölgesi" },
]

function resetForm() {
  formRef.value.reset()
  emits('update:isDialogVisible', false)
}

async function onSubmit() {
  formRef.value.validate().then(async ({ valid }) => {
    if (valid) {
      const formData = new FormData()

      formData.append('year', year.value)
      formData.append('month', month.value)
      formData.append('region', region.value)
      formData.append('file', file.value)

      isLoading.value = true
      try {
        const response = await axios.post('/meallist/', formData)
        if (response.status >= 200 && response.status < 300) {
          snackbar.value.show(t('Meal list added successfully'), 'success')
          emits('saved')
          emits('update:isDialogVisible', false)
        } else {
          snackbar.value.show(response.data.error, 'error')
        }
      } catch (error) {
        snackbar.value.show(error.response?.data?.errorMessage || t('An error occurred'), 'error')
      } finally {
        isLoading.value = false
      }
    }
  })
}
</script>
