<template>
  <div class="container">
    <div class="title">
      <div
        style="border-bottom:1px solid gray;padding-bottom: 11px;font-weight: 700;font-size: 16px;"
      >格式转换记录</div>
      <div class="return-style" @click="goback()">返回</div>
    </div>
    <div class="search">
      <a-input placeholder="请输入关键词搜索文件名称" v-model="searchContent" allow-clear />
      <a-button type="primary" @click="search()">搜索</a-button>
    </div>

    <div class="list">
      <a-table bordered :data-source="dataSource" :columns="columns" :pagination="pagination">
        <template slot="operation" slot-scope="text, record">
          <a-popconfirm
            v-if="dataSource.length"
            title="确定要删除本条记录吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="() => onDelete(record)"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import { baseHref } from "../utils/api.js";
import moment from "moment";
export default {
  data() {
    return {
      dataSource: [],
      orgDataSource: [],
      searchContent: "",
      pagination: {
        total: 0,
        pageSize: 5, //每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` //分页中显示总的数据
      },
      columns: [
        {
          title: "序号",
          // render: (text, record, index) => `${index + 1}`
          dataIndex: "id",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "创建时间",
          dataIndex: "createTime"
        },
        {
          title: "源文件",
          dataIndex: "srcFileName"
        },
        {
          title: "目标文件",
          dataIndex: "dstFileName"
        },
        {
          title: "转换方向",
          dataIndex: "disrection"
        },
        {
          title: "状态",
          dataIndex: "transStatus"
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ]
    };
  },
  created() {
    console.log(baseHref);
    this.query();
  },
  methods: {
    search() {
      if (this.searchContent != "") {
        this.dataSource = this.orgDataSource.filter(item => {
          if (item.srcFileName.includes(this.searchContent)) {
            return item;
          }
        });
      } else {
         let [...filterData]=this.orgDataSource;
         this.dataSource=filterData;
      }
      this.pagination.total = this.dataSource.length || 0;
    },
    goback() {
      this.$router.go(-1); //返回上一层
    },
    onDelete(item) {
      console.log(item);
      const token = this.$db
        .read()
        .get("userId")
        .value();
      let param = new URLSearchParams();
      param.append("id", item.id);
      this.$axios
        .delete(`${baseHref}/trans-records`, {
          headers: { token: token },
          data: param
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.$message.success("删除成功");
            this.query();
          } else {
            this.$message.error(result.data.msg);
          }
        });
    },
    query() {
      const token = this.$db
        .read()
        .get("userId")
        .value();
      this.$axios
        .get(`${baseHref}/trans-records`, { headers: { token: token } })
        .then(result => {
          if (result.data.code == 1) {
            console.log(result);
            if (result.data.data.length > 0) {
              result.data.data.forEach(item => {
                item.disrection = item.srcFileType + "-" + item.dstFileType;
                item.createTime = moment(item.createTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
                if (item.transStatus != 1) {
                  item.transStatus = "失败";
                } else {
                  item.transStatus = "成功";
                }
              });
              this.orgDataSource = result.data.data;
              this.dataSource = result.data.data;
              this.pagination.total = this.dataSource.length || 0;
            }
          } else {
            this.$message.error(result.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .return-style {
      color: #1890ff;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .search {
    display: flex;
    margin-bottom: 20px;
    span {
      width: 300px !important;
    }
    button {
      margin-left: 15px;
      width: 130px;
    }
  }
}
</style>