<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('Ministry Opinions') }}</VCardTitle>
      <template #append>
        <VBtn
          icon="tabler-refresh"
          size="small"
          @click="refresh"
        />
      </template>
    </VCardItem>

    <VDivider />

    <VCardItem>
      <DataTable
        ref="datatable"
        :headers="headers"
        endpoint="/ministryopinions/get-all-by-filter"
        :payload="payload"
      >
        <template #actions="{ item }">
          <VBtn
            icon="tabler-eye"
            variant="text"
            @click="showCv(item.item.uuid)"
          />
        </template>
      </DataTable>
    </VCardItem>

    <VDialog
      v-model="updateDialog"
      scrollable
      max-width="1200px"
      transition="dialog-transition"
    >
      <DialogCloseBtn @click="updateDialog = false" />
      <VCard>
        <MinistryOpinionsShow
          :uuid="selectedUUID"
          @close="updateDialog = false"
        />
      </VCard>
    </VDialog>
  </VCard>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import MinistryOpinionsShow from '@/components/ministry-opinions/MinistryOpinionsShow.vue'
import DataTable from "@/components/datatable/DataTable.vue"

const { t } = useI18n()

const updateDialog = ref(false)
const selectedUUID = ref()
const payload = ref([])
const datatable = ref()


async function refresh() {
  await datatable.value.refresh()
}

function showCv(item) {
  selectedUUID.value = item

  updateDialog.value = true
}

const headers = computed(() => [
  { title: t('Title'), key: 'title' },
  { title: t('Tags'), key: 'tagsAsString' },
  { title: t('Decision Date'), key: 'decisionDate', value: item => item.decisionDate ? item.decisionDate.split('T')[0] : '' },
  { title: t('Actions'), key: 'actions', sortable: false },
])
</script>
