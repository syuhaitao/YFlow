;
var Y_model = {};

var RESIZE_POINT = "dragPoint";
var CONNECT_POINT="connectPoint";
class DiagramController{
  constructor(ele,opt){
      this.element=ele;
      this.diagramModel=Y_model;
      this.lineModel=null;
      this.objectPool=null;
      this.undoManager=null;
      this.paper=null;
      this.defaults={};
      this.leftCheckedObj=null;
      this.selectedComponents=null;
      this.dragComponents=null;//拖拽节点集合
      this.CurrentActionHandler="";
      this.lineTemp=[];
      this.connArry=[];
      this.uuid=1;
      this.temporaryLine=null;//临时线
      this.dragPoints=null;//拖拽点集合
      //选择矩形框
      this.startX=0;
      this.startY=0;
      this.endX=0;
      this.endY=0;
      this.box=null;
      this.options=$.extend({},this.defaults,opt);

      //操作栈
      this.stack = new Undo.Stack();

  }
  init(){

    this.objectPool=new Map();
    this.objectPool.set("shape",YFlowUtil.factory("ShapeHandler"));
    this.objectPool.set("line",YFlowUtil.factory("ConnectorHandler"));
    this.objectPool.set("choose",YFlowUtil.factory("SelectionHandler"));
    this.CurrentActionHandler=this.objectPool.get("choose");
    //this.diagramModel={};
    this.lineModel=[];
    this.leftCheckedObj= new Object();
    this.selectedComponents=[];
    this.dragComponents=[];
    this.dragPoints=[];
    this.initDiv();
    this.initPalette();
    this.loadDiagram();
    this.initToolbar();
    this.leftClick();
    this.rightEventHandle();
    YFlowUtil.showFlowInfoProp(this);
  }
  initDiv(){
     var temp='<div class="Y-LeftPanel"><div id="Y-leftPanel" class="Y-PropTitle">组件栏</div>';
         temp+='</div><div class="Y-PaperPanel"><div id="Y-TopPanel" class="Y-TopPanel">';
         temp+='</div>';
         temp+='<svg id="Y-Paper" class="Y-Paper"  >';
         temp+='<defs> <marker id="Y-markerArrow-1" markerWidth="8" markerHeight="8" refx="8" refy="5" orient="auto"><path d="M2,2 L2,8 L8,5 L2,2" class="Y-markerArrow-1"/></marker></defs>';
         temp+='<defs> <marker id="Y-markerArrow-2" markerWidth="8" markerHeight="8" refx="8" refy="5" orient="auto"><path d="M2,2 L2,8 L8,5 L2,2" class="Y-markerArrow-2"/></marker></defs>';
         temp+='<defs> <marker id="Y-markerArrow-3" markerWidth="8" markerHeight="8" refx="8" refy="5" orient="auto"><path d="M2,2 L2,8 L8,5 L2,2" class="Y-markerArrow-3"/></marker></defs>';
         temp+='</svg></div>';
         temp+='<div id="Y-PropPanel" class="Y-LeftPanel"><div class="Y-PropTitle">组件属性</div>';
         temp+='<div id="Y-PropBody"  class="Y-PropBody"></div></div>';
     this.element.html(temp);
  }
  leftClick(){
    var _this=this;
    var self=this.leftCheckedObj;
    var _obj=this.objectPool;

    $(".Y-Node").each(function(){
        $(this).click(function(){
          self.id=$(this).attr("id");
          self.type=$(this).attr("type");
          self.obj=_obj.get($(this).attr("id"));
          _this.switchActionHandler($(this).attr("type"));
          var oImg= document.getElementsByTagName('img');
          for(var i=0;i<oImg.length;i++){
            if(oImg[i].id==$((this)).attr("id")){
              oImg[i].style.border="1px solid red";
            }else{
              oImg[i].style.border="";
            }
          }
          _this.leftCheckedObj=self;
        })
    })

  }
  rightEventHandle(){

    var self=this;
    //绑定键盘快捷键
    $(window).keydown(function(event){
     if (event.ctrlKey && event.keyCode === 89){ //Control+Y
           $("#Y-Redo").click();
     } else if (event.ctrlKey && event.keyCode === 90){ //Control+Z
           $("#Y-Undo").click();
     }else if (event.keyCode === 46){ //DELETE
           $("#Y-Delete").click();
     }

    });
    //监听画布变化
    var changeFlag = false;
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;//浏览器兼容
    var config = { attributes: true, childList: true};//配置对象
    $("#Y-Paper").each(function(){
      var _this = $(this);
      var observer = new MutationObserver(function(mutations) {//构造函数回调
        mutations.forEach(function(record) {
          if(record.type == "attributes"){//监听属性
  　　　　　　　　changeFlag=true;
          }
          if(record.type == 'childList'){//监听结构发生变化
                  changeFlag=true;
          }

          if(changeFlag){
            if(self.selectedComponents.length!=1){
                YFlowUtil.showFlowInfoProp(self);
            }else{
                var id   = self.selectedComponents[0];
                var type = self.diagramModel[id]["type"];
                var obj  = self.objectPool.get(type);
                var prop = obj.getPropForm();
                var data = self.diagramModel[id];
                //选中-显示属性
                YFlowUtil.selectedAndShowProp(self, obj, id, data);
            }
          }
       });
     });
     observer.observe(_this[0], config);
    });


    $("#Y-Delete").click(function(){

      var len = self.selectedComponents.length;
      var delArry = [];
      if(len>0){
         for(var i=0;i<len;i++){
            var id  = self.selectedComponents[i];
            var oobj =new Object();
            oobj.id =id;
            var type = self.diagramModel[id]["type"];
            oobj.obj  = self.objectPool.get(type);
            oobj.data = self.diagramModel[id];
            delArry.push(oobj);
         }

        //添加要删除的连线
         if(self.lineModel.length>0){
          for(var i=0;i<self.lineModel.length;i++){
              var lineId=self.lineModel[i].id;

            for(var j=0;j<len;j++){
               var sid  = self.selectedComponents[j];

                if($.inArray(sid+"",self.lineModel[i].connArry)!=-1){

                  var lobj =new Object();
                  lobj.id =lineId;
                  var type = self.lineModel[i].type;
                  lobj.obj  = self.objectPool.get(type);
                  lobj.data = self.lineModel[i];
                  delArry.push(lobj);
               }
            }

          }
        }
        ////////
        self.stack.execute(new DeleteOperation(self,delArry));
        self.selectedComponents=[];

      }else{
        alert("没有选中节点,无法删除！");
      }

    });
    $("#Y-Redo").click(function(){
        var len = self.selectedComponents.length;
      if(len>0){

        self.selectedComponents=[];
      }

        self.stack.canRedo() && self.stack.redo();

    });
    $("#Y-Undo").click(function(){
      var len = self.selectedComponents.length;
      if(len>0){
        self.selectedComponents=[];
      }

        self.stack.canUndo() && self.stack.undo();

    });
    //保存
    $("#Y-Save").click(function(){
       var obj=self.diagramModel;
       var jsonStr =obj[0];
       var result=[];
        $.each(obj,function(k,v){
           if(k!="0"){
              result.push(v);
           }
        });
        jsonStr.data=result;
        self.options.save(JSON.stringify(jsonStr));

    });
    $("#Y-Choose").click(function (){
        self.leftCheckedObj.obj=null;
        self.leftCheckedObj.type=null;
        self.switchActionHandler("choose");
        var oImg= document.getElementsByTagName('img');
        for(var i=0;i<oImg.length;i++){
            oImg[i].style.border="";
        }
        //YFlowUtil.cancelSelected(self);
    });

    var top = $("#Y-Paper").offset().top;
    var left=$("#Y-Paper").offset().left;
    var sTop =$(window).scrollTop();
    var sLeft = $('#Y-Paper').scrollLeft();

    $("#Y-Paper").on("mousemove",function(e){
        document.title="X:"+parseInt(e.clientX-left+$(".Y-PaperPanel").scrollLeft())+",Y:"+(e.clientY-top+$(".Y-PaperPanel").scrollTop());
        var handler =self.getCurrentActionHandler();
        handler.mousemove(e,self);
        return false;
    });

    $("#Y-Paper").mouseover(function(e){
        var handler = self.getCurrentActionHandler();
        var targetId = e.target.id;
        var targetFid = $(e.target).parent("g").attr("id");
        var targetGroup = self.diagramModel[targetFid]==undefined ? "" : self.diagramModel[targetFid]["group"];
        if(self.leftCheckedObj.type=="line" && targetGroup=="shape" ){
            var list = $(e.target).parent("g").children();
            if(list.length>0){
              for(var i=0;i<list.length;i++){
                   var id = list[i].id;
                  if(id!=""){
                     if($("#"+id).attr("type")=="connectPoint"){
                        $("#"+id).css("display","");
                     }
                  }
              }
            }

        }
    });

    $("#Y-Paper").mouseout(function(e){
        var targetId = e.target.id;
        var targetFid = $(e.target).parent("g").attr("id");
        var targetGroup = self.diagramModel[targetFid]==undefined ? "" : self.diagramModel[targetFid]["group"];
        if(targetGroup=="shape" ){
            var list = $(e.target).parent("g").children();
            if(list.length>0){
              for(var i=0;i<list.length;i++){
                   var id = list[i].id;
                  if(id!=""){
                     if($("#"+id).attr("type")=="connectPoint"){
                        $("#"+id).css("display","none");
                     }
                  }
              }
            }
        }
    });

    $("#Y-Paper").on("mousedown",function(e){

        var handler =self.getCurrentActionHandler();
        handler.mousedown(e,self);

    });

    $("#Y-Paper").on("mouseup",function(e){

        var handler =self.getCurrentActionHandler();
        handler.mouseup(e,self);

    });

    $(".Y-MenuPanel").each(function(){
        $(this).children(".Y-MenuContent").hide();
    });

    $(".Y-MenuTitle").each(function(){
        $(this).click(function(){
          if($(this).parents(".Y-MenuPanel").children(".Y-MenuContent").css("display") != "none"){
            $(this).parents(".Y-MenuPanel").children(".Y-MenuContent").slideUp();
          }else{
            $(this).parents(".Y-MenuPanel").children(".Y-MenuContent").slideDown();
          }
        });
    });

  }
  initPalette(){
     this.paper=Snap("#Y-Paper");
     var temp='';
     var str = eval(this.options.tools);
     var _self=this.objectPool;
     var _paper= this.paper;

    $.each(str, function() {

        temp+='<div class="Y-MenuPanel">';
        temp+='<div class="Y-MenuTitle">'+this.group+'</div>';
        temp+='<div class="Y-MenuContent">';
        var _type= this.type;
        $.each(this.child,function(){
           temp+='<img id="'+this.id+'" title="'+this.text+'" type="'+_type+'" class="Y-Node" src="'+this.src+'"/>';
           _self.set(this.id,YFlowUtil.factory(this.id,_paper));
        });
        this.objectPool=_self;
        temp+='</div></div>';
    });
    $("#Y-leftPanel").after(temp);
  };
  initToolbar(){
    var temp='';
        temp+='<input id="Y-Choose"  class="Y-TopButton" type="button" value="选择"/>';
        temp+='<input id="Y-Save"    class="Y-TopButton" type="button" value="保存"/>';
        temp+='<input id="Y-Redo"    class="Y-TopButton" type="button" value="重置" />';
        temp+='<input id="Y-Undo"    class="Y-TopButton" type="button" value="撤销"/>';
        temp+='<input id="Y-Delete"  class="Y-TopButton" type="button" value="删除"/></div>';
        $(".Y-TopPanel").html(temp);
  }
  loadDiagram(){
     var _obj=this.objectPool;
     var data=eval(this.options);
     var _model=this.diagramModel;
     var _id = this.uuid;
     var _self=this;
     var json = {};
     json.id=data.data.id;
     json.name = data.data.name;
     json.describe = data.data.describe;
      _model[0]=json;
     $.each(data.data.data, function() {

         if(this.type!=undefined){
            _model[this.id]=this;

           var object= _obj.get(this.type);
           var group = YFlowUtil.drawGroup(_self.paper,this.id);
           object.display(group,this);
           _id=this.id;
         }
         if(this.group=="line"){
            _self.lineModel.push(this);
         }
     });
     this.uuid=_id;

  }
  switchActionHandler(type){

    this.CurrentActionHandler=this.objectPool.get(type);

  }
  getCurrentActionHandler(){

    return this.CurrentActionHandler;

  }

  nextId(){

     return ++this.uuid;
  }
};
