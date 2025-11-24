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
        excel-endpoint="/cvlist/export/excel"
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
          <IconBtn @click="deleteCv(item.item.uuid, item.item.fullName)">
            <VIcon icon="tabler-trash" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Delete') }}
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
  <ConfirmDialog2
    ref="confirmDialog"
    :loading="isLoading"
    @confirm="confirmDeletion"
  />
  <SnackBar ref="snackbar" />
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CvListForm from '@/components/cv-list/CvListForm.vue'
import DataTable from "@/components/datatable/DataTable.vue"
import axios from "@/plugins/axios.js"

const { t } = useI18n()

const loading = ref(false)
const updateDialog = ref(false)
const selectedUUID = ref()
const payload = ref([])
const datatable = ref()
const snackbar = ref()
const isLoading = ref(false)
const confirmDialog = ref()
const cvToBeDeletedUuid = ref()

const headers = [
  { title: t('Name Surname'), key: 'fullName' },
  { title: t('Email'), key: 'email' },
  { title: t('Phone'), key: 'phone' },
  { title: t('City'), key: 'city' },
  { title: t('Title'), key: 'title' },
  { title: t('Actions'), key: 'actions', sortable: false },
]

async function confirmDeletion(){
  isLoading.value = true

  const response = await axios.delete(`/cvlist/${cvToBeDeletedUuid.value}`)
  if(response.status >= 200 && response.status < 300){
    confirmDialog.value.hide()
    snackbar.value.show('CV Deleted', 'success')
    datatable.value.refresh()
    isLoading.value = false
  }else{
    snackbar.value.show('anErrorOccurredPleaseTryAgainLater', 'error')
    isLoading.value = true
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}
function deleteCv(uuid, title){

  cvToBeDeletedUuid.value = uuid
  confirmDialog.value.show('Delete', `${title}` )
}

function refresh() {}

function showCv(id) {
  selectedUUID.value = id

  updateDialog.value = true
}
</script>
