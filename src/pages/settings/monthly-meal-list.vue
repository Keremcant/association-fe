<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('Monthly Meal List') }}</VCardTitle>
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
          @click="createDialog = true"
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
        endpoint="/meallist/get-all-by-filter"
        excel-endpoint="/meal-list-api/export/excel"
        :payload="payload"
      >
        <template #actions="{ item }">
          <IconBtn @click="downloadFile(item.item.uuid, item.item)">
            <VIcon icon="tabler-download" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Download') }}
            </VTooltip>
          </IconBtn>
          <IconBtn @click="deleteMeal(item.item.uuid)">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </template>
      </DataTable>
    </VCardItem>

    <VDialog
      v-model="createDialog"
      scrollable
      max-width="600px"
      transition="dialog-transition"
    >
      <DialogCloseBtn @click="createDialog = false" />
      <VCard>
        <VCardTitle class="mt-3">
          {{ $t('Add Meal List') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <MealForm
                v-model:is-dialog-visible="createDialog"
                @saved="created"
              />
            </VCol>
          </VRow>
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
import DataTable from '@/components/datatable/DataTable.vue'
import axios from '@/plugins/axios.js'
import MealForm from '@/components/settings/monthly-meal-list/MealListForm.vue'
import MealUpdateForm from '@/components/settings/monthly-meal-list/MealListUpdate.vue'

const { t } = useI18n()
const datatable = ref()
const snackbar = ref()
const confirmDialog = ref()
const isLoading = ref(false)
const createDialog = ref(false)
const updateDialog = ref(false)
const selectedId = ref()
const payload = ref([])

const downloadFile = async (id, name) => {
  try {
    const response = await axios({
      url: `/meallist/file/${id}`,
      method: 'GET',
      responseType: 'blob',
    })

    // MIME tipine göre uzantı belirleme
    const mimeToExt = {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/pdf': 'pdf',
      'text/csv': 'csv',
    }

    const extension = mimeToExt[response.data.type] || 'bin'

    const href = URL.createObjectURL(response.data)
    const link = document.createElement('a')

    link.href = href
    link.setAttribute('download', `${name.region} - ${name.year} - ${name.month}.${extension}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(href)
  } catch (error) {
    console.error('Dosya indirme hatası:', error)
  }
}



async function refresh() {
  isLoading.value = true
  await datatable.value.refresh()
  isLoading.value = false
}

function deleteMeal(id) {
  selectedId.value = id
  confirmDialog.value.show(t('Delete'))
}

async function confirmDeletion() {
  isLoading.value = true

  const res = await axios.delete(`/meallist/${selectedId.value}`)
  if (res.status >= 200 && res.status < 300) {
    confirmDialog.value.hide()
    snackbar.value.show(t('Deleted successfully'), 'success')
    datatable.value.refresh()
  }
  isLoading.value = false
}

function created() {
  datatable.value.refresh()
  createDialog.value = false
  snackbar.value.show(t('Saved successfully'), 'success')
}

const headers = computed(() => [
  { title: t('Year'), key: 'year', sortable: true },
  { title: t('Month'), key: 'month', sortable: true },
  { title: t('Region'), key: 'region', sortable: true },
  { title: t('Actions'), key: 'actions', sortable: false },
])
</script>
