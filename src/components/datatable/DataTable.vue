<template>
  <div class="datatable-wrapper">
    <div
      class="datatable-actions"
      style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;"
    >
      <div style="display: flex; gap: 1rem; align-items: center;">
        <AppAutocomplete
          v-model="selectedFilterColumn"
          :label="$t('Selected Filter Column')"
          :placeholder="$t('Column')"
          :items="tableHeaders"
          style="width: 200px;"
        />
        <AppAutocomplete
          v-model="selectedInclude"
          :label="$t('Include')"
          :placeholder="$t('Include')"
          :items="include"
          hide-details
          dense
          style="width: 180px;"
        />

        <AppTextField
          v-model="search"
          :label="$t('Search')"
          :placeholder="$t('Search')"
          :disabled="!isSearchEnabled"
          style="width: 250px;"
        />
        <VBtn
          color="primary"
          outlined
          style="margin-top: 20px"
          @click="clear"
        >
          {{ $t('Clear') }}
        </VBtn>
      </div>
      <VBtn
        color="primary"
        outlined
        style="margin-top: 20px"
        @click="excelExport"
      >
        {{ $t('Excel Export') }}
      </VBtn>
    </div>
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="pageNumber"
      :headers="headers"
      :search="search"
      show-current-page
      :items-length="totalItems"
      :items="serverItems"
      :items-per-page-options="itemsPerPageOptions"
      :loading="loading"
      item-value="name"
      hover
      sticky
      :no-data-text="$t('noData')"
      @click:row="(event, item) => {
        if(event.detail === 2)
          return //$emit('rowClick', item.item.raw.uuid, item.item.raw)
      }"
      @update:options="loadItems"
    >
      <template #[`item.index`]="{ index }">
        <td>{{ index+1 }}</td>
      </template>

      <template #[`item.image`]="{ item }">
        <VImg
          :src="item.value.image"
          style="height: 3rem;"
        />
      </template>

      <template #[`item.actions`]="{ item }">
        <slot
          name="actions"
          :item="{ item }"
        />
      </template>

      <template #[`item.eventTime`]="{ item }">
        <slot
          name="eventTime"
          :item="{ item }"
        />
      </template>

      <template #[`item.status`]="{ item }">
        <slot
          name="status"
          :item="{ item }"
        />
      </template>

      <template #[`item.userUpdatable`]="{ item }">
        <slot
          name="userUpdatable"
          :item="{ item }"
        />
      </template>
      <template #[`item.institutionUpdatable`]="{ item }">
        <slot
          name="institutionUpdatable"
          :item="{ item }"
        />
      </template>
      <template #[`item.DateTime`]="{ item }">
        <slot
          name="DateTime"
          :item="{ item }"
        />
      </template>
    </VDataTableServer>
  </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue'
import axios from "@/plugins/axios"
import AppAutocomplete from "@core/components/app-form-elements/AppAutocomplete.vue"

const props = defineProps({
  headers: Array,
  endpoint: String,
  method: String,
  payload: Object,
  excelEndpoint: String,
})

defineEmits(['rowClick'])

const loading = ref(false)
const itemsPerPage = ref(10)
const search = ref()
const pageNumber = ref(1)
const serverItems = ref([])
const totalItems = ref(0)
const selectedFilterColumn = ref()
const selectedInclude = ref()

const include = ref([
  { value: ":", title: 'İçeren' },
  { value: "=", title: 'Eşittir' },
])

const isSearchEnabled = computed(() => {
  return !!selectedFilterColumn.value && !!selectedInclude.value
})

const propsHeaders = props.headers

const tableHeaders = computed(() => {
  return propsHeaders
    .filter(h => h.key !== 'actions' && h.key !== 'index') // burada filtre
    .map(h => ({
      title: h.title,
      value: h.key,
    }))
})

const filters = computed(() => {
  if (!selectedFilterColumn.value || !selectedInclude.value || !search.value) return []

  const colType = props.headers.find(h => h.key === selectedFilterColumn.value)?.type || 'String'

  const formattedValue = colType === 'String' ? `${search.value}` : Number(search.value)

  return [
    {
      key: selectedFilterColumn.value, // dropdown’dan seçilen kolon
      value: formattedValue,            // tipine göre formatlandı
      operation: selectedInclude.value, // ':' veya '='
    },
  ]
})


const filterPayload = computed(() => ({
  filters: filters.value,          // yukarıdaki array
  pageSize: itemsPerPage.value,
  pageNumber: pageNumber.value - 1,
}))

const itemsPerPageOptions = ref([
  { value: 5, title: '5' },
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 50, title: '50' },
  { value: 100, title: '100' },
])


watch(() => props.payload, async () => {
  await loadItems()
})

async function loadItems(){
  loading.value = true
  let response

  try {
    if(props.method === 'GET'){
      response = await axios.get(props.endpoint)
      if(response && response.status >= 200 && response.status < 300){
        serverItems.value = response.data
        totalItems.value = response.data.length
      } else {
        //snackbar.value.show('anErrorOccurredPleaseTryAgainLater', 'error')
      }
    } else {
      response = await axios.post(props.endpoint, filterPayload.value)
      if(response && response.status >= 200 && response.status < 300){
        serverItems.value = response.data.data
        totalItems.value = response.data.totalElements
      } else {
        //snackbar.value.show('anErrorOccurredPleaseTryAgainLater', 'error')
      }
    }
  } catch(err) {
    console.error(err)

    //snackbar.value.show('anErrorOccurredPleaseTryAgainLater', 'error')
  } finally {
    loading.value = false
  }

  return response
}

// Refresh expose
const refresh = async () => {
  return await loadItems()
}

defineExpose({ refresh })

const clear = () =>{
  selectedFilterColumn.value = ''
  selectedInclude.value = ''
  search.value = ''
}


async function excelExport() {
  const downloadUrl = `${props.excelEndpoint}`
  try {
    const response = await axios.post(downloadUrl, null, {
      responseType: 'blob',
    })

    const blob = response.data
    const contentDisposition = response.headers['content-disposition']

    const fileName = contentDisposition
      ? contentDisposition
        .split(';')
        .find(part => part.trim().startsWith('filename='))
        ?.split('=')[1]
        ?.replace(/"/g, '')
      : 'default-filename.xlsx'

    const link = document.createElement('a')

    link.href = window.URL.createObjectURL(blob)
    link.download = fileName

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)


  } catch (error) {

  }
}
</script>
