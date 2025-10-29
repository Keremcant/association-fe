<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('Cv List') }}</VCardTitle>
      <template #append>
        <VBtn
          icon="tabler-refresh"
          size="small"
          @click="refresh"
        />
      </template>
    </VCardItem>
    <VCardItem>
      <DataTable
        ref="datatable"
        :headers="headers"
        endpoint="/cvlist/get-all-by-filter"
        :payload="payload"
      >
        <template #actions="{ item }">
          <IconBtn @click="() => showCv(item.item.uuid)">
            <VIcon icon="tabler-eye" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Show Cv') }}
            </VTooltip>
          </IconBtn>
        </template>
      </DataTable>
    </VCardItem>

    <VDialog
      v-model="updateDialog"
      scrollable
      :overlay="false"
      transition="dialog-transition"
      max-width="1200px"
    >
      <DialogCloseBtn @click="updateDialog = false" />
      <VCard>
        <CvListForm
          :uuid="selectedUUID"
          readonly
          @close="updateDialog = false"
        />
      </VCard>
    </VDialog>
  </VCard>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CvListForm from '@/components/cv-list/CvListForm.vue'
import DataTable from "@/components/datatable/DataTable.vue"

const { t } = useI18n()

const loading = ref(false)
const updateDialog = ref(false)
const selectedUUID = ref()
const payload = ref([])
const datatable = ref()

const headers = [
  { title: t('Name Surname'), key: 'fullName' },
  { title: t('Email'), key: 'email' },
  { title: t('Phone'), key: 'phone' },
  { title: t('City'), key: 'city' },
  { title: t('Title'), key: 'title' },
  { title: t('Actions'), key: 'actions', sortable: false },
]


function refresh() {}

function showCv(id) {
  selectedUUID.value = id

  updateDialog.value = true
}
</script>
