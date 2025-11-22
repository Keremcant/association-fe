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
      </template>
    </VCardItem>

    <VDivider />

    <VCardItem>
      <DataTable
        ref="datatable"
        :headers="headers"
        endpoint="/meallist/get-meal-list-by-institution"
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
        </template>
      </DataTable>
    </VCardItem>
  </VCard>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DataTable from "@/components/datatable/DataTable.vue"
import axios from "@/plugins/axios.js"

const { t } = useI18n()

const updateDialog = ref(false)
const selectedUUID = ref()
const payload = ref([])
const datatable = ref()


async function refresh() {
  isLoading.value = true
  await datatable.value.refresh()
  isLoading.value = false
}

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

const headers = computed(() => [
  { title: t('Year'), key: 'year', sortable: true },
  { title: t('Month'), key: 'month', sortable: true },
  { title: t('Region'), key: 'region', sortable: true },
  { title: t('Actions'), key: 'actions', sortable: false },
])
</script>
