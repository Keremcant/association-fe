<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('Vehicles') }}</VCardTitle>
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
        endpoint="/vehicles/get-all-by-filter"
        excel-endpoint="/vehicles/export/excel"
        :payload="payload"
      >
        <template #actions="{item}">
          <IconBtn @click="() => {selectedVehicleId = item.item.uuid; updateDialog = true;}">
            <VIcon icon="tabler-edit" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Edit Vehicle') }}
            </VTooltip>
          </IconBtn>
          <IconBtn @click="deleteVehicle(item.item.uuid, item.item.name)">
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
          {{ $t('New Vehicle') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VehiclesForm
                v-model:is-dialog-visible="createDialog"
                @saved="vehicleSaved"
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
          {{ $t('Vehicle Update') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VehiclesUpdate
                :id="selectedVehicleId"
                v-model:is-dialog-visible="updateDialog"
                @saved="vehicleUpdated"
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
  </VCard>
  <SnackBar ref="snackbar" />
</template>

<script setup>
import DataTable from '@/components/datatable/DataTable.vue'
import axios from "@/plugins/axios"
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import VehiclesForm from "@/components/settings/vehicles/VehiclesForm.vue"
import VehiclesUpdate from "@/components/settings/vehicles/VehiclesUpdate.vue"

const { t } = useI18n()
const createDialog = ref(false)
const snackbar = ref()
const isLoading = ref(false)
const datatable = ref()
const confirmDialog = ref()
const restCauseToBeDeletedId = ref()
const search = ref('')
const payload = ref([])
const updateDialog = ref(false)
const selectedVehicleId = ref()


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

function deleteVehicle(id, title){

  restCauseToBeDeletedId.value = id
  confirmDialog.value.show('Delete', `${title}` )
}

function vehicleUpdated(){
  datatable.value.refresh()
  updateDialog.value = false
  snackbar.value.show('Updated Vehicle', 'success')
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

  const response = await axios.delete(`/vehicles/${restCauseToBeDeletedId.value}`)
  if(response.status >= 200 && response.status < 300){
    confirmDialog.value.hide()
    snackbar.value.show('Vehicle Deleted', 'success')
    datatable.value.refresh()
    isLoading.value = false
  }else{
    confirmDialog.value.hide()
    snackbar.value.show(response.data.errorMessage, 'error')
    isLoading.value = true
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}



function vehicleSaved(){
  datatable.value.refresh()
  createDialog.value = false
  snackbar.value.show('Vehicle Saved', 'success')
}


const headers = computed(() =>[
  {
    title: t('Index'),
    align: 'start',
    sortable: true,
    key: 'index',
  },
  {
    title: t('Name'),
    align: 'start',
    sortable: true,
    type: 'String',
    key: 'name',
  },
  {
    title: t('Box Id'),
    align: 'start',
    sortable: true,
    type: 'Number',
    key: 'boxId',
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
