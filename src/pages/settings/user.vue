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
                :placeholder="$t('User')"
                append-inner-icon="tabler-search"
                hide-details
                outlined
              />
              <VBtn
                class="ms-2"
                @click="filter"
              >
                {{ $t('Search') }}
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardText>
      <VDivider />
      <DataTable
        ref="datatable"
        :headers="headers"
        endpoint="/user-api/get-all-by-filter"
        :payload="payload"
      >
        <template #actions="{item}">
          <IconBtn @click="() => {userId = item.item.uuid; updateDialog = true;}">
            <VIcon icon="tabler-edit" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Edit User') }}
            </VTooltip>
          </IconBtn>
          <IconBtn @click="() => {selectedUserName = item.item.firstName; selectedUserSurname=item.item.lastName; selectedUserId=item.item.uuid; passwordDialogVisible = true;}">
            <VIcon icon="tabler-lock" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Password') }}
            </VTooltip>
          </IconBtn>
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
      </DataTable>
    </VCardItem>
    <VDialog
      v-model="passwordDialogVisible"
      transition="dialog-transition"
      max-width="800px"
    >
      <DialogCloseBtn @click="passwordDialogVisible = false" />
      <VCard>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <UserPasswordDialog
                :id="selectedUserId"
                v-model:is-dialog-visible="passwordDialogVisible"
                :user-password-dialog-title="fullName"
                @saved="passwordSaved"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
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
          {{ $t('New User') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <UserForm
                v-model:is-dialog-visible="createDialog"
                @saved="userSaved"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
    <VDialog
      v-model="updateDialog"
      scrollablel
      :overlay="false"
      transition="dialog-transition"

      max-width="600px"
    >
      <DialogCloseBtn @click="updateDialog = false" />
      <VCard>
        <VCardTitle class="mt-3">
          {{ $t('User Update') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <UserUpdate
                :id="userId"
                v-model:is-dialog-visible="updateDialog"
                @saved="userUpdated"
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
const userId = ref()
const passwordDialogVisible=ref()
const selectedUserName=ref()
const selectedUserSurname=ref()

const fullName=ref({
  userName: selectedUserName,
  surname: selectedUserSurname,
})

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

function userUpdated(){
  updateDialog.value = false
  snackbar.value.show('Updated User', 'success')
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

function userSaved(){
  datatable.value.refresh()
  createDialog.value = false
  snackbar.value.show('User Saved', 'success')
}

function passwordSaved(){
  datatable.value.refresh()
  createDialog.value = false
  snackbar.value.show('Password Saved', 'success')
}

function roleSaved(){
  datatable.value.refresh()
  createDialog.value = false
  snackbar.value.show('Role Saved', 'success')
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
    key: 'firstName',
  },
  {
    title: t('Last Name'),
    align: 'start',
    sortable: true,
    key: 'lastName',
  },
  {
    title: t('Email'),
    align: 'start',
    sortable: true,
    key: 'email',
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

