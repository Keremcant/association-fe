<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('Member Debt List') }}</VCardTitle>
      <template #append>
        <VBtn
          color="primary"
          size="small"
          @click="uploadDialog = true"
        >
          {{ $t('Upload Excel') }}
        </VBtn>
      </template>
    </VCardItem>

    <VDivider />

    <VCardItem>
      <DataTable
        ref="datatable"
        :headers="headers"
        endpoint="/memberdebtlist/get-all-by-filter"
        :payload="payload"
      >
        <template #DateTime="{ item }">
          <VChip
            size="small"
            label
            class="text-capitalize"
          >
            {{ dateTime(item.item.creationDate) }}
          </VChip>
        </template>
      </DataTable>
    </VCardItem>

    <VDialog
      v-model="uploadDialog"
      scrollable
      max-width="600px"
      transition="dialog-transition"
    >
      <VCard>
        <VCardTitle>{{ $t('Upload Member Debt Excel') }}</VCardTitle>
        <VCardText>
          <MemberDebtListForm
            v-model:is-dialog-visible="uploadDialog"
            @saved="refreshDebts"
          />
        </VCardText>
      </VCard>
    </VDialog>

    <SnackBar ref="snackbar" />
  </VCard>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DataTable from '@/components/datatable/DataTable.vue'
import MemberDebtListForm from '@/components/settings/member-debt-list/MemberDebtListForm.vue'
import { DateTime } from "luxon"

const { t } = useI18n()
const uploadDialog = ref(false)
const debts = ref([])
const payload = ref([])

function refreshDebts(newDebts) {
  payload.value = newDebts
}

function dateTime(dateTimeMember) {
  
  return DateTime.fromISO(dateTimeMember)
    .setLocale('tr')
    .toLocaleString(DateTime)
}

const headers = computed(() => [
  { title: t('Phone'), key: 'phone', sortable: true },
  { title: t('Debt Amount'), key: 'amount', sortable: true },
  { title: t('Upload Date'), key: 'DateTime', sortable: true },
  { title: t('Uploaded By'), key: 'createdBy', sortable: false },
])
</script>
