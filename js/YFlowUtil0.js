;
function YFlowUtil() {};
//根据ID获取节点属性值
YFlowUtil.getValueByIdFromModel =function(nodeId){

   return JSON.stringify(Y_model[nodeId])||"";
};
//移动处理连线
YFlowUtil.drawSelectBox = function(paper,x,y,width,height){
   $("#Y-selectBox").remove();
   rect = paper.rect(x, y, width,height);
   rect.attr("fill", "silver");
   rect.attr("id", "Y-selectBox");
   rect.attr("fill-opacity", "0");
   rect.attr("stroke", "black");
   rect.attr("stroke-dasharray", "10");
  //  rect.attr("stroke-dashoffset",0);
   return rect;
};

//移动处理连线
YFlowUtil.drawGroup = function(paper,id){
   g = paper.g();
   g.attr("id",id);
   return g;
};

YFlowUtil.handleLines = function(ids, self) {
    var lineArry = self.diagramModel;
    $.each(lineArry,function(k,v){
        if(k!="0" &&v.group=="line"){
          var delFlag= false;
          // if(v.pointArry.length>0){
          //   for(var i=0;i<v.pointArry.length;i++){
          //      if(ids==v.pointArry[i].fid){
          //         delFlag=true;
          //      }
          //   }
          // }

          if($.inArray(ids+"",v.connArry)!=-1 || $.inArray(ids,v.connArry)!=-1){
              var type = v.type;
              var oldData = v;
              var obj = self.objectPool.get(type);
              $("#"+v.id).remove();

              var group = YFlowUtil.drawGroup(self.paper,v.id);
              obj.display(group,oldData);
          }
       }
    });
};
//取消所有选中直线
YFlowUtil.cancelSelected = function(self) {
    if (self.selectedComponents.length > 0) {
        for (var i = 0; i < self.selectedComponents.length; i++) {
            var sid = self.selectedComponents[i];
            var type = self.diagramModel[sid]["type"];
            var obj = self.objectPool.get(type);
            obj.deselect($("#" + sid));
        }
        self.selectedComponents = [];
    }
};

//显示流图信息属性
YFlowUtil.showFlowInfoProp= function(self){
    var prop = self.diagramModel[0];
    var html = '<table id ="ptable" class="Y-PropBody" >';
        html += '<tr><td><label style="float:left;"><nobr>流图编号:</nobr></label></td><td><input class="Prop-input" id="Y-flowId" readonly="true" type="text"  value="'+prop.id+'"/><td></tr>';
        html += '<tr><td><label style="float:left;"><nobr>流图名称:</nobr></label></td><td><input class="Prop-input" id="Y-flowName" type="text"  value="'+prop.name+'"/><td></tr>';
        html += '<tr><td><label style="float:left;"><nobr>流图描述:</nobr></label></td><td><textarea class="Prop-input" id="Y-flowDescribe">'+prop.describe+'</textarea><td></tr>';
        html += '<tr><td colspan=2><input class="Y-OK" type="button" id="Y-OK-1" value="确定" /></td></tr>';
        html += '</table>';
    $("#Y-PropBody").html(html);

    $("#Y-OK-1").click(function(){
       var flowId   = $("#Y-flowId").val();
       var flowName = $("#Y-flowName").val();
       var flowDescribe = $("#Y-flowDescribe").val();
       var odata = self.diagramModel[0];
           odata.id= flowId;
           odata.name = flowName;
           odata.describe = flowDescribe;
       self.diagramModel[0]=odata;
    });
};

//选中展示属性
YFlowUtil.selectedAndShowProp = function(self, obj, id, data) {

    //obj.selected($("#" + id));


    var prop = obj.getPropForm();
    var html = '<form id="Y-Form"><table id ="ptable" class="Y-PropBody" >';
    $.each(prop,function() {
        if (this.inputType == "text") {
            if(this.readonly=='true'){
               html += '<tr><td><label style="float:left;"><nobr>' + this.label + ':</nobr></label></td><td><input id="' + this.id + '" readonly="true" name="'+this.name+'" class="' + this.class + '" type="' + this.inputType + '"  value="' + data[this.name] + '" method="' + this.method + '"/><td></tr>';
            }else{
               html += '<tr><td><label style="float:left;"><nobr>' + this.label + ':</nobr></label></td><td><input id="' + this.id + '"   name="'+this.name+'" class="' + this.class + '" type="' + this.inputType + '"  value="' + data[this.name] + '" method="' + this.method + '"/><td></tr>';
            }
        } else if (this.inputType == "textArea") {
            html += '<tr><td><label style="float:left;"><nobr>' + this.label + ':</nobr></label></td><td><textarea rows="3" cols="22" id="' + this.id + '" name="'+this.name+'" class="' + this.class + '"   method="' + this.method + '">' + data[this.name] + '</textarea><td></tr>';
        } else if (this.inputType == "select") {
            html += '<tr><td><label style="float:left;"><nobr>' + this.label + ':</nobr></label></td><td><select id="' + this.id + '"  name="'+this.name+'" class="' + this.class + '">';
            for (var i = 0; i < this.option.length; i++) {
                if (data[this.name] == this.option[i].id) {
                    html += '<option selected="true" value="' + this.option[i].id + '">' + this.option[i].text + '</option>';
                } else {
                    html += "<option value='" + this.option[i].id + "'>" + this.option[i].text + "</option>";
                }
            }
            html += '</select><td></tr>';
        } else if (this.inputType == "radio") {
            html += '<tr><td><label style="float:left;"><nobr>' + this.label + ':</nobr></label></td><td>';
            for (var i = 0; i < this.option.length; i++) {
                if (data[this.name] == this.option[i].id) {
                    html += '<input id="' + this.id + '"  name="'+this.name+'" class="' + this.class + '" type="radio" checked="true"  value="' + this.option[i].id + '"><nobr>' + this.option[i].text + '</nobr></input>';
                } else {
                    html += '<input id="' + this.id + '"  name="'+this.name+'" class="' + this.class + '" type="radio"  value="' + this.option[i].id + '"><nobr>' + this.option[i].text + '</nobr></input>';
                }
            }
            html += '<td></tr>';
        } else if (this.inputType == "checkbox") {
            html += '<tr><td><label style="float:left;"><nobr>' + this.label + ':</nobr></label></td><td>';
            for (var i = 0; i < this.option.length; i++) {
                if ( $.inArray(this.option[i].id,data[this.name])!=-1) {
                    html += '<input id="' + this.id + '"  name="'+this.name+'[]" class="' + this.class + '" type="checkbox" checked="true"  value="' + this.option[i].id + '"><nobr>' + this.option[i].text + '</nobr></input>';
                } else {
                    html += '<input id="' + this.id + '"  name="'+this.name+'[]" class="' + this.class + '" type="checkbox"  value="' + this.option[i].id + '"><nobr>' + this.option[i].text + '</nobr></input>';
                }
            }
            html += '<td></tr>';
        }
    });
    html += '<tr> <td colspan=2><input class="Y-OK" type="button" id="Y-OK"  value="确定" /></td></tr>';
    html += '</table></form>';
    $("#Y-PropBody").html(html);
    $("#Y-Choose").click();

    $("#Y-Form :input").click(function(){
        var method = $("#"+this.id).attr("method");
        if(method!=undefined && method!="undefined" && method!="" && method!=null){
            var obj={};
            var obj = YFlowUtil.factory(method,this.value);
            this.value = obj.value;


        }else{
          this.focus();
        }
    });
    $("#Y-OK").click(function() {
        // var sid = self.selectedComponents[0];
        // var type = self.diagramModel[sid]["type"];
        // var obj = self.objectPool.get(type);
        // var newData = obj.updateData(data);
        // self.stack.execute(new UpdatePropOperation(self, obj, data, newData));
        var newData = {};
        var json = $('#Y-Form').serializeArray();
        var arry=[];
        var name=null;
        $.each(json, function() {
          var index = this.name.indexOf("[]");
          if(index==-1){
              newData[this.name] = this.value;
          }else{
              name=this.name.substring(0,index);
              arry.push(this.value);
          }
        });
        if(name!=null){
          newData[name]=arry;
        }
        var lastData = $.extend(false,data,newData);
        //alert(JSON.stringify(lastData));

         var sid =data.id;
         var type = data.type;
         var obj = self.objectPool.get(type);
         self.stack.execute(new UpdatePropOperation(self, obj,data, lastData));
    });
};


YFlowUtil.getLine = function(obj1, obj2) {

    var bb1 = obj1.getBBox(),
    bb2 = obj2.getBBox(),
    p = [{
        x: bb1.x + bb1.width / 2,
        y: bb1.y - 1
    },
    {
        x: bb1.x + bb1.width / 2,
        y: bb1.y + bb1.height + 1
    },
    {
        x: bb1.x - 1,
        y: bb1.y + bb1.height / 2
    },
    {
        x: bb1.x + bb1.width + 1,
        y: bb1.y + bb1.height / 2
    },
    {
        x: bb2.x + bb2.width / 2,
        y: bb2.y - 1
    },
    {
        x: bb2.x + bb2.width / 2,
        y: bb2.y + bb2.height + 1
    },
    {
        x: bb2.x - 1,
        y: bb2.y + bb2.height / 2
    },
    {
        x: bb2.x + bb2.width + 1,
        y: bb2.y + bb2.height / 2
    }],
    d = {},
    dis = [];

    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
            dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
    y1 = p[res[0]].y,
    x4 = p[res[1]].x,
    y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
    y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
    x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
    y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(" ");

    return path;
};
YFlowUtil.factory = function(type, r) {
    if (!window[type]) {
        return;
    }
    var component = new window[type](r);
    return component;
};
YFlowUtil.getSvgObjectById = function(paper,id){
  var set = paper.selectAll("circle");
  set.forEach(function(element, index) {

      if( element.attr("type") == "connectPoint" && element.attr("id")==id){

         return element;

      }else{
        return undefined;
      }
  });
};
//var common = new  Interface("common",["drag","move"])；
var Interface = function(name, methods) {
    if (arguments.length != 2) {
        throw new Error("Interface constructor expects 2 arguments, but exactly provided for " + arguments.length + " arguments.");
    }
    this.name = name;
    this.methods = [];
    for (var i = 0; i < methods.length; i++) {
        if (typeof methods[i] != "string") {
            throw new Error("Interface constructor expects to pass a string method name.");
        }
        this.methods.push(methods[i]);
    }
};
//static class method
Interface.ensureImplements = function(instance) {
    if (arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements expects at least 2 arguments, but exactly passed for " + arguments.length + " arguments.");
    }
    for (var i = 1,
    len = arguments.length; i < len; i++) {
        var interface = arguments[i];
        if (interface.constructor != Interface) {
            throw new Error("Function Interface.ensureImplements expects at least 2 arguments to be instances of Interface.");
        }
        for (var j = 0,
        mLen = interface.methods.length; j < mLen; j++) {
            var method = interface.methods[j];
            if (!instance[method]) {
                throw new Error("Function Interface.ensureImplements: object doesn't implements " + interface.name + ". Method " + method + " wasn't found.");
            }
        }
    }
};
