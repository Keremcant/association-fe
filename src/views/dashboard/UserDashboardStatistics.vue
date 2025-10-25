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

const { t } = useI18n()

const statistics = [
  {
    key: 'sales',
    titleKey: 'Number of Institutions',
    stats: '2',
    icon: 'tabler-chart-pie-2',
    color: 'primary',
  },
  {
    key: 'customers',
    titleKey: 'Total Number of Views',
    stats: '451',
    icon: 'tabler-users',
    color: 'info',
  },
  {
    key: 'products',
    titleKey: 'Total Job Postings',
    stats: '47',
    icon: 'tabler-shopping-cart',
    color: 'error',
  },
  {
    key: 'revenue',
    titleKey: 'Total Number of Resumes',
    stats: '12',
    icon: 'tabler-currency-dollar',
    color: 'success',
  },
]
</script>
