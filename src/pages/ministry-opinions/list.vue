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
      <VDataTable
        :headers="headers"
        :items="tableData"
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <VBtn
            icon="tabler-eye"
            variant="text"
            @click="showCv(item)"
          />
        </template>
      </VDataTable>
    </VCardItem>

    <VDialog
      v-model="updateDialog"
      scrollable
      max-width="1200px"
      transition="dialog-transition"
    >
      <DialogCloseBtn @click="updateDialog = false" />
      <VCard v-if="showCvData">
        <UserForm
          :form-data="showCvData"
          @close="updateDialog = false"
        />
      </VCard>
    </VDialog>
  </VCard>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import UserForm from '@/components/ministry-opinions/UserForm.vue'

const { t } = useI18n()

const updateDialog = ref(false)
const showCvData = ref(null)

const tableData = ref([
  {
    title: 'Software Engineer Approval',
    tags: 'Engineering, IT',
    decisionDate: '2025-10-20',
    pdfUrl: '/pdfs/test1.pdf',
  },
  {
    title: 'Design Review',
    tags: 'Architecture',
    decisionDate: '2025-10-22',
    pdfUrl: '/pdfs/test2.pdf',
  },
])

async function refresh() {
  isLoading.value = true
  await datatable.value.refresh()
  isLoading.value = false
}

function showCv(item) {
  showCvData.value = { ...item }
  updateDialog.value = true
}

const headers = computed(() => [
  { title: t('Title'), key: 'title' },
  { title: t('Tags'), key: 'tags' },
  { title: t('Decision Date'), key: 'decisionDate' },
  { title: t('Actions'), key: 'actions', sortable: false },
])
</script>
