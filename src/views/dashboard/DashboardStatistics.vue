<template>
  <VCard :title="t('Statistics')">
    <template #append>
      <span class="text-sm text-disabled">
        {{ t('Updated 1 Hour Ago') }}
      </span>
    </template>

    <VCardText>
      <VRow>
        <VCol
          v-for="item in statistics"
          :key="item.key"
          cols="6"
          md="3"
        >
          <div class="d-flex align-center gap-4 mt-md-9 mt-0">
            <VAvatar
              :color="item.color"
              variant="tonal"
              rounded
              size="40"
            >
              <VIcon :icon="item.icon" />
            </VAvatar>

            <div class="d-flex flex-column">
              <h5 class="text-h5">
                {{ item.stats }}
              </h5>
              <div class="text-sm">
                {{ t(item.titleKey) }}
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// 🔹 Dashboard verisini props'tan alıyoruz
const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const { t } = useI18n()

// 🔹 Veriyi dinamik olarak props üzerinden oluşturuyoruz
const statistics = computed(() => [
  {
    key: 'institutions',
    titleKey: 'Total Number of Institutions',
    stats: props.data?.totalInstitutionCount ?? 0,
    icon: 'tabler-building',
    color: 'primary',
  },
  {
    key: 'meetings',
    titleKey: 'Total Number of Views',
    stats: props.data?.totalMeetingCount ?? 0,
    icon: 'tabler-users',
    color: 'info',
  },
  {
    key: 'jobPostings',
    titleKey: 'Total Job Postings',
    stats: props.data?.totalJobPostingCount ?? 0,
    icon: 'tabler-briefcase',
    color: 'error',
  },
  {
    key: 'cvs',
    titleKey: 'Total Number of Resumes',
    stats: props.data?.totalCVCount ?? 0,
    icon: 'tabler-file-text',
    color: 'success',
  },
])
</script>
