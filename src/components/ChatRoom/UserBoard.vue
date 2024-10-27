<template>
  <!-- <div class="card d-flex p-0 flex-column h-100">
      <div class="card-header p-0 d-flex flex-row justify-content-center">
        <img
          class="pic rounded-circle border-1 p-1"
          :src="nowUserinfo.picturesPath"
        />
        <strong
          class="name col-0 text-truncate d-none d-md-block align-self-center"
          >{{ nowUserinfo.userName }}</strong
        >
      </div>
      <div class="card-body p-0 overflow-auto flex-grow-1" :model="chatlist">
        <div
          class="useritem row g-0 border rounded-2 p-1"
          v-bind:class="{ active: user.userId === nowtalkid }"
          v-for="user in chatlist"
          @@click="talkselect(user.userId)"
        >
          <img
            class="item-pic col-12 col-md-3 img-thumbnail rounded-circle border-1 p-1"
            :src="user.imgPath"
          />

          <div
            class="item-center col-7 col-md-7 m-0 p-2 d-none d-md-block align-items-center"
          >
            <strong class="d-block text-truncate">{{ user.userName }}</strong>
            <small class="d-block text-truncate">{{ user.lastMesage }}</small>
          </div>

          <div
            class="otherinfo col-2 col-md-2 d-none d-md-block position-relative"
          >
            <span
              class="badge bg-primary rounded-pill position-absolute top-50 start-50 translate-middle noread"
              v-if="user.noReadCount > 0"
            >
              {{ user.noReadCount }}
            </span>
          </div>
        </div>
      </div>
      <div class="card-footer mt-auto">@* {{ connectionid }} *@</div>
    </div> -->
</template>

<script lang="ts">
// import { toRefs, ref } from 'vue'
// import { Delete, Edit, View, Refresh } from '@element-plus/icons-vue';
// import { ElMessageBox } from 'element-plus';

// const props = defineProps({
//     // 表格相关
//     nowUserinfo: {
//         type: Array,
//         default: []
//     },
//     rowKey: {
//         type: String,
//         default: 'id'
//     },
//     delFunc: {
//         type: Function,
//         default: () => { }
//     },
// })

// let {
//     tableData,
//     columns,
//     rowKey,
//     hasToolbar,
//     hasPagination,
//     total,
//     currentPage,
//     pageSize,
//     layout,
// } = toRefs(props)
</script>

<style scoped></style>
