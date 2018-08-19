<template>
  <div class="app-container">
    <el-table
      :data="tableData2"
      style="width: 100%">
      <el-table-column
        prop="urlname"
        label="apiname"
        width="180">
      </el-table-column>
      <el-table-column
        prop="url"
        label="apiurl">
        <template slot-scope="scope"> 
        <el-tag>{{scope.row.url}}</el-tag>
        <el-popover trigger="hover" placement="top">
          <p>姓名: {{ scope.row.urlname }}</p>
          <p>住址: {{ scope.row.url }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.url }}</el-tag>
          </div>
        </el-popover>
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
  </div>
  
</template>

<script>
import axios from 'axios'

export default {
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    handlelink(index, row) {
      console.log(row.url)
      window.location.href = row.url
    }
  },
  data() {
    return {
      tableData2: [{
        'urlname': 'i',
        'url': 'i',
        'source': 'github'
      }]
    }
  },
  mounted() {
    axios.get('https://api.github.com')
      .then(response => {
        this.tableData2 = []
        for (var i in response.data) {
          this.tableData2.push({
            'urlname': i,
            'url': response.data[i],
            'source': 'github'
          })
        }
      })
  }
}
</script>