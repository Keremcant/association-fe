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
                          @click="toggleChildCheckBox(child, auth)"
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
import { useI18n } from "vue-i18n"

const route = useRoute()
const uuid = ref(route.params.id)
const roleName=ref(route.query.nameRole)
const authList = ref([])
const selectedAuth = ref([])
const isLoading = ref(false)
const formRef = ref()
const snackbar = ref()
const { t } = useI18n()


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
  if (!uuid) return
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
    // Parent seçildiyse parent ekle
    toggleCheckBox(auth.uuid)

    // Tüm childları seç
    auth.authorizations.forEach(child => {
      if (!child.checkBox) {
        child.checkBox = true
        toggleCheckBox(child.uuid)
      }
    })
  } else {
    // Parent kaldırıldıysa parent'ı sil
    const index = selectedAuth.value.indexOf(auth.uuid)
    if (index > -1) selectedAuth.value.splice(index, 1)

    // Tüm childları kaldır
    auth.authorizations.forEach(child => {
      if (child.checkBox) {
        child.checkBox = false

        const idx = selectedAuth.value.indexOf(child.uuid)
        if (idx > -1) selectedAuth.value.splice(idx, 1)
      }
    })
  }
}

function toggleChildCheckBox(child, parentAuth) {
  child.checkBox = !child.checkBox
  toggleCheckBox(child.uuid)

  // Parentı bul
  const parentauth = parentAuth || authList.value.find(auth =>
    auth.authorizations.some(c => c.uuid === child.uuid),
  )

  if (parentauth) {
    const someChecked = parentauth.authorizations.some(c => c.checkBox)

    if (someChecked) {
      // En az 1 child seçiliyse parent işaretli olsun
      if (!parentauth.checkBox) {
        parentauth.checkBox = true
        toggleCheckBox(parentauth.uuid)
      }
    } else {
      // Hiç child kalmadıysa parent'ı kaldır
      parentauth.checkBox = false

      const idx = selectedAuth.value.indexOf(parentauth.uuid)
      if (idx > -1) selectedAuth.value.splice(idx, 1)
    }
  }
}

async function onSubmit() {
  await formRef.value.validate().then(async ({ valid }) => {
    if (valid) {
      const payload = {
        roleUUID: uuid.value,
        authUUIDs: selectedAuth.value.filter(u => u !== null),
      }

      isLoading.value = true
      try {
        const response = await axios.post(`/user-api/role/save-authorizations-to-role`, payload)
        if (response.status >= 200 && response.status < 300) {
          snackbar.value.show('Yetkiler Güncellendi', 'success')
        } else if(response.status === 401){
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
