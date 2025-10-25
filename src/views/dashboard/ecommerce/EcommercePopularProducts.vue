<script setup>
import amazonEchoDot from '@images/eCommerce/amazon-echo-dot.png'
import appleWatch from '@images/eCommerce/apple-watch.png'
import headphone from '@images/eCommerce/headphone.png'
import iphone from '@images/eCommerce/iphone.png'
import nike from '@images/eCommerce/nike.png'
import sonyDualsense from '@images/eCommerce/sony-dualsense.png'

const popularProducts = [
  {
    avatarImg: iphone,
    title: 'Bakım Merkezleri Açılışı',
    subtitle: '1. Sırada',
    stats: '450',
  },
  {
    avatarImg: nike,
    title: 'Hastahanede Yatan Hastanın Ücretinin Ödenmesi',
    subtitle: '2. Sırada',
    stats: '350',
  },
  {
    avatarImg: headphone,
    title: 'Teşvik Ödenmesi',
    subtitle: '3. Sırada',
    stats: '300',
  },
  {
    avatarImg: appleWatch,
    title: 'Vasilik Durumu',
    subtitle: '4. Sırada',
    stats: '100',
  },
  {
    avatarImg: amazonEchoDot,
    title: 'Bakıcı Personel',
    subtitle: '5. Sırada',
    stats: '50',
  },
  {
    avatarImg: sonyDualsense,
    title: 'Hastahanede Bakım Ücreti',
    subtitle: '6. Sırada',
    stats: '12',
  },
]

const moreList = [
  {
    title: 'Refresh',
    value: 'refresh',
  },
  {
    title: 'Download',
    value: 'Download',
  },
  {
    title: 'View All',
    value: 'View All',
  },
]
</script>

<template>
  <VCard
    title="Bakanlık Görüşleri"
    subtitle="En Popüler Görüşler"
  >
    <template #append>
      <div class="mt-n4 me-n2">
        <MoreBtn
          size="small"
          :menu-list="moreList"
        />
      </div>
    </template>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="product in popularProducts"
          :key="product.title"
        >
          <template #prepend>
            <VAvatar
              size="46"
              rounded
              class="me-1"
              :image="product.avatarImg"
            />
          </template>

          <VListItemTitle class="font-weight-medium me-4">
            {{ product.title }}
          </VListItemTitle>
          <VListItemSubtitle class="me-4">
            {{ product.subtitle }}
          </VListItemSubtitle>

          <template #append>
            <div class="d-flex align-center">
              <span class="text-body-1">{{ product.stats }}</span>
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.25rem;
}
</style>
