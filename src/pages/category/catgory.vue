<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('Category') }}</VCardTitle>
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
      <VCardText style="padding: 0 24px 24px 24px">
        <VRow>
          <VCol
            cols="12"
            offset-md="8"
            md="4"
          >
            <div style="display: flex; align-items: center;">
              <AppTextField
                v-model="search"
                :placeholder="$t('Category')"
                append-inner-icon="tabler-search"
                hide-details
                outlined
              />
              <VBtn
                class="ms-2"
                @click="filter"
              >
                {{ $t('search') }}
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardText>
      <VDivider />
      <DataTable
        ref="datatable"
        :headers="headers"
        endpoint="/category/get-all-by-filter"
        :payload="payload"
      >
        <template #actions="{item}">
          <IconBtn @click="() => {selectedCategoryUuid = item.item.uuid; updateDialog = true;}">
            <VIcon icon="tabler-edit" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Edit Category') }}
            </VTooltip>
          </IconBtn>
          <IconBtn @click="deleteCategory(item.item.uuid, item.item.name)">
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
          {{ $t('New Category') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <CategoryForm
                v-model:is-dialog-visible="createDialog"
                @saved="categorySaved"
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
          {{ $t('Category Update') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <CategoryUpdate
                v-model:is-dialog-visible="updateDialog"
                :uuid="selectedCategoryUuid"
                @saved="categoryUpdated"
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
import AppTextField from "@core/components/app-form-elements/AppTextField.vue"

const { t } = useI18n()
const createDialog = ref(false)
const snackbar = ref()
const isLoading = ref(false)
const datatable = ref()
const confirmDialog = ref()
const categoryToBeDeletedUuid = ref()
const search = ref('')
const payload = ref([])
const updateDialog = ref(false)
const selectedCategoryUuid = ref()


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

function deleteCategory(uuid, title){

  categoryToBeDeletedUuid.value = uuid
  confirmDialog.value.show('Delete', `${title}` )
}

function categoryUpdated(){
  datatable.value.refresh()
  updateDialog.value = false
  snackbar.value.show('Updated Category', 'success')
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

  const response = await axios.delete(`/category/${categoryToBeDeletedUuid.value}`)
  if(response.status >= 200 && response.status < 300){
    confirmDialog.value.hide()
    snackbar.value.show('Category Deleted', 'success')
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



function categorySaved(){
  datatable.value.refresh()
  createDialog.value = false
  snackbar.value.show('Category Saved', 'success')
}


const headers = computed(() =>[
  {
    title: t('Code'),
    align: 'start',
    sortable: true,
    key: 'code',
  },
  {
    title: t('Category'),
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
