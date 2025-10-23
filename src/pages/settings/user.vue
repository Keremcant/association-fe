<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('User') }}</VCardTitle>
      <template #append>
        <VBtn
          icon="tabler-refresh"
          style="margin-right: 3px;"
          size="small"
          @click="refr"
        />
      </template>
    </VCardItem>
    <VDivider />
    <VCardItem>
      <DataTable
        ref="datatable"
        :headers="headers"
        endpoint="/user-api/get-all-by-filter"
        excel-endpoint="/user-api/export/excel"
        :payload="payload"
      >
        <template #actions="{item}">
          <IconBtn @click="deleteUser(item.item.uuid, item.item.firstName)">
            <VIcon icon="tabler-trash" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Delete') }}
            </VTooltip>
          </IconBtn>
        </template>
        <template #status="{ item }">
          <VChip
            :color="statusColor(item.item.isEnable)"
            size="small"
            label
            class="text-capitalize"
          >
            {{ statusName(item.item.isEnable) }}
          </VChip>
        </template>
      </DataTable>
    </VCardItem>
    <ConfirmDialog2
      ref="confirmDialog"
      :loading="isLoading"
      @confirm="confirmDeletion"
    />
    <SnackBar ref="snackbar" />
  </VCard>
</template>

<script setup>
import DataTable from '@/components/datatable/DataTable.vue'
import axios from "@/plugins/axios.js"
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppTextField from "@core/components/app-form-elements/AppTextField.vue"

const { t } = useI18n()
const createDialog = ref(false)
const snackbar = ref()
const isLoading = ref(false)
const datatable = ref()
const confirmDialog = ref()
const userToBeDeletedId = ref()
const search = ref('')
const payload = ref([])
const updateDialog = ref(false)

function filter(){
  if(search.value){
    payload.value = [{ key: 'firstName', value: search.value, operation: ':' }]
  }else{
    payload.value = []
  }
}

watch(search, () => {
  if(search.value===''){
    filter()
  }
})


function deleteUser(id, title){
  userToBeDeletedId.value = id
  confirmDialog.value.show('Delete', `${title}` )

}

async function refr() {
  isLoading.value= true
  let response = await datatable.value.refresh()
  payload.value = []
  if(response.status!=null){
    isLoading.value =false
  }
}

async function confirmDeletion(){
  isLoading.value = true

  const response = await axios.delete(`/user-api/${userToBeDeletedId.value}`)
  if(response.status >= 200 && response.status < 300){
    confirmDialog.value.hide()
    snackbar.value.show('User Deleted', 'success')
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

function statusColor(status) {
  if (status === false) {
    return 'error'
  }
  else if (status === true) {
    return 'success'
  }
  else {
    return 'default-background'
  }
}


const statusName = status => {
  if (status === false) {
    return 'ONAYLANMADI'
  } else {
    return 'ONAYLANDI'
  }
}

const headers = computed(() =>[
  {
    title: t('Index'),
    align: 'start',
    sortable: true,
    key: 'index',
  },
  {
    title: t('First Name'),
    align: 'start',
    sortable: true,
    type: 'String',
    key: 'firstName',
  },
  {
    title: t('Last Name'),
    align: 'start',
    sortable: true,
    type: 'String',
    key: 'lastName',
  },
  {
    title: t('Email'),
    align: 'start',
    sortable: true,
    type: 'String',
    key: 'email',
  },
  {
    title: t('Phone'),
    align: 'start',
    sortable: true,
    type: 'String',
    key: 'gsm',
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

