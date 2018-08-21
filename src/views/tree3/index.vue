<template>
  <div class="app-container">
    <el-table
      :data="tableData2"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="userid"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="username"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
        <template slot-scope="scope"> 
        <el-tag>{{scope.row.address}}</el-tag>
      </template>
      </el-table-column>

      <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handlelink(scope.$index, scope.row)">link</el-button>

        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
      </el-table-column>
    </el-table>
    <div class="block">
    
    <div> <br> </div>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalcount">
    </el-pagination>
    </div>
  </div>
  
</template>

<script>
import { getList } from '@/api/table_page'

export default {
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
      var pra = { 'page': this.currentPage4, 'page_size': this.pagesize }
      getList(pra).then(response => {
        if (response['status'] === '200') {
          this.tableData2 = []
          this.currentPage4 = response['current_page']
          this.pagesize = response['page_size']
          this.totalcount = response['total_count']
          for (var i in response['results']) {
            this.tableData2.push(
              response['results'][i]
            )
          }
        }
      })
    },
    handleCurrentChange(val) {
      var pra = { 'page': val, 'page_size': this.pagesize }
      getList(pra).then(response => {
        if (response['status'] === '200') {
          this.tableData2 = []
          this.currentPage4 = response['current_page']
          this.pagesize = response['page_size']
          this.totalcount = response['total_count']
          for (var i in response['results']) {
            this.tableData2.push(
              response['results'][i]
            )
          }
        }
      })
    }
  },
  data() {
    return {
      tableData2: [{
        'id': 'i',
        'name': 'i',
        'address': 'github'
      }],
      currentPage4: 1,
      totalcount: 400
    }
  },
  mounted() {
    getList()
      .then(response => {
        this.tableData2 = []
        this.currentPage4 = response['current_page']
        this.pagesize = response['page_size']
        this.totalcount = response['total_count']
        if (response['status'] === '200') {
          for (var i in response['results']) {
            this.tableData2.push(
              response['results'][i]
            )
          }
        }
      })
  }
}
</script>