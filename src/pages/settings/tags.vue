<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('Tags') }}</VCardTitle>
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
      <VDivider />
      <DataTable
        ref="datatable"
        :headers="headers"
        endpoint="/tags/get-all-by-filter"
        :payload="payload"
      >
        <template #actions="{item}">
          <IconBtn @click="() => {selectedTagsUuid = item.item.uuid; updateDialog = true;}">
            <VIcon icon="tabler-edit" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Edit Tags') }}
            </VTooltip>
          </IconBtn>
          <IconBtn @click="deleteTags(item.item.uuid, item.item.name)">
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
          {{ $t('New Tags') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <TagsForm
                v-model:is-dialog-visible="createDialog"
                @saved="tagsSaved"
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
          {{ $t('Tags Update') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <TagsUpdate
                v-model:is-dialog-visible="updateDialog"
                :uuid="selectedTagsUuid"
                @saved="tagsUpdated"
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
import { useRouter } from 'vue-router'
import axios from "@/plugins/axios"
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const createDialog = ref(false)
const snackbar = ref()
const isLoading = ref(false)
const datatable = ref()
const confirmDialog = ref()
const tagsToBeDeletedUuid = ref()
const search = ref('')
const payload = ref([])
const updateDialog = ref(false)
const selectedTagsUuid = ref()


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

function deleteTags(uuid, title){

  tagsToBeDeletedUuid.value = uuid
  confirmDialog.value.show('Delete', `${title}` )
}

function tagsUpdated(){
  datatable.value.refresh()
  updateDialog.value = false
  snackbar.value.show('Updated Tags', 'success')
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

  const response = await axios.delete(`/tags/${tagsToBeDeletedUuid.value}`)
  if(response.status >= 200 && response.status < 300){
    confirmDialog.value.hide()
    snackbar.value.show('Tags Deleted', 'success')
    datatable.value.refresh()
    isLoading.value = false
  }else{
    snackbar.value.show('anErrorOccurredPleaseTryAgainLater', 'error')
    isLoading.value = true
  }
}



function tagsSaved(){
  datatable.value.refresh()
  createDialog.value = false
  snackbar.value.show('Tags Saved', 'success')
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
    key: 'name',
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
