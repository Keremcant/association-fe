<template>
  <VCard min-height="600px">
    <VCardItem>
      <VCardTitle>{{ $t('Cv List') }}</VCardTitle>
      <template #append>
        <VBtn
          icon="tabler-refresh"
          size="small"
          @click="refresh"
        />
      </template>
    </VCardItem>

    <VCardText>
      <VDataTable
        :headers="headers"
        :items="tableData"
        :loading="loading"
        item-value="uuid"
      >
        <template #item.actions="{ item }">
          <IconBtn @click="() => showCv(item.uuid)">
            <VIcon icon="tabler-eye" />
            <VTooltip
              activator="parent"
              location="top"
            >
              {{ $t('Show Cv') }}
            </VTooltip>
          </IconBtn>
        </template>
      </VDataTable>
    </VCardText>

    <VDialog
      v-model="updateDialog"
      scrollable
      :overlay="false"
      transition="dialog-transition"
      max-width="1200px"
    >
      <DialogCloseBtn @click="updateDialog = false" />
      <VCard>
        <CvListForm
          v-if="showCvData"
          :form-data="showCvData"
          readonly
          @close="updateDialog = false"
        />
      </VCard>
    </VDialog>
  </VCard>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CvListForm from '@/components/cv-list/CvListForm.vue'

const { t } = useI18n()

const loading = ref(false)
const updateDialog = ref(false)
const showCvData = ref(null)

const headers = [
  { title: t('Name Surname'), key: 'firstName' },
  { title: t('Email'), key: 'email' },
  { title: t('Phone'), key: 'phone' },
  { title: t('City'), key: 'city' },
  { title: t('Title'), key: 'title' },
  { title: t('Actions'), key: 'actions', sortable: false },
]


const tableData = ref([
  {
    uuid: '1',
    firstName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 555 123 4567',
    city: 'New York',
    title: 'Software Engineer',
  },
  {
    uuid: '2',
    firstName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+44 7700 900123',
    city: 'London',
    title: 'Data Analyst',
  },
])

function refresh() {}

function showCv(id) {
  const selected = tableData.value.find(item => item.uuid === id)

  showCvData.value = {
    ...selected,
    fullName: selected.firstName,
    gender: 'Female',
    birthDate: '1992-06-15',
    educationStatus: 'Bachelor',
    disabilityStatus: 'None',
    address: '123 Main St, New York',
    education: [
      { school: 'NYU', department: 'Computer Science', graduationYear: 2014 },
    ],
    work: [
      { company: 'TechCorp', position: 'Frontend Developer', years: '2015–2020' },
    ],
    certificates: [{ name: 'AWS Certified Developer', year: 2022 }],
    preface: 'Passionate software engineer with 8 years of experience.',
  }
  updateDialog.value = true
}
</script>
