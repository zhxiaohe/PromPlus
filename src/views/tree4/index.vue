<template>
  <div class="app-container">
    <div class="filter">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input placeholder="请输入内容" v-model="filters.user_car_tel" style="width:300px;">
					    <el-select v-model="filters.search" slot="prepend" placeholder="请选择" style="width:100px;">
					      <el-option 
					      	v-for="item in options"
							    :key="item.value"
							    :label="item.label"
							    :value="item.value">
						    </el-option>
					    </el-select>
					</el-input>
				</el-form-item>
          <el-form-item>
              <el-date-picker type="daterange" format="yyyy-MM-dd" :picker-options="pickerOptions2" placeholder="选择时间" v-model="filters.days" style="width: 250px"></el-date-picker>
          </el-form-item>
				<el-form-item>
					<el-button type="success" icon="search" @click="search">查询</el-button>
				</el-form-item>

			</el-form>
		</div>

    <el-table
      :data="tableData2"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id">
      </el-table-column>
      
      <el-table-column  prop="createtime"  label="createtime" width="180"> </el-table-column>      
      <el-table-column  prop="name"  label="项目" width="180"> </el-table-column>
      <el-table-column        prop="startaddress"        label="开始地址" width="180">
        <template slot-scope="scope"> 
          <el-tag>{{scope.row.startaddress}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  prop="stopaddress"  label="结束地址" width="180">
        <template slot-scope="scope"> 
          <el-tag>{{scope.row.stopaddress}}</el-tag>
        </template>   
      </el-table-column>
      <el-table-column  prop="whentime"  label="时长" width="180"> </el-table-column>

      <el-table-column  fixed="right" label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          @click="showPath(scope.$index, scope.row)">轨迹</el-button>
      </template>
      </el-table-column>
    </el-table>
      
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalcount">
      </el-pagination>
    </div>

    <el-dialog
      title="轨迹"
      :visible.sync="dialogVisible" @open="showMap">
      <div id="mapPath" style="height:400px;"></div>
    </el-dialog>
  </div>
  
  
</template>

<script>
import { getList } from '@/api/table_page.js'
import moment from 'moment'

export default {
  methods: {
    showPath(index, row) {
      this.dialogVisible = true
      this.paths = row.paths
      var l = this.paths.length
      this.mapCenter = this.paths[0]
      this.endLnglat = this.paths[ l-1 ]
    },
    showMap() {
      this.$nextTick(() => {
        if (!this.map) {
          this.map = new AMap.Map('mapPath', {
            // resizeEnable: true,
            zoom: 13
          })
        } else {
          this.map.setCenter(this.mapCenter)
        }
        this.map.clearMap()
        this.drawUserPath(this.map, this.paths, this.mapCenter, this.endLnglat)
      })
    },
    drawUserPath(map, paths, startLnglat, endLnglat, index, SimpleMarker){
      // let sc = ['#FF981C','#FF6978','#7F96FF','#039BE5','#56E39F','#7D33CE','#EC5E4E','#5B127B','#834262','#93032E','#0F4C5C','#BE01FF','#3BF984','#3A1772','#6457A6','#4C9EA3','#C2996D','#EA3838','#EA6A54','#AE9A63','#E55934','#2C377B'];
      let sc = ["red", "orange", "green", "blue", "orchid", "darkred", "darkblue", "darkgreen", "purple", "cadetblue", "black"]
      let strokeColor = index ? sc[index % sc.length] : '#13ce66'
      console.log(index)
      const polyline = new AMap.Polyline({
        path: paths, // 设置线覆盖物路径
        strokeColor: strokeColor, // 线颜色
        strokeOpacity: 1, // 线透明度
        strokeWeight: 4, // 线宽
        strokeStyle: 'solid', // 线样式
        strokeDasharray: [10, 5] // 补充线样式
      })
      polyline.setMap(map)

      if (SimpleMarker) { // 多条颜色
        new SimpleMarker({
          iconLabel: {
            innerHTML: '始' + index,
            style: {
              color: '#fff',
              fontSize: '40%',
              marginTop: '2px'
            }
          },
          iconStyle: sc[index % sc.length],
          map: map,
          position: startLnglat
        })

        new SimpleMarker({
          iconLabel: {
            innerHTML: '末' + index,
            style: {
              color: '#fff',
              fontSize: '40%',
              marginTop: '2px'
            }
          },
          iconStyle: sc[index % sc.length],
          map: map,
          position: endLnglat
        })
      } else {
        const startMarker = new AMap.Marker({
          icon: new AMap.Icon({
            image: 'http://webapi.amap.com/theme/v1.3/images/newpc/poi-1.png',
            imageOffset: new AMap.Pixel(-334, -180)
          }),
          position: startLnglat,
          offset: new AMap.Pixel(-15, -36)
        })
        startMarker.setMap(map)

        const endMarker = new AMap.Marker({
          icon: new AMap.Icon({
            image: 'http://webapi.amap.com/theme/v1.3/images/newpc/poi-1.png',
            imageOffset: new AMap.Pixel(-334, -136)
          }),
          position: endLnglat,
          offset: new AMap.Pixel(-17, -35)
        })
        endMarker.setMap(map)
      }
    },
    async search() {
      const params = {}
      const sDay = this.filters.days[0],
        eDay = this.filters.days[1]
      if (!sDay) {
        this.$message({
          type: 'warning',
          message: '日期不能为空'
        })
        return false
      }
      params['days'] = moment(sDay).format('YYYY-MM-DD') + '@' + moment(eDay).format('YYYY-MM-DD')
      console.log(this.filters.search)
      params['search'] = this.filters.search
      params[this.filters.search] = this.filters.user_car_tel
      this.listLoading = true
      const response = await getList(params)
      if (response) {
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
      }
      this.listLoading = false
    },
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
      totalcount: 0,
      tableData2: [{
        'id': 'i',
        'name': 'i',
        'startaddress': 'github',
        'createtime': 'i',
        'paths': []
      }],
      filters: {
        user_car_tel: '',
        search: 'all',
        days: []
      },
      options: [{
        value: 'bike',
        label: '骑行'
      }, {
        value: 'run',
        label: '跑步'
      }, {
        value: 'walk',
        label: '遛弯'
      }, {
        value: 'driving',
        label: '驾车'
      }, {
        value: 'daily',
        label: '日常出行'
      }, {
        value: 'all',
        label: '所有'
      }],
      currentPage4: 1,
      dialogVisible: false,
      listLoading: false,
      map: null,
      mapContainer: null,
      SimpleMarker: null,
      mapCenter: [],
      paths: [],
      polyline: null,
      startMarker: null,
      endMarker: null,
      endLnglat: [],
      tagActiveName: 'list',
      pickerOptions2: {
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }]
      }
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