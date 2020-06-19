<template>
  <div class="goods">
    <div class="nav-subs">
      <div class="nav-sub-bgs"></div>
      <div class="nav-sub-wrappers">
        <div class="w">
          <ul class="nav-lists">
            <li>
              <router-link to="/">
                <a>首页</a>
              </router-link>
            </li>
            <li>
              <a class="active">搜索结果</a>
            </li>
            <li>
              <a v-if="searching === true">拼命搜索中...</a>
              <a v-if="searching === false">共为您找到 {{total}} 款商品信息</a>
            </li>
          </ul>
          <div></div>
        </div>
      </div>
    </div>

    <div class="nav">
      <div class="w" v-if="isShowSort">
        <a href="javascript:;" :class="{active:sortType===1}" @click="reset()">综合排序</a>
        <a href="javascript:;" @click="sortByPrice(3)" :class="{active:sortType===3}">价格从低到高</a>
        <a href="javascript:;" @click="sortByPrice(4)" :class="{active:sortType===4}">价格从高到低</a>
        <div class="price-interval">
          <input type="number" class="input" placeholder="价格" v-model="startPrice" />
          <span style="margin: 0 5px">-</span>
          <input type="number" placeholder="价格" v-model="endPrice" />
          <y-button text="确定" classStyle="main-btn" @btnClick="reset" style="margin-left: 10px;"></y-button>
        </div>
      </div>
    </div>

    <div v-loading="loading" element-loading-text="加载中..." style="min-height: 35vw;">
      <!--商品-->
      <div class="img-item" v-if="!noResult&&goods.length>0">
        <div class="goods-box w">
          <el-row style="width:100%">
            <mall-goods v-for="(item,i) in goods" :key="i" :msg="item"></mall-goods>
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
      <!-- 商铺 -->

      <div class="img-item" v-if="!noResult&&shopslist.length>0">
        <el-row style="width:100%">
          <mall-shops v-for="(item,i) in shopslist" :key="i" :msg="item"></mall-shops>
        </el-row>
        <el-pagination
          v-if="!noResult&&!error&&shopslist.length>0"
          @size-change="handleSizeChangeShop"
          @current-change="handleCurrentChangeShop"
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
          <br />抱歉！没有为您找到相关的商品
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
import { getSearch, selectGoodsList, getStoreList } from "/api/goods.js";
import { recommend } from "/api/index.js";
import { filterObj, isNotBlank } from "/utils/storage";
import mallGoods from "/components/mallGoods";
import mallShops from "/components/mallShops";
import YButton from "/components/YButton";
import YShelf from "/components/shelf";
import YHeader from "/common/header";
import YFooter from "/common/footer";
export default {
  data() {
    return {
      goods: [],
      shopslist: [],
      noResult: false,
      error: false,
      loading: true,
      searching: true,
      sortType: 1,
      sort: "",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchName: "",
      startPrice: "",
      endPrice: "",
      isShowSort: true
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.loading = true;
      this._getSearch();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.loading = true;
      this._getSearch();
    },

    handleSizeChangeShop(val) {
      this.pageSize = val;
      this.loading = true;
      this._getSearchShop();
    },
    handleCurrentChangeShop(val) {
      this.currentPage = val;
      this.loading = true;
      this._getSearchShop();
    },

    _getSearch() {
      let params = {
        searchName: this.searchName,
        pageSize: this.pageSize,
        current: this.currentPage,
        isSort: this.sort,
        startPrice: this.startPrice,
        endPrice: this.endPrice
      };
      params = filterObj(params);
      selectGoodsList(params).then(res => {
        if (
          res.data &&
          res.data.list &&
          (res.success === 1 || res.success === "1")
        ) {
          this.goods = res.data.list;
          this.total = res.data.pagination.total;
          this.noResult = false;
          this.error = false;
        } else {
          this.$message({ type: "warning", message: "暂无数据" });
          this.noResult = true;
        }
        this.loading = false;
        this.searching = false;
      });
    },

    _getSearchShop() {
      let params = {
        name: this.searchName,
        pageSize: this.pageSize,
        current: this.currentPage
      };
      params = filterObj(params);
      getStoreList(params).then(res => {
        if (
          res.data &&
          res.data.list &&
          (res.success === 1 || res.success === "1")
        ) {
          this.shopslist = res.data.list;
          this.total = res.data.pagination.total;
          this.noResult = false;
          this.error = false;
        } else {
          this.$message({ type: "warning", message: "暂无数据" });
          this.noResult = true;
        }
        this.loading = false;
        this.searching = false;
      });
    },

    // 默认排序
    reset() {
      this.sort = "";
      this.currentPage = 1;
      this.loading = true;
      this.searching = true;
      this.sortType = 1;
      this._getSearch();
    },
    // 价格排序
    sortByPrice(v) {
      this.sortType = v;
      this.sort = v;
      this.currentPage = 1;
      this.loading = true;
      this.searching = true;
      this._getSearch();
    }
  },
  watch: {
    $route(newval) {
      this.searchName = newval.query.key;
      this.searchType = newval.query.searchType;
      if (newval.query.searchType == "name") {
        this.goods = [];
        this.isShowSort = false;
        this.loading = true;
        this.searching = true;
        this._getSearchShop();
      } else if (newval.query.searchType == "searchName") {
        this.shopslist = [];
        this.isShowSort = true;
        this.loading = true;
        this.searching = true;
        this._getSearch();
      }
    }
  },

  created() {},
  mounted() {
    const searchType = this.$route.query.searchType;
    this.searchType = searchType;
    this.searchName = this.$route.query.key;
    if (searchType == "name") {
      this.loading = true;
      this.searching = true;
      this.isShowSort = false;
      this._getSearchShop();
    } else if (searchType == "searchName") {
      this.loading = true;
      this.searching = true;
      this.isShowSort = true;
      this._getSearch();
    }
  },
  components: {
    mallGoods,
    mallShops,
    YButton,
    YShelf,
    YHeader,
    YFooter
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
}

.goods-box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 10px 20px;
  > div {
    float: left;
    border: 1px solid #efefef;
  }
}

.nav-subs {
  position: relative;
  margin-top: -40px;
  z-index: 20;
  height: 90px;
  background: #f7f7f7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  .nav-sub-wrappers {
    padding: 31px 0;
    height: 90px;
    position: relative;
  }
  .w {
    display: flex;
    justify-content: space-between;
  }
  .nav-lists {
    height: 28px;
    line-height: 28px;
    display: flex;
    align-items: center;
    height: 100%;
    li:first-child {
      padding-left: 0;
      a {
        padding-left: 10px;
      }
    }
    li {
      position: relative;
      float: left;
      padding-left: 2px;
      a {
        display: block;
        // cursor: default;
        padding: 0 10px;
        color: #666;
        &.active {
          font-weight: bold;
        }
      }
      a:hover {
        color: #5683ea;
      }
    }
    li:before {
      content: " ";
      position: absolute;
      left: 0;
      top: 13px;
      width: 2px;
      height: 2px;
      background: #bdbdbd;
    }
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

.section {
  padding-top: 8vw;
  margin-bottom: -5vw;
  width: 1218px;
  align-self: center;
}

@media (min-width: 1px) {
  .nav-subs .nav-sub-wrappers:after {
    display: block;
  }
}

.recommend {
  display: flex;
  > div {
    flex: 1;
    width: 25%;
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
</style>
