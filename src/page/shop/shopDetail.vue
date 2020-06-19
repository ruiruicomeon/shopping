<template>
  <div class="main">
    <!-- header -->
    <y-header>
      <div slot="nav">
        <div class="nav-sub" :class="{fixed:st}">
          <div class="nav-sub-wrapper" :class="{fixed:st}">
            <div class="w">
              <ul class="nav-list2">
                <li>
                  <router-link to="/">
                    <a @click="changGoods(-1)" :class="{active:choosePage===-1}">首页</a>
                  </router-link>
                </li>
                <li>
                  <a @click="changGoods(-2)" :class="{active:choosePage===-2}">全部</a>
                </li>
                <li v-for="(item,i) in navList" :key="i">
                  <a @click="changGoods(i, item)" :class="{active:i===choosePage}">{{item.name}}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </y-header>
    <!-- 头部 -->
    <div class="contentbox" :class="{fiexd:st}">
      <div class="content">
        <div class="indextitle">
          <div class="indextitleFirst">
            <img
              :src="showimg(shopDateInfo.photo ? shopDateInfo.photo : '' )"
              v-if="shopDateInfo.photo"
            />
            <img v-else src="../../../static/images/mallLogo.jpg" />
            <h1>{{shopDateInfo.name ? shopDateInfo.name : '' }}</h1>
          </div>
          <div class="indextitleSecond">
            <el-input
              class="el-autocomplete"
              placeholder="搜索本店商品"
              icon="search"
              v-model="searchName"
            >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <!-- 主图 -->
    <div class="contentbox1">
      <div class="detailbox">
        <img v-lazy="showimg(shopDateInfo.photo)" v-if="haveimg" :key="shopDateInfo.photo" />
        <img v-if="!haveimg" src="../../../static/images/car.jpg" />
      </div>
    </div>

    <!-- 无商品样式 -->
    <div class="no-info" v-if="noResult">
      <div class="no-data">
        <img src="../../../static/images/no-search.png" />
        <br />抱歉！暂时还没有商品
      </div>
    </div>

    <!-- 商品展示 -->
    <div
      class="contentbox"
      v-loading="loading"
      element-loading-text="加载中..."
      style="min-height: 15vw;"
    >
      <div class="content">
        <section class="section">
          <div slot="content" class="recommend">
            <el-row style="width:100%">
              <mall-goods :msg="item" v-for="(item,i) in goodslist" :key="i"></mall-goods>
            </el-row>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
import YButton from "/components/YButton";
import YHeader from "/common/header";
import mallGoods from "/components/mallGoods";
import { findGoodsTypeList } from "/api/index";
import { addCart, getStoreList, selectGoodsList } from "/api/goods.js";
import { mapMutations, mapState } from "vuex";
import { getStore, getFullUrl, filterObj, isNotBlank } from "/utils/storage";
export default {
  name: "shopDetail",
  data() {
    return {
      shopDateInfo: {},
      goodslist: [],
      navList: [],
      shopId: "",
      searchName: "",
      noResult: false,
      haveimg: true,
      loading: false,
      brand: "",
      st: false,
      choosePage: -2
    };
  },
  methods: {
    ...mapMutations(["ADD_CART", "ADD_ANIMATION", "SHOW_CART"]),
    showimg(url) {
      return getFullUrl(url);
    },
    goodsDetails(id) {
      this.$router.push({ path: "goodsDetails/productId=" + id });
    },
    _getNavList() {
      findGoodsTypeList({ isSort: 0 }).then(res => {
        if (isNotBlank(res.data) && res.data.length > 0) {
          this.navList = res.data;
        }
      });
    },

    handleIconClick(ev) {
      this.loading = true;
      this._getAllGoods();
    },

    _getShopDetail() {
      let params = {
        id: this.shopId
      };
      getStoreList(params).then(response => {
        if (
          response.data &&
          response.data.list &&
          (response.success === 1 || response.success === "1")
        ) {
          const shopObj = response.data.list[0];
          if (!isNotBlank(shopObj.photo)) {
            this.haveimg = false;
          }
          this.shopDateInfo = shopObj;
        } else {
          this.$message({
            type: "warning",
            message: "抱歉！请求出错"
          });
        }
      });
    },
    _getAllGoods() {
      let params = {
        storeId: this.shopId,
        searchName: this.searchName,
        brand: this.brand
      };
      params = filterObj(params);
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
        }
        this.loading = false;
      });
    },

    changGoods(v, item) {
      this.choosePage = v;
      this.brand = isNotBlank(item) && isNotBlank(item.id) ? item.id : "";
      if (v === -1) {
        this.$router.push({
          path: "/"
        });
      } else {
        this.loading = true;
        this._getAllGoods();
      }
    },

    // 控制顶部
    navFixed() {
      var st = document.documentElement.scrollTop || document.body.scrollTop;
      st > 100 ? (this.st = true) : (this.st = false);
    }
  },
  computed: {
    ...mapState(["login", "showMoveImg", "showCart"])
  },
  mounted() {
    const shopId = this.$route.query.id;
    this.shopId = shopId;
    this._getShopDetail(); // 查询店铺详情
    this._getAllGoods(); // 获取店铺商品
    this._getNavList(); //获取导航菜单
    window.addEventListener("scroll", this.navFixed);
    window.addEventListener("resize", this.navFixed);
  },
  components: {
    YButton,
    YHeader,
    mallGoods
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/mixin";
@import "../../assets/style/theme";

.main {
  width: 100%;
  height: 2000px;
  position: relative;
  .contentbox1 {
    width: 100%;
    .detailbox {
      width: 1220px;
      height: 280px;
      margin: 0 auto;
      img {
        @include wh(100%, 280px);
        display: block;
        margin: 0 auto;
        &:hover {
          box-shadow: 1px 1px 20px #999;
        }
      }
    }
  }

  .contentbox {
    width: 100%;

    &.fiexd {
      position: fixed;
      z-index: 30;
      top: 60px;
      left: auto;
      right: auto;
    }
    .content {
      width: 1220px;
      height: auto;
      margin: 0 auto;
      .indextitle {
        width: 1220px;
        padding: 20px;
        box-sizing: border-box;
        margin: 8px 0;
        background: #1a1a1a;
        color: #fff;
        display: flex;
        align-items: center;
        position: relative;
        border-radius: 10px;
        &:hover {
          transition: all 0.5s;
          transform: translateY(-3px);
          box-shadow: 1px 1px 20px #999;
        }

        .indextitleFirst {
          display: flex;
          align-items: center;
          > img {
            @include wh(30px);
            margin-left: 12px;
          }
          > h1,
          h3 {
            font-size: 30px;
            font-weight: 800;
            padding-left: 12px;
          }
        }
        .indextitleSecond {
          position: absolute;
          left: 50%;
          .el-autocomplete {
            width: 300px;
          }
        }
      }

      .recommend {
        display: flex;
        padding: 20px;
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

  .shops-item {
    background: #fff;
    width: 25%;
    transition: all 0.5s;
    height: 430px;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 1px 1px 20px #999;
      .good-price p {
        display: none;
      }
      .ds {
        display: flex;
      }
    }
  }
}

// 导航栏
.nav-sub {
  position: relative;
  z-index: 20;
  height: 90px;
  background: #f7f7f7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  &.fixed {
    position: fixed;
    z-index: 21;
    height: 60px;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid #dadada;
    background-image: -webkit-linear-gradient(#fff, #f1f1f1);
    background-image: linear-gradient(#fff, #f1f1f1);
  }
  .nav-sub-wrapper {
    padding: 31px 0;
    height: 90px;
    position: relative;
    &.fixed {
      padding: 0;
      height: 100%;
      display: flex;
      align-items: center;
    }
    &:after {
      content: " ";
      position: absolute;
      top: 89px;
      left: 50%;
      margin-left: -610px;
      width: 1220px;
      background: #000;
      height: 1px;
      display: none;
      opacity: 0;
      -webkit-transition: opacity 0.3s ease-in;
      transition: opacity 0.3s ease-in;
    }
  }
  .w {
    display: flex;
    justify-content: space-between;
  }
  .nav-list2 {
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
</style>
