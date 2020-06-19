<template>
  <div class="shops">
    <!-- <div class="nav">
      <div class="w">
        <a href="javascript:;" :class="{active:sortType===1}" @click="reset()">销量排序</a>
        <a href="javascript:;" @click="sortByPrice(1)" :class="{active:sortType===2}">价格从低到高</a>
        <a href="javascript:;" @click="sortByPrice(-1)" :class="{active:sortType===3}">价格从高到低</a>
        <div class="price-interval">
          <input type="number" class="input" placeholder="价格" v-model="min" />
          <span style="margin: 0 5px">-</span>
          <input type="number" placeholder="价格" v-model="max" />
          <y-button text="确定" classStyle="main-btn" @btnClick="reset" style="margin-left: 10px;"></y-button>
        </div>
      </div>
    </div>-->
    <y-header>
      <div slot="nav"></div>
    </y-header>
    <div v-loading="loading" element-loading-text="加载中..." style="min-height: 35vw;">
      <div class="img-item" v-if="!noResult">
        <!--商品-->
        <div>
          <el-row style="width:100%">
            <mall-shops v-for="(item,i) in shopslist" :key="i" :msg="item"></mall-shops>
          </el-row>
        </div>

        <el-pagination
          v-if="!noResult&&!error"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <div class="no-info" v-if="noResult">
        <div class="no-data">
          <img src="../../../static/images/no-search.png" />
          <br />抱歉！暂时还没有商铺
        </div>
      </div>

      <div class="no-info" v-if="error">
        <div class="no-data">
          <img src="../../../static/images/error.png" />
          <br />抱歉！出错了...
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAllGoods, getStoreList } from "/api/goods.js";
import { recommend } from "/api/index.js";
import { getStore, isNotBlank } from "/utils/storage";
import mallShops from "/components/mallShops";
import YHeader from "/common/header";
import YButton from "/components/YButton";
import YShelf from "/components/shelf";
export default {
  data() {
    return {
      shopslist: [],
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
      pageSize: 20
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this._getAllGoods();
      this.loading = true;
    },
    getPrice(val) {
      this.currentPage = val;
      this._getAllGoods();
      this.loading = true;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this._getAllGoods();
      this.loading = true;
    },
    _getAllGoods() {
      // let cid = this.$route.query.cid;
      // if (this.min !== "") {
      //   this.min = Math.floor(this.min);
      // }
      // if (this.max !== "") {
      //   this.max = Math.floor(this.max);
      // }
      let params = {
        pageSize: this.pageSize,
        current: this.currentPage
      };
      getStoreList(params).then(res => {
        if (res.success == 1) {
          this.shopslist =
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
      });
    },
    // 默认排序
    reset() {
      this.sortType = 1;
      this.sort = "";
      this.currentPage = 1;
      this.loading = true;
      this._getAllGoods();
    },
    // 价格排序
    sortByPrice(v) {
      v === 1 ? (this.sortType = 2) : (this.sortType = 3);
      this.sort = v;
      this.currentPage = 1;
      this.loading = true;
      this._getAllGoods();
    }
  },
  watch: {
    // $route(to, from) {
    //   if (to.fullPath.indexOf("/goods?cid=") >= 0) {
    //     this.cId = to.query.cid;
    //     this._getAllGoods();
    //   }
    // }
  },
  created() {},
  mounted() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    this._getAllGoods();
    // recommend().then(res => {
    //   let data = res.result;
    //   this.recommendPanel = data[0];
    // });
  },
  components: {
    mallShops,
    YButton,
    YShelf,
    YHeader
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
  flex-direction: column;
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
