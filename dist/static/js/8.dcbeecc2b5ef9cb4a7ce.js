webpackJsonp([8],{YBQJ:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=a("vLgD");var n={data:function(){return{list:null,listLoading:!0}},filters:{statusFilter:function(t){return{published:"success",draft:"gray",deleted:"danger"}[t]}},created:function(){this.fetchData()},methods:{fetchData:function(){var t,e=this;this.listLoading=!0,(t=this.listQuery,Object(l.a)({url:"/table/list",method:"get",params:t})).then(function(t){e.list=t.data.items,e.listLoading=!1})}}},s={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"app-container"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading.body",value:t.listLoading,expression:"listLoading",modifiers:{body:!0}}],attrs:{data:t.list,"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{align:"center",label:"ID",width:"95"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n        "+t._s(e.$index)+"\n      ")]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"Title"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n        "+t._s(e.row.title)+"\n      ")]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"Author",width:"110",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.author))])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"Pageviews",width:"110",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n        "+t._s(e.row.pageviews)+"\n      ")]}}])}),t._v(" "),a("el-table-column",{attrs:{"class-name":"status-col",label:"Status",width:"110",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-tag",{attrs:{type:t._f("statusFilter")(e.row.status)}},[t._v(t._s(e.row.status))])]}}])}),t._v(" "),a("el-table-column",{attrs:{align:"center",prop:"created_at",label:"Display_time",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("i",{staticClass:"el-icon-time"}),t._v(" "),a("span",[t._v(t._s(e.row.display_time))])]}}])})],1)],1)},staticRenderFns:[]},i=a("VU/8")(n,s,!1,null,null,null);e.default=i.exports}});