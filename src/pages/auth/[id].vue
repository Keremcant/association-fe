<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol>
        <VCard class="mb-6">
          <VRow class="match-height">
            <VCol cols="12">
              <VCardTitle> {{ roleName }} {{ $t('Role Authorized Process Selection') }}  </VCardTitle>
              <VDivider />
              <VCardText style="height: 550px; overflow-y: auto;">
                <VList
                  v-model="selectedAuth"
                  lines="one"
                  density="compact"
                  multiple
                  class="scrollable-list"
                >
                  <VListItem
                    v-for="auth in authList"
                    :key="auth.uuid"
                  >
                    <VListItemTitle>
                      <VCheckbox
                        v-model="auth.checkBox"
                        :label="auth.title"
                        @click="toggleAuthCheckBox(auth)"
                      />
                    </VListItemTitle>
                    <VListItemTitle>{{ auth.to }}</VListItemTitle>
                    <VList
                      v-if="auth.authorizations"
                      style="margin-left: 10px;"
                    >
                      <VListItem
                        v-for="child in auth.authorizations"
                        :key="child.uuid"
                        style="margin-left: 30px"
                      >
                        <VCheckbox
                          v-model="child.checkBox"
                          :label="child.title"
                          @click="toggleChildCheckBox(child)"
                        />
                      </VListItem>
                    </VList>
                  </VListItem>
                </VList>
              </VCardText>
            </VCol>
          </VRow>
          <VRow class="mb-3">
            <VCol
              cols="12"
              class="text-right"
            >
              <VBtn
                type="submit"
                class="me-3"
                :loading="isLoading"
              >
                {{ $t('Save') }}
              </VBtn>
            </VCol>
          </VRow>
        </VCard>
      </Vcol>
    </Vrow>
  </VForm>
  <SnackBar ref="snackbar" />
</template>

<script setup>
import { onBeforeMount, ref } from "vue"
// eslint-disable-next-line import/extensions
import axios from "@/plugins/axios.js"
import { useRoute } from "vue-router"

const route = useRoute()
const uuid = ref(route.params.id)
const roleName=ref(route.query.nameRole)
const authList = ref([])
const selectedAuth = ref([])
const isLoading = ref(false)
const formRef = ref()
const snackbar = ref()

console.log(roleName)

async function fetchAuths() {
  try {
    const response = await axios.get(`/authorizations/get-auth`)
    if (response.status >= 200 && response.status < 300) {
      authList.value = response.data.map(e => ({
        checkBox: false,
        id: e.id,
        uuid: e.uuid,
        title: e.title,
        authorizations: e.authorizations ? e.authorizations.map(c => ({
          checkBox: false,
          uuid: c.uuid,
          title: c.authDescription,
        })) : [],
      }))
    }
  } catch (error) {
    console.error("Error fetching authorizations:", error)
  }
}
async function fetchAuthorizationsByRole() {
  try {
    const response = await axios.get(`/authorizations/get-auth-by-roles/${uuid.value}`)

    response.data.forEach(roleAuth => {
      const auth = authList.value.find(m => m.id === roleAuth.id)
      if (auth) {
        auth.checkBox = true
        roleAuth.authorizations?.forEach(roleChild => {
          const child = auth.authorizations.find(c => c.uuid === roleChild.uuid)
          if (child) {
            child.checkBox = true
            selectedAuth.value.push(child.uuid)
          }
        })
      }
    })
  } catch (error) {
    console.error("Error fetching authorizations by role:", error)
  }
}


onBeforeMount(async () => {
  await fetchAuths()
  await fetchAuthorizationsByRole()

})

const toggleCheckBox = uuid => {
  const index = selectedAuth.value.indexOf(uuid)
  if (index > -1) {
    selectedAuth.value.splice(index, 1)
  } else {
    selectedAuth.value.push(uuid)
  }
}

function toggleAuthCheckBox(auth) {
  const newCheckBoxValue = !auth.checkBox

  auth.checkBox = newCheckBoxValue
  if (newCheckBoxValue) {
    auth.authorizations.forEach(child => {
      child.checkBox = true
      toggleCheckBox(child.uuid)
    })
  } else {
    auth.authorizations.forEach(child => {
      child.checkBox = false

      const index = selectedAuth.value.indexOf(child.uuid)
      if (index > -1) {
        selectedAuth.value.splice(index, 1)
      }
    })
  }
}

function toggleChildCheckBox(child) {
  child.checkBox = !child.checkBox
  toggleCheckBox(child.uuid)

  const parentauth = authList.value.find(auth => auth.id === child.topId)

  if (parentauth) {
    const allauthorizationsUnchecked = parentauth.authorizations.every(child => !child.checkBox)

    parentauth.checkBox = !allauthorizationsUnchecked
    toggleCheckBox(parentauth.uuid)
  }
}

async function onSubmit() {
  await formRef.value.validate().then(async ({ valid }) => {
    if (valid) {
      const payload = { roleUUID: uuid.value, authUUIDs: selectedAuth.value }

      isLoading.value = true
      try {
        const response = await axios.post(`/user-api/role/save-authorizations-to-role`, payload)
        if (response.status >= 200 && response.status < 300) {
          snackbar.value.show('Yetkiler Güncellendi', 'success')
        }else if(response.status === 401){
          snackbar.value.show('Yetkiniz Bulunmamaktadır', 'error')
        }
      } catch (error) {
        snackbar.value.show('Yetki Güncellenmedi', 'error')
      } finally {
        isLoading.value = false
      }
    }
  })
}
</script>

<style>
.scrollable-list {
  overflow-y: auto;
}
</style>
