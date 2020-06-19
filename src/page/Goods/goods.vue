<template>
  <div class="goods">
    <div class="nav">
      <div class="w">
        <!-- class="w" -->
        <!-- <a href="javascript:;" :class="{active:sortType===1}" @click="reset()">综合排序</a> -->
        <a href="javascript:;" :class="{active:sortType===1}" @click="reset()">销量排序</a>
        <a href="javascript:;" @click="sortByPrice(3)" :class="{active:sortType===3}">价格从低到高</a>
        <a href="javascript:;" @click="sortByPrice(4)" :class="{active:sortType===4}">价格从高到低</a>
        <div class="price-interval">
          <input type="number" class="input" placeholder="价格" v-model="startPrice" />
          <span style="margin: 0 5px">-</span>
          <input type="number" placeholder="价格" v-model="endPrice" />
          <y-button
            text="确定"
            classStyle="main-btn"
            @btnClick="sectionSort()"
            style="margin-left: 10px;"
          ></y-button>
        </div>
      </div>
    </div>

    <div v-loading="loading" element-loading-text="加载中..." style="min-height: 35vw;">
      <div  v-if="!noResult">
        <!--商品-->
        <div class="goods-box">
          <el-row style="width:100%">
            <mall-goods v-for="(item,i) in goodslist" :key="i" :msg="item"></mall-goods>
          </el-row>
        </div>

        <el-pagination
          v-if="!noResult&&!error"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <div class="no-info" v-if="noResult">
        <div class="no-data">
          <img src="../../../static/images/no-search.png" />
          <br />抱歉！暂时还没有商品
        </div>
        <!-- <section class="section">
          <y-shelf :title="recommendPanel.name">
            <div slot="content" class="recommend">
              <mall-goods :msg="item" v-for="(item,i) in recommendPanel.panelContents" :key="i"></mall-goods>
            </div>
          </y-shelf>
        </section>-->
      </div>
      <div class="no-info" v-if="error">
        <div class="no-data">
          <img src="../../../static/images/error.png" />
          <br />抱歉！出错了...
        </div>
        <!-- <section class="section">
          <y-shelf :title="recommendPanel.name">
            <div slot="content" class="recommend">
              <mall-goods :msg="item" v-for="(item,i) in recommendPanel.panelContents" :key="i"></mall-goods>
            </div>
          </y-shelf>
        </section>-->
      </div>
    </div>
  </div>
</template>
<script>
import { getAllGoods, selectGoodsList } from "/api/goods.js";
import { recommend } from "/api/index.js";
import { getStore, isNotBlank, filterObj } from "/utils/storage";
import mallGoods from "/components/mallGoods";
import YButton from "/components/YButton";
import YShelf from "/components/shelf";

export default {
  data() {
    return {
      goods: [],
      goodslist: [],
      noResult: false,
      error: false,
      min: "",
      max: "",
      loading: true,
      timer: null,
      sortType: 1,
      windowHeight: null,
      windowWidth: null,
      recommendPanel: [],
      sort: "",
      currentPage: 1,
      total: 0,
      pageSize: 20,
      isSort: 0,
      startPrice: "",
      endPrice: ""
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      let params = {
        current: this.currentPage,
        pageSize: this.pageSize,
        isSort: this.sort,
        brand: isNotBlank(this.$route.query.id) ? this.$route.query.id : ""
      };
      this._getAllGoods(params);
      this.loading = true;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      let params = {
        current: this.currentPage,
        pageSize: this.pageSize,
        isSort: this.sort,
        brand: isNotBlank(this.$route.query.id) ? this.$route.query.id : ""
      };
      this._getAllGoods(params);
      this.loading = true;
    },
    _getAllGoods(params, callback) {
      return selectGoodsList(params).then(res => {
        if (res.success == 1) {
          this.goodslist =
            isNotBlank(res.data.list) && res.data.list.length > 0
              ? res.data.list
              : "";
          this.total =
            isNotBlank(res.data.pagination) &&
            isNotBlank(res.data.pagination.total)
              ? res.data.pagination.total
              : "";
          this.noResult = false;
          if (this.total === 0) {
            this.noResult = true;
          }
          this.error = false;
        } else {
          this.error = true;
        }
        this.loading = false;
        if (callback) callback();
      });
    },
    // 默认排序
    reset() {
      this.sortType = 1;
      this.sort = 2;
      this.currentPage = 1;
      this.loading = true;

      const goodsId =
        isNotBlank(this.$route) &&
        isNotBlank(this.$route.query) &&
        isNotBlank(this.$route.query)
          ? this.$route.query.id
          : "";

      let params = {
        current: this.currentPage,
        pageSize: this.pageSize,
        isSort: this.sort,
        brand: goodsId
      };
      this._getAllGoods(params);
    },
    // 价格排序
    sortByPrice(v) {
      this.sortType = v;
      this.sort = v;
      this.currentPage = 1;
      this.loading = true;
      const goodsId =
        isNotBlank(this.$route) &&
        isNotBlank(this.$route.query) &&
        isNotBlank(this.$route.query)
          ? this.$route.query.id
          : "";
      let params = {
        current: this.currentPage,
        pageSize: this.pageSize,
        isSort: this.sort,
        brand: goodsId
      };
      params = filterObj(params);
      this._getAllGoods(params);
    },
    sectionSort() {
      // if (!isNotBlank(this.startPrice) || !isNotBlank(this.endPrice)) {
      //   this.$message({
      //     message: "请输入起止价格",
      //     type: "warning"
      //   });
      //   return;
      // }
      const goodsId =
        isNotBlank(this.$route) &&
        isNotBlank(this.$route.query) &&
        isNotBlank(this.$route.query)
          ? this.$route.query.id
          : "";
      let params = {
        current: this.currentPage,
        pageSize: this.pageSize,
        brand: goodsId,
        startPrice: this.startPrice,
        endPrice: this.endPrice
      };
      params = filterObj(params);
      this._getAllGoods(params, () => {
        this.$message({ message: "查询成功", type: "success" });
      });
    }
  },
  watch: {
    $route(to, from) {
      
      this.sortType = 1;
      this.sort = 2;
      this.currentPage = 1;
      this.loading = true;
      const goodsId =
        isNotBlank(this.$route) &&
        isNotBlank(this.$route.query) &&
        isNotBlank(this.$route.query.id)
          ? this.$route.query.id
          : "";
      let params = {
        current: this.currentPage,
        pageSize: this.pageSize,
        sort: this.sort,
        brand: goodsId
      };
      params = filterObj(params);
      this._getAllGoods(params);
      // }
    }
  },
  created() {},
  mounted() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    const goodsId =
      isNotBlank(this.$route) &&
      isNotBlank(this.$route.query) &&
      isNotBlank(this.$route.query.id)
        ? this.$route.query.id
        : "";
    let params = {
      current: 1,
      pageSize: 20,
      sort: 2,
      brand: goodsId
    };
    this._getAllGoods(params);
  },
  components: {
    mallGoods,
    YButton,
    YShelf
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/mixin";
@import "../../assets/style/theme";

.nav {
  height: 60px;
  line-height: 60px;
  > div {
    display: flex;
    align-items: center;
    a {
      padding: 0 15px;
      height: 100%;
      @extend %block-center;
      font-size: 12px;
      color: #999;
      &.active {
        color: #5683ea;
      }
      &:hover {
        color: #5683ea;
      }
    }
    input {
      @include wh(80px, 30px);
      border: 1px solid #ccc;
    }
    input + input {
      margin-left: 10px;
    }
  }
  .price-interval {
    padding: 0 15px;
    @extend %block-center;
    input[type="number"] {
      border: 1px solid #ccc;
      text-align: center;
      background: none;
      border-radius: 5px;
    }
  }
  .w {
    width: 1220px;
    margin: 0 auto;
  }
}

.goods-box {
  > div {
    float: left;
    border: 1px solid #efefef;
  }
}

.no-info {
  padding: 100px 0;
  text-align: center;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  .no-data {
    align-self: center;
  }
}

.img-item {
  display: flex;
  // flex-direction: column;
}

.el-pagination {
  align-self: flex-end;
  margin: 3vw 10vw 2vw;
}

.section {
  padding-top: 8vw;
  margin-bottom: -5vw;
  width: 1218px;
  align-self: center;
}

.recommend {
  display: flex;
  > div {
    flex: 1;
    width: 25%;
  }
}
</style>
