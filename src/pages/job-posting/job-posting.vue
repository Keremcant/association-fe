<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('Create Job Posting') }}</VCardTitle>

      <template #append>
        <VBtn
          icon="tabler-refresh"
          size="small"
          @click="refresh"
        />
        <VBtn
          color="primary"
          class="ml-2"
          size="small"
          @click="openCreate"
        >
          {{ $t('Add') }}
        </VBtn>
      </template>
    </VCardItem>

    <VDivider />

    <VCardItem>
      <DataTable
        ref="datatable"
        :headers="headers"
        endpoint="/meal-list-api/get-all"
        :payload="payload"
      >
        <template #actions="{ item }">
          <IconBtn @click="openUpdate(item.item)">
            <VIcon icon="tabler-edit" />
          </IconBtn>
          <IconBtn @click="deleteMeal(item.item.uuid)">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </template>
      </DataTable>
    </VCardItem>

    <VDialog
      v-model="formDialog"
      scrollable
      max-width="600px"
      transition="dialog-transition"
    >
      <DialogCloseBtn @click="closeDialog" />
      <VCard>
        <VCardTitle class="mt-3">
          {{ isUpdate ? $t('Update Job Posting') : $t('Add Job Posting') }}
        </VCardTitle>
        <VCardText>
          <VForm
            ref="formRef"
            @submit.prevent="submitForm"
          >
            <VRow>
              <VCol cols="12">
                <AppTextField
                  v-model="form.institutionName"
                  :label="$t('Institution Name')"
                  disabled
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="form.region"
                  :label="$t('Region')"
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
                <AppAutocomplete
                  v-model="form.position"
                  :items="positions"
                  :label="$t('Position')"
                  :placeholder="t('Seçiniz')"
                  :rules="[requiredValidator]"
                  clearable
                />
              </VCol>
              <VCol cols="12">
                <AppTextarea
                  v-model="form.qualifications"
                  :label="$t('Qualifications')"
                  :placeholder="$t('Enter qualifications')"
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
                  type="submit"
                >
                  {{ isUpdate ? $t('Update') : $t('Save') }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>

    <ConfirmDialog2
      ref="confirmDialog"
      :loading="isLoading"
      @confirm="confirmDeletion"
    />
    <SnackBar ref="snackbar" />
  </VCard>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from '@/plugins/axios'
import DataTable from '@/components/datatable/DataTable.vue'

const { t } = useI18n()
const datatable = ref()
const snackbar = ref()
const confirmDialog = ref()
const formRef = ref()
const isLoading = ref(false)
const formDialog = ref(false)
const isUpdate = ref(false)
const selectedId = ref(null)
const payload = ref([])

const requiredValidator = v => !!v || t('This field is required')

const positions = [
  t('Caregiver'),
  t('Cleaning Staff'),
  t('Chef'),
  t('Assistant Chef'),
  t('Security Staff'),
  t('Driver'),
]


const form = ref({
  institutionName: 'Özel Kış Gülü Bakım Merkezi',
  region: 'Akdeniz',
  city: 'Mersin',
  position: '',
  qualifications: '',
})

const headers = computed(() => [
  { title: t('Institution Name'), key: 'institutionName', sortable: true },
  { title: t('Region'), key: 'region', sortable: true },
  { title: t('City'), key: 'city', sortable: true },
  { title: t('Position'), key: 'position', sortable: true },
  { title: t('Actions'), key: 'actions', sortable: false },
])

async function refresh() {
  isLoading.value = true
  await datatable.value.refresh()
  isLoading.value = false
}

function openCreate() {
  isUpdate.value = false
  formDialog.value = true
  Object.assign(form.value, {
    institutionName: 'Özel Kış Gülü Bakım Merkezi',
    region: 'Akdeniz',
    city: 'Mersin',
    position: null,
    qualifications: '',
  })
}

function openUpdate(item) {
  isUpdate.value = true
  formDialog.value = true
  selectedId.value = item.uuid
  Object.assign(form.value, {
    institutionName: item.institutionName,
    region: item.region,
    city: item.city,
    position: item.position,
    qualifications: item.qualifications,
  })
}

function closeDialog() {
  formDialog.value = false
}

async function submitForm() {
  isLoading.value = true
  try {
    if (isUpdate.value) {
      await axios.put(`/meal-list-api/${selectedId.value}`, form.value)
      snackbar.value.show(t('Updated successfully'), 'success')
    } else {
      await axios.post('/meal-list-api', form.value)
      snackbar.value.show(t('Saved successfully'), 'success')
    }
    formDialog.value = false
    datatable.value.refresh()
  } finally {
    isLoading.value = false
  }
}

function deleteMeal(id) {
  selectedId.value = id
  confirmDialog.value.show(t('Delete'), t('Are you sure you want to delete this record?'))
}

async function confirmDeletion() {
  isLoading.value = true

  const res = await axios.delete(`/meal-list-api/${selectedId.value}`)
  if (res.status >= 200 && res.status < 300) {
    confirmDialog.value.hide()
    snackbar.value.show(t('Deleted successfully'), 'success')
    datatable.value.refresh()
  }
  isLoading.value = false
}
</script>
