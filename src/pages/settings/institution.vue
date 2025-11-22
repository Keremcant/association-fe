<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('Institution') }}</VCardTitle>
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
        endpoint="/institution/get-all-by-filter"
        excel-endpoint="/institution/export/excel"
        :payload="payload"
      >
        <template #actions="{item}">
          <IconBtn @click="institutionUpdatable(item.item.uuid)">
            <VIcon icon="tabler-user-edit" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Institution Updatable') }}
            </VTooltip>
          </IconBtn>
        </template>
        <template #institutionUpdatable="{ item }">
          <VChip
            :color="statusColor(item.item.updatable)"
            size="small"
            label
            class="text-capitalize"
          >
            {{ institutionUpdatableName(item.item.updatable) }}
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
const snackbar = ref()
const isLoading = ref(false)
const datatable = ref()
const confirmDialog = ref()
const institutionToBeDeletedId = ref()
const search = ref('')
const payload = ref([])
const isSendingMail = ref(false)

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

  const response = await axios.delete(`/institution-api/${institutionToBeDeletedId.value}`)
  if(response.status >= 200 && response.status < 300){
    confirmDialog.value.hide()
    snackbar.value.show('Institution Deleted', 'success')
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

const institutionUpdatable = async uuid => {
  if (!uuid) {
    snackbar.value.show('Geçersiz kullanıcı bilgisi.', 'error')

    return
  }

  isSendingMail.value = true

  try {
    const { data } = await axios.put(`/institution/${uuid}/toggle-updatable`)

    // Backend'ten dönen değer doğru mu?
    if (typeof data.updatable !== 'boolean') {
      snackbar.value.show('Sunucudan geçersiz yanıt alındı.', 'error')

      return
    }

    const msg = data.updatable
      ? 'Kurum güncelleme yetkisi AKTİF edildi.'
      : 'Kurum güncelleme yetkisi PASİF edildi.'

    snackbar.value.show(msg, 'success')

    // Tabloyu güncelle
    datatable.value.refresh()

  } catch (error) {
    console.error(error)
    snackbar.value.show('İşlem başarısız oldu. Tekrar deneyin.', 'error')

  } finally {
    isSendingMail.value = false
  }
}


const institutionUpdatableName = status => {
  if (status === true) {
    return 'Güncellenebilir'
  } else {
    return 'Güncellenemez'
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
    title: t('Institution'),
    align: 'start',
    sortable: true,
    type: 'String',
    key: 'institutionName',
  },
  {
    title: t('Institution Region'),
    align: 'start',
    sortable: true,
    type: 'String',
    key: 'institutionRegion',
  },
  {
    title: t('Institution Province'),
    align: 'start',
    sortable: true,
    type: 'String',
    key: 'institutionProvince',
  },
  {
    title: t('Phone'),
    align: 'start',
    sortable: true,
    type: 'String',
    key: 'institutionPhone',
  },
  {
    title: t('Email'),
    align: 'start',
    sortable: true,
    type: 'String',
    key: 'institutionMail',
  },
  {
    title: t('Institution Updatable'),
    align: 'start',
    sortable: true,
    key: 'institutionUpdatable',
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

