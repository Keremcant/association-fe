<template>
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
        return $emit('rowClick', item.item.raw.uuid, item.item.raw)
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
  </VDataTableServer>
</template>

<script setup>
import { ref } from 'vue'
import axios from "@/plugins/axios"

const props = defineProps({
  headers: Array,
  endpoint: String,
  method: String,
  payload: Object,
})

defineEmits(['rowClick'])

const loading = ref(false)
const itemsPerPage = ref(10)
const search = ref()
const pageNumber = ref(1)
const serverItems = ref([])
const totalItems = ref(0)


const refresh = async () => {

  const response = await loadItems()

  if(response.status >= 200 && response.status < 300){

    snackbar.value.show('registrationsSuccessfullyRenewed', 'success')
  }

  return response
}

defineExpose(
  {
    refresh,
  },
)

const itemsPerPageOptions = ref([
  { value: 5, title: '5' },
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 50, title: '50' },
  { value: 100, title: '100' },
])



const filter = computed(()=>{return {
  filters: props.payload,
  pageSize: itemsPerPage.value,
  pageNumber: pageNumber.value - 1,
}})

watch(() => props.payload, async () => {
  await loadItems()
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function loadItems(){
  loading.value = true


  if(props.method==='GET'){
    const response = await axios.get(props.endpoint)

    if(response.status >= 200 && response.status < 300){
      serverItems.value = response.data
      totalItems.value = response.data.length

      loading.value = false
    }else{
      snackbar.value.show('anErrorOccurredPleaseTryAgainLater', 'error')
      loading.value = false
    }

    return response
  }
  else{
    const response = await axios.post(props.endpoint, filter.value)

    if(response.status >= 200 && response.status < 300){
      serverItems.value = response.data.data
      totalItems.value = response.data.totalElements
      loading.value = false
    }else{
      snackbar.value.show('anErrorOccurredPleaseTryAgainLater', 'error')
      loading.value = false
    }

    return response
  }

  //await sleep(5000)


  
}
</script>
