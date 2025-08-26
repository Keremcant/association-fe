<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('Reference Documents') }}</VCardTitle>
      <template #append>
        <VBtn
          icon="tabler-refresh"
          style="margin-right: 3px;"
          size="small"
          @click="refr"
        />
        <VBtn
          prepend-icon="tabler-plus"
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
        endpoint="/maps/get-all-by-filter"
        :payload="payload"
      >
        <template #status="{ item }">
          <VChip
            :color="statusColor(item.item.active)"
            size="small"
            label
            class="text-capitalize"
          >
            {{ statusTypeName(item.item.active) }}
          </VChip>
        </template>
        <template #actions="{item}">
          <IconBtn @click="downloadFile(item.item.uuid, item.item.name)">
            <VIcon icon="tabler-download" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Download') }}
            </VTooltip>
          </IconBtn>
          <IconBtn @click="updateActive(item.item.uuid, item.item.name)">
            <VIcon icon="tabler-progress-check" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Is Active') }}
            </VTooltip>
          </IconBtn>
          <IconBtn @click="deleteDocument(item.item.uuid, item.item.name)">
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
      v-model="createDialog"
      scrollable
      :overlay="false"
      max-width="600px"
      transition="dialog-transition"
    >
      <DialogCloseBtn @click="createDialog = false" />
      <VCard>
        <VCardTitle class="mt-3">
          {{ $t('New Document') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <MapsForm
                v-model:is-dialog-visible="createDialog"
                @saved="documentSaved"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
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
          {{ $t('Document Update') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <MapsUpdate
                v-model:is-dialog-visible="updateDialog"
                :uuid="selectedDocumentUuid"
                @saved="documentUpdated"
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
    <ConfirmationDialog
      ref="confirmationDialog"
      :loading="isLoading"
      @confirmation="confirmIsActivated"
    />
  </VCard>
  <SnackBar ref="snackbar" />
</template>

<script setup>
import DataTable from '@/components/datatable/DataTable.vue'
import axios from "@/plugins/axios"
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SnackBar from "@/components/SnackBar.vue"
import MapsForm from "@/components/settings/map/MapsForm.vue"
import MapsUpdate from "@/components/settings/map/MapsUpdate.vue"
import ConfirmDialog2 from "@/components/dialogs/ConfirmDialog2.vue"
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog.vue"

const { t } = useI18n()
const createDialog = ref(false)
const snackbar = ref()
const isLoading = ref(false)
const datatable = ref()
const confirmDialog = ref()
const confirmationDialog = ref()
const documentToBeDeletedUuid = ref()
const search = ref('')
const payload = ref([])
const updateDialog = ref(false)
const selectedDocumentUuid = ref()


function filter(){
  if(search.value){
    payload.value = [{ key: 'name', value: search.value, operation: ':' }]
  }else{
    payload.value = []
  }
}

watch(search, () => {
  if(search.value===''){
    filter()
  } 
})


const downloadFile = async (uuid, name) => {
  try {
    const response = await axios({
      url: `/maps/file/${uuid}`,
      method: 'GET',
      responseType: 'blob',
    })

    const type = ref(response.data.type.slice(12))


    const href = URL.createObjectURL(response.data)

    const link = document.createElement('a')

    link.href = href
    link.setAttribute('download', `${name}.kml`)
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(href)
  } catch (error) {
    console.error('Dosya indirme hatası:', error)
  }
}

function deleteDocument(uuid, title){

  documentToBeDeletedUuid.value = uuid
  confirmDialog.value.show('Delete', `${title}` )
}

function updateActive(uuid, title){

  documentToBeDeletedUuid.value = uuid
  confirmationDialog.value.show('Is Active', `Should ${title} be active?` )
}

function documentUpdated(){
  datatable.value.refresh()
  updateDialog.value = false
  snackbar.value.show('Updated Document', 'success')
}



async function refr() {
  let response = await datatable.value.refresh()
  payload.value = []
  if(response.status!=null){
    isLoading.value =false
  }
}

async function confirmDeletion(){
  isLoading.value = true

  const response = await axios.delete(`/maps/${documentToBeDeletedUuid.value}`)
  if(response.status >= 200 && response.status < 300){
    confirmDialog.value.hide()
    snackbar.value.show('Maps Deleted', 'success')
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

async function confirmIsActivated(){
  isLoading.value = true

  const response = await axios.put(`/maps/set-active/${documentToBeDeletedUuid.value}`)
  if(response.status >= 200 && response.status < 300){
    confirmationDialog.value.hide()
    snackbar.value.show('Maps Is Actived', 'success')
    datatable.value.refresh()
    isLoading.value = false
  }else{
    snackbar.value.show('anErrorOccurredPleaseTryAgainLater', 'error')
    isLoading.value = true
  }
}

function statusColor(status) {
  if (status === true) {
    return 'success'
  }else if(status === false) {
    return 'error'
  }
  else {
    return 'default-background'
  }
}

const statusTypeName = status => {

  if (status === true) {
    return 'Aktif'
  } else {
    return 'Pasif'
  }
}



function documentSaved(){
  datatable.value.refresh()
  createDialog.value = false
  snackbar.value.show('Maps Saved', 'success')
}



const headers = computed(() =>[
  {
    title: t('Index'),
    align: 'start',
    sortable: true,
    key: 'index',
  },
  {
    title: t('Map Name'),
    align: 'start',
    sortable: true,
    key: 'name',
  },
  {
    title: t('Status'),
    align: 'start',
    sortable: true,
    key: 'status',
  },
  {
    title: t('Actions'),
    align: 'start',
    sortable: false,
    key: 'actions',
  },
],
)
</script>

