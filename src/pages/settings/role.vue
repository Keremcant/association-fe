<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('Role') }}</VCardTitle>
    </VCardItem>
    <VCardItem>
      <VDivider />
      <DataTable
        ref="datatable"
        :headers="headers"
        :endpoint="endpoint"
        :payload="payload"
      >
        <template #actions="{item}">
          <IconBtn @click="selectAuthorizedPageVisible=true; selectedRoleId = item.item.uuid; selectedRole = item.item.name">
            <VIcon icon="tabler-user-scan" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Authorized Pages') }}
            </VTooltip>
          </IconBtn>
          <IconBtn @click="authorizations(item.item.uuid, item.item.name)">
            <VIcon icon="tabler-shield-lock" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Go Authorizations') }}
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
          {{ $t('New Role') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <RoleForm
                v-model:is-dialog-visible="createDialog"
                @saved="roleSaved"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
    <VDialog
      v-model="selectAuthorizedPageVisible"
      transition="dialog-transition"
      max-width="700px"
      max-height="600px"
    >
      <DialogCloseBtn @click="selectAuthorizedPageVisible = false" />
      <VCard>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <SelectAuthorizedPage
                v-model:is-dialog-visible="selectAuthorizedPageVisible"
                :uuid="selectedRoleId"
                :role-name="selectedRole"
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
          {{ $t('Role Update') }}
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <RoleUpdate
                :id="selectedRoleId"
                v-model:is-dialog-visible="updateDialog"
                @saved="roleUpdated"
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
import { useRouter } from "vue-router"

const props=defineProps({
  roleName: String,
})

const router = useRouter()
const { t } = useI18n()
const createDialog = ref(false)
const snackbar = ref()
const isLoading = ref(false)
const datatable = ref()
const confirmDialog = ref()
const roleToBeDeletedId = ref()
const search = ref('')
const payload = ref( [{ key: 'isStaff',  operation: '=', value: true }])
const updateDialog = ref(false)
const selectedRoleId = ref()
const endpoint=ref('/user-api/role/get-all-by-filter')
const selectAuthorizedPageVisible=ref(false)
const selectedRole = ref()


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

function deleteRole(id, title){

  roleToBeDeletedId.value = id
  confirmDialog.value.show('Delete', `${title}` )
}

function roleUpdated(){
  datatable.value.refresh()
  updateDialog.value = false
  snackbar.value.show('Updated Role', 'success')
}

function authorizations(id, rName){
  router.push({ name: 'auth-id', params: { id: id }, query: { nameRole: rName } })
}



async function confirmDeletion(){
  isLoading.value = true

  const response = await axios.delete(`/user-api/role/${roleToBeDeletedId.value}`)
  if(response.status >= 200 && response.status < 300){
    confirmDialog.value.hide()
    snackbar.value.show('Role Deleted', 'success')
    datatable.value.refresh()
    isLoading.value = false
  }else{
    snackbar.value.show('anErrorOccurredPleaseTryAgainLater', 'error')
    isLoading.value = true
  }
}



function roleSaved(){
  datatable.value.refresh()
  createDialog.value = false
  snackbar.value.show('Role Saved', 'success')
}



const headers = computed(() =>[
  {
    title: t('Role'),
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
