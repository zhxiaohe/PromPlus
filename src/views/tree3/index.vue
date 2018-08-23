<template>
  <div class="app-container">
<el-form :inline="true" :model="filters">
				
			<el-form-item>
				<el-button type="primary" @click="showDialogmap"><slot><i class="fa fa-map-marker btn-map-marker"></i></slot>地图选点</el-button>
			  <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
      
			<el-form-item>	
				<el-date-picker
			      v-model="filters.startDate"
            size=“mini”
			      type="date"
			      placeholder="选择开始日期"
			      >
			    </el-date-picker>
			    <el-time-select
				  v-model="filters.startTime"
          size=“mini”
				  :picker-options="{
				    start: '00:00',
				    step: '01:00',
				    end: '24:00'
				  }"
				  placeholder="选择开始时间">
				</el-time-select>
				—
				<el-date-picker
			      v-model="filters.endDate"
            size=“mini”
			      type="date"
			      placeholder="选择结束日期"
			      >
			    </el-date-picker>
			    <el-time-select
				  v-model="filters.endTime"
          size=“small”
				  :picker-options="{
				    start: '00:00',
				    step: '01:00',
				    end: '24:00'
				  }"
				  placeholder="选择结束时间">
				</el-time-select>
			</el-form-item>
			<!--el-form-item>
				<el-button type="primary" @click="search">查询</el-button>
			</el-form-item-->

		</el-form>
		
		<section style="margin-left:-6px;">
			<el-tag
			  v-for="tag in this.marks"
			  :key="tag.num"
			  :type="tags_type[tag.num%5]"
			  style="margin-left: 5px;margin-top: 5px;"
			>
			{{tag.address}}
			</el-tag>
		</section>



    <el-table
      v-if="seen"
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
      v-if="seen"
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
      title="地图选点"
      :visible.sync="dialogVisible" @open="showMap">
      <!--div id="mapPath" style="height:400px;"></div-->
      <div id="mapMarker" style="height:400px;border: 1px solid #ccc;">
        <el-select
            class="map-dialog__ipt"
            v-model="mapKeyword"
            filterable
            remote
            placeholder="输入关键字查询地点"
            :remote-method="remoteMethod"
            @change="getAddrLngLat"
            :loading="addr_loading">
            <el-option
              v-for="item in address_list"
              :key="item.value"
              :label="item.value"
              :value="item">
              <span style="float: left">{{ item.value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
            </el-option>
          </el-select>
    </div>
    <div style="float: right;padding:10px;">
        <el-button type="primary" size="small" @click="clearMap">重置</el-button>
        <el-button type="success" size="small" @click="dialogVisible=false">确定</el-button>
    </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="dialogFormVisible" @open="showMappath">
      <div id="mapPath" style="height:400px;"></div>
    </el-dialog>

  </div>
</template>

<script>
import { getPassby } from '@/api/table_page'
import { getMark,getInfoWindow } from '@/utils/maps'
import moment from "moment"

export default {
  methods: {
    showPath(index, row) {
      this.dialogFormVisible = true 
      this.paths = row.paths
      var l = this.paths.length
      this.mapCenter = this.paths[0]
      this.endLnglat = this.paths[ l-1 ]
    },
    showDialogmap(){
      this.dialogVisible = true
    },
    handleSizeChange(val) {
      this.pagesize = val
      var pra = { 'page': this.currentPage4, 'page_size': this.pagesize }
      getPassby(pra).then(response => {
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
      getPassby(pra).then(response => {
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
    /* 加载地图选点 */
    showMap(){
      this.$nextTick(() => {
        if (!this.map) {
          this.map = new AMap.Map('mapMarker', {
            resizeEnable: true,
            zoom: 13
          })
          this.map.on('click',(e)=>{
            // console.log(e.lnglat.getLng(),e.lnglat.getLat())
            this.setLocationUseClick(e.lnglat.getLng(),e.lnglat.getLat())
          })
          this.map.plugin(["AMap.ToolBar"], () => {
            this.map.addControl(new AMap.ToolBar())
          })
          this.map.plugin(["AMap.Geocoder"],()=>{
            this.geocoder = new AMap.Geocoder({
              extensions: "all"
          })   
          })
          AMap.plugin('AMap.Autocomplete',  () => { // 回调函数
            this.autocomplete = new AMap.Autocomplete()
          })
        }
        })
    },
    /* 通过地图获取坐标查询 */
    async search(){
      if(_.isEmpty(this.marks)){
        this.$message({
          type: 'warning',
          message: '请选择查询点'
        });
        return false
      }
      if(_.isNull(this.filters.startDate) || !this.filters.startDate){
        this.$message({
          type: 'warning',
          message: '请选择开始日期'
        })
        return false
      }
      if(_.isNull(this.filters.startTime) || !this.filters.startTime){
        this.$message({
          type: 'warning',
          message: '请选择开始时间'
        })
        return false
      }
      if(_.isNull(this.filters.endTime) || !this.filters.endTime){
        this.$message({
          type: 'warning',
          message: '请选择结束日期'
        });
        return false
      }
      if(_.isNull(this.filters.endTime) || !this.filters.endTime){
        this.$message({
          type: 'warning',
          message: '请选择结束时间'
        });
        return false
      }
      let params = {};
      params['lng_lat'] = JSON.stringify(this.marks)
      params['time'] = moment(this.filters.startDate).format("YYYY-MM-DD") + ' ' + this.filters.startTime + ' - ' + moment(this.filters.endDate).format("YYYY-MM-DD") + ' ' + this.filters.endTime
      let response = await getPassby(params)
      this.dialogVisible = false
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
        this.seen = true
      } else {
        this.seen = true
      }
    },
    /* 获取地址坐标*/
    getAddrLngLat(addr){
      if (addr.location) {
        this.setMarksToMap(addr.location.lng,addr.location.lat,addr.value)
      }else{
        this.$message({
          type: 'warning',
          message: '位置为空，无法定位'
        })
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.addr_loading = true
        this.getAddress(query)
      } else {
        this.address_list = []
      }
		},
    clearMap(){
      this.map.clearMap()
      this.mapKeyword = ''
      this.marks = []
      this.mark_index = 1
    },
    /* 鼠标选点*/
    setLocationUseClick(lng,lat){
      this.geocoder.getAddress([lng,lat],(status,result)=> {
        if (status === 'complete' && result.info === 'OK') {
          this.setMarksToMap(lng,lat,result.regeocode.formattedAddress);
        }
      })
    },
    setMarksToMap(lng,lat,addr){
      let lnglat = new AMap.LngLat(lng, lat)
      const mark_index = this.mark_index
      let num = (_.last(this.marks)&&_.last(this.marks)['num']) ? _.last(this.marks)['num']:0
      let extData = {
        lnglat: lng+','+lat,
        address: addr,
        index: mark_index,
        num: num+1
      }
      let marker = getMark(lnglat, extData)
			marker.setMap(this.map)

			marker.on('click',()=> {
				marker.setMap(null)
				this.map.clearInfoWindow()
				this.marks = _.filter(this.marks, (item)=> {
					return item.index!=mark_index;
				})
					// 重排位置
				_.forEach(this.marks,(item, key)=> {
					item.num = key+1;
				})
			})

			let infoWindow = getInfoWindow()
			marker.on('mouseover',(e)=> {
        var iw = '';
        let data = e.target.getExtData()
        let addr = data.address,
          num = data.num;
        
        infoWindow.setContent(`<div class="info-window" x-placement="top">
                    <strong>序号：</strong>${num}<br/>
                    <strong>地址：</strong>${addr}<br/>
                          ${iw}
                        <div x-arrow class="popper__arrow" ></div>
                      </div>`)
        infoWindow.open(this.map, e.target.getPosition())
      })
      // 清除信息窗口
      marker.on('mouseout',(e)=> {
        this.map.clearInfoWindow()
      })
			this.map.setCenter(lnglat)
			this.marks.push(extData)
			this.mark_index++
      },
    
    showMappath() {
      this.$nextTick(() => {
        if (!this.map) {
          this.map = new AMap.Map('mapPath', {
            // resizeEnable: true,
          zoom: 13
          })
        } else {
          this.map = new AMap.Map('mapPath', {
          zoom: 13
          })
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
    }
  },
  data() {
    return {
      seen: false, // 隐藏表格
      filters: {
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
      },
      tableData2: [],
      currentPage4: 1,
      totalcount: 400,
      dialogVisible: false, // 地图选点弹窗
      dialogFormVisible: false, //地图轨迹弹窗
			listLoading: false,
      marks: [],
      map: null,
      mapContainer: null,
      SimpleMarker: null,
      mapCenter: [],
      paths: [],
      polyline: null,
      startMarker: null,
      endMarker: null,
      endLnglat: [],
      autocomplete: null,
      geocoder: null,
      mapKeyword: '',
      address_list: [],
      order_list: [],//前端过滤10个
      filter_order_list: [],//全部列表信息
      running_queue: [],//正在运行的队列
      addr_loading: false,
      mark_index: 1,
      tags_type: ['success','primary','info','danger','warning'],
      page_num: 1,
      page_size: 10,
      total: 0,
      timerHandle: null
    }
  },
  mounted() {
  }
}
</script>