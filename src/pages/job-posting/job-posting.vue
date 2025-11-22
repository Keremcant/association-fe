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
        endpoint="/job-posting/get-all-by-filter"
        :payload="payload"
      >
        <template #actions="{ item }">
          <IconBtn @click="() => {selectedJobPostingUuid = item.item.uuid; updateDialog = true;}">
            <VIcon icon="tabler-edit" />
          </IconBtn>
          <IconBtn @click="deleteMeal(item.item.uuid)">
            <VIcon icon="tabler-trash" />
          </IconBtn>
          <IconBtn @click="webPublish(item.item.uuid)">
            <VIcon icon="tabler-brand-webflow" />
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
      <JobPostingForm
        v-model:is-dialog-visible="formDialog"
        @saved="jobPostingSaved"
      />
    </VDialog>
    <VDialog
      v-model="updateDialog"
      scrollable
      :overlay="false"
      transition="dialog-transition"
      max-width="600px"
    >
      <DialogCloseBtn @click="updateDialog = false" />
      <VCard>
        <VCardTitle class="mt-3">
          {{ $t('Job Posting Update') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <JobPostingsUpdate
                v-model:is-dialog-visible="updateDialog"
                :uuid="selectedJobPostingUuid"
                @saved="jobPostingUpdated"
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
import axios from '@/plugins/axios'
import DataTable from '@/components/datatable/DataTable.vue'
import JobPostingForm from "@/components/job-posting/JobPostingForm.vue"
import JobPostingsUpdate from "@/components/job-posting/JobPostingsUpdate.vue"

const { t } = useI18n()
const datatable = ref()
const snackbar = ref()
const confirmDialog = ref()
const isLoading = ref(false)
const formDialog = ref(false)
const updateDialog = ref(false)
const isUpdate = ref(false)
const selectedId = ref(null)
const payload = ref([])
const selectedJobPostingUuid = ref()

const headers = computed(() => [
  { title: t('Institution Name'), key: 'institution.institutionName', sortable: true },
  { title: t('Region'), key: 'institution.institutionRegion', sortable: true },
  { title: t('City'), key: 'institution.institutionProvince', sortable: true },
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
}

function jobPostingUpdated(){
  datatable.value.refresh()
  updateDialog.value = false
  snackbar.value.show('Updated Job Postings', 'success')
}

function jobPostingSaved(){
  datatable.value.refresh()
  formDialog.value = false
  snackbar.value.show('Role Saved', 'success')
}

function closeDialog() {
  formDialog.value = false
}

function deleteMeal(id) {
  selectedId.value = id
  confirmDialog.value.show(t('Delete'), t('Are you sure you want to delete this record?'))
}

async function webPublish(uuid) {
  const response = await axios.put(`/job-posting/${uuid}/web-pushing`)
  if (response.status >= 200 && response.status < 300) {
    snackbar.value.show(t('Web Pushing successfully'), 'success')

  }
}

async function confirmDeletion() {
  isLoading.value = true

  const res = await axios.delete(`/job-posting/${selectedId.value}`)
  if (res.status >= 200 && res.status < 300) {
    confirmDialog.value.hide()
    snackbar.value.show(t('Deleted successfully'), 'success')
    datatable.value.refresh()
  }
  isLoading.value = false
}
</script>
