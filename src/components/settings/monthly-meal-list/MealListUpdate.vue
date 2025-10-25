<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol
        cols="12"
        md="6"
      >
        <VSelect
          v-model="year"
          :items="yearOptions"
          :label="$t('Year')"
          :rules="[requiredValidator]"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VSelect
          v-model="month"
          :items="monthOptions"
          :label="$t('Month')"
          :rules="[requiredValidator]"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VSelect
          v-model="region"
          :items="regionOptions"
          :label="$t('Region')"
          :rules="[requiredValidator]"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VFileInput
          v-model="file"
          :label="$t('Excel File (optional)')"
          accept=".xlsx, .xls"
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
import { ref, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from '@/plugins/axios.js'

const props = defineProps({ id: String })


const emits = defineEmits(['saved', 'update:isDialogVisible'])


const requiredValidator = value => !!value || 'This field is required'


const { t } = useI18n()
const formRef = ref()
const snackbar = ref()
const isLoading = ref(false)
const year = ref()
const month = ref()
const region = ref()
const file = ref()

const yearOptions = Array.from({ length: 16 }, (_, i) => 2025 + i)

const monthOptions = [
  { title: t('January'), value: 1 },
  { title: t('February'), value: 2 },
  { title: t('March'), value: 3 },
  { title: t('April'), value: 4 },
  { title: t('May'), value: 5 },
  { title: t('June'), value: 6 },
  { title: t('July'), value: 7 },
  { title: t('August'), value: 8 },
  { title: t('September'), value: 9 },
  { title: t('October'), value: 10 },
  { title: t('November'), value: 11 },
  { title: t('December'), value: 12 },
]

const regionOptions = [
  t('Mediterranean Region'),
  t('Eastern Anatolia Region'),
  t('Aegean Region'),
  t('Southeastern Anatolia Region'),
  t('Central Anatolia Region'),
  t('Black Sea Region'),
  t('Marmara Region'),
]

onBeforeMount(async () => {
  await getMeal()
})

async function getMeal() {
  const response = await axios.get(`/meal-list-api/${props.id}`)
  if (response.status >= 200 && response.status < 300) {
    year.value = response.data.year
    month.value = response.data.month
    region.value = response.data.region
  }
}

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
      if (file.value) formData.append('file', file.value)

      isLoading.value = true
      try {
        const response = await axios.put(`/meal-list-api/${props.id}`, formData)
        if (response.status >= 200 && response.status < 300) {
          snackbar.value.show(t('Meal list updated successfully'), 'success')
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
