<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('Ministry Opinions') }}</VCardTitle>
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
        endpoint="/ministryopinions/get-all-by-filter"
        :payload="payload"
      >
        <template #actions="{ item }">
          <IconBtn @click="deleteOpinion(item.item.uuid)">
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
          {{ $t('Add Ministry Opinion') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <OpinionForm
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
import OpinionForm from '@/components/settings/ministry-opinions/MinistryOpinionsForm.vue'
import OpinionUpdateForm from '@/components/settings/ministry-opinions/MinistryOpinionsUpdate.vue'

const { t } = useI18n()
const datatable = ref()
const snackbar = ref()
const confirmDialog = ref()
const isLoading = ref(false)
const createDialog = ref(false)
const updateDialog = ref(false)
const selectedId = ref()
const payload = ref([])

async function refresh() {
  isLoading.value = true
  await datatable.value.refresh()
  isLoading.value = false
}

function deleteOpinion(id) {
  selectedId.value = id
  confirmDialog.value.show(t('Delete'), t('Are you sure you want to delete this opinion?'))
}

async function confirmDeletion() {
  isLoading.value = true

  const res = await axios.delete(`/ministry-opinions-api/${selectedId.value}`)
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
  { title: t('Title'), key: 'title', sortable: true },
  { title: t('Tags'), key: 'tags', sortable: false },
  { title: t('Decision Date'), key: 'decisionDate', sortable: true },
  { title: t('File'), key: 'fileName', sortable: false },
  { title: t('Actions'), key: 'actions', sortable: false },
])
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
