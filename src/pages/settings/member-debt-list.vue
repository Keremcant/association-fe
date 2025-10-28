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
        :headers="headers"
        :items="debts"
      />
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

const { t } = useI18n()
const uploadDialog = ref(false)
const debts = ref([])

function refreshDebts(newDebts) {
  debts.value = newDebts
}

const headers = computed(() => [
  { title: t('Phone'), key: 'phone', sortable: true },
  { title: t('Debt Amount'), key: 'amount', sortable: true },
  { title: t('Upload Date'), key: 'uploadedAt', sortable: true },
  { title: t('Uploaded By'), key: 'uploadedBy', sortable: false },
])
</script>
