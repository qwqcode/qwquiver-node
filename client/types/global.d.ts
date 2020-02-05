import Default from '@/layouts/default.vue'
import NotifyLayer from '@/components/layers/NotifyLayer.vue'
import TopHeader from '@/components/TopHeader.vue'
import Sidebar from '@/components/Sidebar.vue'
import SearchLayer from '@/components/layers/SearchLayer.vue'
import ScoreTable from '@/components/ScoreTable.vue'

declare module 'vue/types/vue' {
  interface Vue {
    $app: Default
    $notify: NotifyLayer
    $topHeader: TopHeader
    $sidebar: Sidebar
    $searchLayer: SearchLayer
    $scoreTable: ScoreTable
  }
}
