<template>
  <div>
    <y-shelf title="我的询价">
      <div slot="content">
        <div style="padding: 100px 0;text-align: center">
          <img src="../../../../static/images/no-search.png">
          <br>
          <span class="no-discount">该功能正在开发</span>
        </div>
      </div>
    </y-shelf>
  </div>
</template>
<script>
  import YShelf from '/components/shelf'
  export default {
    components: {
      YShelf
    }
  }
</script>
<style lang="scss" scoped>
  .no-discount {
    line-height: 2em;
    font-size: 22px;
    color: #999;
  }
</style>
