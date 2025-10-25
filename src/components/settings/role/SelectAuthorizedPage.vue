<template>
  <VForm
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <VRow justify="center">
      <h1>{{ props.roleName }}</h1>
    </VRow>
    <VRow class="match-height">
      <VCol cols="12">
        <VCardTitle>{{ $t('Select Authorized Pages') }}</VCardTitle>
        <VDivider />
        <VCardText style="block-size: 300px;">
          <VList
            v-model="selectedModule"
            lines="one"
            density="compact"
            multiple
            class="scrollable-list"
          >
            <VListItem
              v-for="module in moduleList"
              :key="module.id"
            >
              <VListItemTitle>
                <VCheckbox
                  v-model="module.checkBox"
                  :label="$t(module.title)"
                  @click="toggleModuleCheckBox(module)"
                />
              </VListItemTitle>
              <VListItemTitle> {{ module.to }} </VListItemTitle>
              <VListItem
                v-for="child in module.children"
                :key="child.id"
                style="margin-left: 30px"
              >
                <VCheckbox
                  v-model="child.checkBox"
                  :label="$t(child.title)"
                  @click="toggleChildCheckBox(child)"
                />
              </VListItem>
            </VListItem>
          </VList>
        </VCardText>
      </VCol>

      <VCol
        cols="12"
        class="text-right"
        style="margin-top: 50px"
      >
        <VBtn
          type="submit"
          class="me-3"
          :loading="isLoading"
        >
          {{ $t('Save') }}
        </VBtn>
        <VBtn
          variant="tonal"
          color="secondary"
          @click="resetForm"
        >
          {{ $t('Cancel') }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<script setup>
import { onBeforeMount, ref } from "vue"
import axios from "@/plugins/axios.js"

const props = defineProps({
  id: Number,
  routeType: String,
  roleName: String,
})

const emits = defineEmits(['saved', 'update:isDialogVisible'])

const selectedModule = ref([])
const moduleList = ref([])
const formRef = ref()
const isLoading = ref(false)

async function fetchModules() {
  try {
    const response = await axios.get(`/module/get-module`)
    if (response.status >= 200 && response.status < 300) {
      moduleList.value = response.data.map(e => ({
        checkBox: false,
        id: e.id,
        title: e.title,
        children: e.children ? e.children.map(c => ({
          checkBox: false,
          id: c.id,
          topId: c.topId,
          title: c.title,
        })) : [],
      }))
    }
  } catch (error) {
    console.error("Error fetching modules:", error)
  }
}

async function fetchModulesByRole() {
  try {
    const response = await axios.get(`/module/get-module-by-role/${props.id}`)

    response.data.forEach(roleModule => {
      const module = moduleList.value.find(m => m.id === roleModule.id)
      if (module) {
        module.checkBox = true
        selectedModule.value.push(module.id)
        roleModule.children?.forEach(roleChild => {
          const child = module.children.find(c => c.id === roleChild.id)
          if (child) {
            child.checkBox = true
            selectedModule.value.push(child.id)
          }
        })
      }
    })
  } catch (error) {
    console.error("Error fetching modules by role:", error)
  }
}

onBeforeMount(async () => {
  await fetchModules()
  await fetchModulesByRole()
})

async function onSubmit() {
  await formRef.value.validate().then(async ({ valid }) => {
    if (valid) {
      const payload = { id: props.id, roleId: props.id, moduleIds: selectedModule.value }


      isLoading.value = true
      try {
        const response = await axios.post(`/user-api/role/save-modules-to-role`, payload)
        if (response.status >= 200 && response.status < 300) {
          emits('saved', true)
          emits('update:isDialogVisible', false)
          window.location.reload()
        }
      } catch (error) {
        console.error("Error saving module:", error)
      } finally {
        isLoading.value = false
      }
    }
  })
}

const toggleCheckBox = id => {
  const index = selectedModule.value.indexOf(id)
  if (index > -1) {
    selectedModule.value.splice(index, 1)
  } else {
    selectedModule.value.push(id)
  }
}

function toggleModuleCheckBox(module) {
  const newCheckBoxValue = !module.checkBox

  module.checkBox = newCheckBoxValue

  if (newCheckBoxValue) {
    module.children.forEach(child => {
      child.checkBox = true
      toggleCheckBox(child.id)
    })
  } else {
    module.children.forEach(child => {
      child.checkBox = false

      const index = selectedModule.value.indexOf(child.id)
      if (index > -1) {
        selectedModule.value.splice(index, 1)
      }
    })
  }
  toggleCheckBox(module.id)
}

function toggleChildCheckBox(child) {
  child.checkBox = !child.checkBox
  toggleCheckBox(child.id)

  const parentModule = moduleList.value.find(module => module.id === child.topId)

  if (parentModule) {
    const allChildrenUnchecked = parentModule.children.every(child => !child.checkBox)

    parentModule.checkBox = !allChildrenUnchecked

    toggleCheckBox(parentModule.id)
  }
}


const resetForm = () => {
  selectedModule.value = []
  moduleList.value.forEach(module => {
    module.checkBox = false
    module.children.forEach(child => {
      child.checkBox = false
    })
  })
  emits('update:isDialogVisible', false)
}
</script>

<style scoped>
.scrollable-list {
  max-height: 300px;
  overflow-y: auto;
}
</style>
