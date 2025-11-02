<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppTextField from '@core/components/app-form-elements/AppTextField.vue'
import AppSelect from '@core/components/app-form-elements/AppSelect.vue'
import axios from '@/plugins/axios.js'

const props = defineProps({
  isUserInfoEditDialogVisible: Boolean,
  selectedUser: Object,
})

const emit = defineEmits(['update:isUserInfoEditDialogVisible', 'updateUser'])
const { t } = useI18n()

// 🔹 localUser
const localUser = ref({
  companyName: '',
  companyPhone: '',
  companyEmail: '',
  region: '',
  city: '',
  workAddress: '',
})

// 🔹 Dinamik bölgeler ve şehirler
const regions = ref([])
const cities = ref([])

// 🔹 JSON veya API’den bölgeleri yükle
import regionsData from '@/layouts/regions.json'

// JSON dosyası
onMounted(() => {
  regions.value = Object.keys(regionsData)
})

// 🔹 selectedUser değiştiğinde localUser güncelle
watch(
  () => props.selectedUser,
  newVal => {
    if (newVal) {
      localUser.value = JSON.parse(JSON.stringify(newVal))
    } else {
      localUser.value = {
        companyName: '',
        companyPhone: '',
        companyEmail: '',
        region: '',
        city: '',
        workAddress: '',
      }
    }
  },
  { immediate: true },
)

// 🔹 region değişince şehirleri güncelle
watch(
  () => localUser.value.region,
  region => {
    if (!region) {
      cities.value = []
      localUser.value.city = ''
      
      return
    }
    cities.value = regionsData[region] || []
  },
)

// 🔹 Dialog görünümü
const isDialogVisible = computed({
  get: () => props.isUserInfoEditDialogVisible,
  set: val => emit('update:isUserInfoEditDialogVisible', val),
})

// 🔹 Submit ve Reset
const onFormSubmit = () => {
  emit('updateUser', localUser.value)
  isDialogVisible.value = false
}

const onFormReset = () => {
  localUser.value = JSON.parse(JSON.stringify(props.selectedUser))
  isDialogVisible.value = false
}
</script>

<template>
  <VDialog
    :model-value="isDialogVisible"
    scrollable
    max-width="600"
    transition="dialog-transition"
    @update:model-value="val => isDialogVisible = val"
  >
    <DialogCloseBtn @click="isDialogVisible = false" />

    <VCard class="pa-4">
      <VCardText>
        <h4 class="text-h4 text-center mb-2">
          {{ t('Edit Company') }}
        </h4>

        <VForm @submit.prevent="onFormSubmit">
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
                @click="onFormReset"
              >
                {{ t('Cancel') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
