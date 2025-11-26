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
        <template #actions="{ item }">
          <IconBtn @click="showInstitution(item.item)">
            <VIcon icon="tabler-eye" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Show Institution') }}
            </VTooltip>
          </IconBtn>

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

    <VDialog
      v-model="showDialog"
      max-width="1200"
    >
      <div class="d-flex align-center justify-center pa-4">
        <VCard
          class="auth-card"
          max-width="1200"
          :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
        >
          <VCardTitle class="text-center mb-2">
            {{ $t('Institution Details') }}
          </VCardTitle>

          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="selectedInstitution.institutionName"
                  :label="$t('Institution')"
                  disabled
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="selectedInstitution.institutionRegion"
                  :label="$t('Institution Region')"
                  disabled
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="selectedInstitution.institutionProvince"
                  :label="$t('Institution Province')"
                  disabled
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="selectedInstitution.institutionPhone"
                  :label="$t('Phone')"
                  disabled
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="selectedInstitution.institutionMail"
                  :label="$t('Email')"
                  disabled
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="selectedInstitution.institutionAddress"
                  :label="$t('Address')"
                  disabled
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardActions class="justify-end">
            <VBtn
              color="primary"
              @click="showDialog = false"
            >
              {{ $t('Close') }}
            </VBtn>
          </VCardActions>
        </VCard>
      </div>
    </VDialog>
  </VCard>
</template>


<script setup>
import DataTable from '@/components/datatable/DataTable.vue'
import axios from "@/plugins/axios.js"
import { onBeforeMount, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const snackbar = ref()
const isLoading = ref(false)
const datatable = ref()
const confirmDialog = ref()
const institutionToBeDeletedId = ref()
const search = ref('')
const payload = ref([])
const isSendingMail = ref(false)

const showDialog = ref(false)
const selectedInstitution = ref({})

function showInstitution(item) {
  selectedInstitution.value = { ...item }
  showDialog.value = true
}

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
    if (typeof data.updatable !== 'boolean') {
      snackbar.value.show('Sunucudan geçersiz yanıt alındı.', 'error')
      
      return
    }

    const msg = data.updatable
      ? 'Kurum güncelleme yetkisi AKTİF edildi.'
      : 'Kurum güncelleme yetkisi PASİF edildi.'

    snackbar.value.show(msg, 'success')
    datatable.value.refresh()

  } catch (error) {
    snackbar.value.show('İşlem başarısız oldu. Tekrar deneyin.', 'error')
  } finally {
    isSendingMail.value = false
  }
}

const institutionUpdatableName = status => {
  if (status === true) return 'Güncellenebilir'
  
  return 'Güncellenemez'
}

const headers = computed(() =>[
  { title: t('Index'), key: 'index', sortable: true },
  { title: t('Institution'), key: 'institutionName', sortable: true },
  { title: t('Institution Region'), key: 'institutionRegion', sortable: true },
  { title: t('Institution Province'), key: 'institutionProvince', sortable: true },
  { title: t('Phone'), key: 'institutionPhone', sortable: true },
  { title: t('Email'), key: 'institutionMail', sortable: true },
  { title: t('Institution Updatable'), key: 'institutionUpdatable', sortable: true },
  { title: t('Actions'), key: 'actions', sortable: false },
])
</script>
