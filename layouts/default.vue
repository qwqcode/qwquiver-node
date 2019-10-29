<template>
  <div>
    <TopHeader />

    <div class="wrap">
      <Sidebar />

      <div class="main-content-area">
        <nuxt class="content-inner" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import TopHeader from '../components/TopHeader.vue'
import Sidebar from '../components/Sidebar.vue'

@Component({
  components: { TopHeader, Sidebar }
})
export default class Default extends Vue {

}
</script>

<style>
html {
}
</style>
