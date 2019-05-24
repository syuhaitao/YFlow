;
ShapeHandler = function() {};
ShapeHandler.prototype.mousedown = function(e, self) {
    YFlowUtil.cancelSelected(self);
    self.selectedComponents=[];
};
ShapeHandler.prototype.mouseup = function(e, self) {
    var top = $("#Y-Paper").offset().top;
    var left = $("#Y-Paper").offset().left;
    var id = self.nextId();
    var obj = self.leftCheckedObj.obj;
    var json = {};
    json.id = id;
    json.type = self.leftCheckedObj.id;
    json.group = "shape";
    json.x = parseInt(e.clientX - left);
    json.y = parseInt(e.clientY - top);
    var data = obj.creatData(json);
    self.diagramModel[id] = data;
    self.stack.execute(new AddOperation(self, obj, data));
    self.selectedComponents.push(id);
    YFlowUtil.selectedAndShowProp(self, obj, id, data)
};
ShapeHandler.prototype.mousemove = function() {};

ConnectorHandler = function() {};
ConnectorHandler.prototype.mousedown = function(e, self) {
    YFlowUtil.cancelSelected(self);
    var obj = self.leftCheckedObj.obj;
    if ($(e.target).attr("type") == "connectPoint") {
        if (!obj.isCompleted(self.lineTemp)) {
            if (obj.validatePoint(self.lineTemp, $("#" + e.target.id))) {
                var pobj = $("#" + e.target.id);
                var pointObj = {};
                pointObj.id = pobj.attr("id");
                pointObj.fid = pobj.parent("g").attr("id");
                pointObj.obj = e.target;
                self.lineTemp.push(pointObj);

                self.connArry.push(pobj.parent("g").attr("id"));
            } else {
                alert("该连接点不可连接！！！")
            }
        }
    }else{
        $("#Y-helpLine").remove();
        self.lineTemp=[];
    }
};
ConnectorHandler.prototype.mouseup = function(e, self) {
    var lid = self.nextId();
    var obj = self.leftCheckedObj.obj;
    if ($(e.target).attr("type") == "connectPoint") {
        if (obj.isCompleted(self.lineTemp)) {
            $("#Y-helpLine").remove();
            var json = {};
                json.id = lid;
                json.type = self.leftCheckedObj.id;
                json.group = "line";
                json.pointArry = self.lineTemp;
                json.connArry = self.connArry;
            var data = obj.creatData(json);
            self.diagramModel[lid] = data;
            self.stack.execute(new ConnectOperation(self, obj, data));
            self.lineTemp = [];
            self.connArry=[];
            self.selectedComponents.push(lid);
            YFlowUtil.selectedAndShowProp(self, obj, lid, data)
        }
    }
};
ConnectorHandler.prototype.mousemove = function(e, self) {
    var top = $("#Y-Paper").offset().top;
    var left = $("#Y-Paper").offset().left;
    $("#Y-helpLine").remove();
    var obj = self.leftCheckedObj.obj;
    if (!obj.isCompleted(self.lineTemp)) {
        if (self.lineTemp.length > 0) {
            var id = "Y-helpLine";
            obj.helpLine(id, self.lineTemp, parseInt(e.clientX - left), (e.clientY - top))
        }
    }
};

SelectionHandler = function() {};
SelectionHandler.prototype.mousedown = function(e, self) {
    $("#Y-selectBox").remove();
    YFlowUtil.cancelSelected(self);
    this.drag = false;
    this.X = e.clientX;
    var top = $("#Y-Paper").offset().top;
    var left = $("#Y-Paper").offset().left;
    var targetId = e.target.id;
    var targetFid =$(e.target).parent("g").attr("id");

    var targetGroup = self.diagramModel[targetFid] == undefined ? "" : self.diagramModel[targetFid]["group"];
    if ($("#" + targetId).attr("type") != "dragPoint" && targetGroup == "shape") {
        self.dragComponents.push(targetFid);
        this.sX = self.diagramModel[targetFid]["x"];
        this.sY = self.diagramModel[targetFid]["y"];
    }

    if (targetId == "Y-Paper") {
        this.drag = true;
        self.startX = parseInt(e.clientX - left);
        self.startY = parseInt(e.clientY - top);
        this.rect = self.paper.rect(self.startX, self.startY, 0, 0);
        this.rect.attr("fill", "silver");
        this.rect.attr("id", "Y-selectBox");
        this.rect.attr("fill-opacity", "0");
        this.rect.attr("stroke", "black");
        this.rect.attr("stroke-dasharray", "10");
        self.box = this.rect;

    }
    if ($("#" + targetId).attr("type") == "dragPoint") {
        self.dragPoints.push(targetId);
        this.resizeStartX = parseInt($("#" + targetId).attr("x")==undefined ? $("#" + targetId).attr("cx"):$("#" + targetId).attr("x"));
        this.resizeStartY = parseInt($("#" + targetId).attr("y")==undefined ? $("#" + targetId).attr("cy"):$("#" + targetId).attr("y"));

    }
};
SelectionHandler.prototype.mouseup = function(e, self) {
    $("#Y-selectBox").remove();
    var targetId = e.target.id;
    var targetFid =$(e.target).parent("g").attr("id");

    var targetGroup = self.diagramModel[targetFid] == undefined ? "" : self.diagramModel[targetFid]["group"];
    if (this.X == e.clientX) {
        if (targetId == "Y-Paper") {
            $("#Y-Choose").click();
            YFlowUtil.showFlowInfoProp(self);
        } else if (targetGroup == "shape" || targetGroup == "line") {
            self.selectedComponents = [];
            self.selectedComponents.push(targetFid);
            var targetType = self.diagramModel[targetFid]["type"];
            var obj = self.objectPool.get(targetType);
            var prop = obj.getPropForm();
            var data = self.diagramModel[targetFid];
            YFlowUtil.selectedAndShowProp(self, obj, targetFid, data)
        }
    } else {
        if (self.dragComponents.length == 1) {
            var top1 = $("#Y-Paper").offset().top;
            var left1 = $("#Y-Paper").offset().left;
            var oooid = self.dragComponents[0];
            var type = self.diagramModel[oooid]["type"];
            var oobj = self.objectPool.get(type);
            var sx = this.sX;
            var sy = this.sY;
            var ex = parseInt(e.clientX - left1);
            var ey = parseInt(e.clientY - top1);
            var odata = self.diagramModel[oooid];
            self.stack.execute(new MoveOperation(self, oobj, odata, sx, sy, ex, ey))
        }
        if (self.dragPoints.length == 1 ) {
            var top = $("#Y-Paper").offset().top;
            var left = $("#Y-Paper").offset().left;
            var dragPointId = self.dragPoints[0];
            var ffid = $("#"+dragPointId).parent("g").attr("id");
            var type = self.diagramModel[ffid]["type"];
            var robj = self.objectPool.get(type);
            var x1 = self.diagramModel[ffid]["x"];
            var y1 = self.diagramModel[ffid]["y"];

            var resizeEndX = parseInt(e.clientX-left);
            var resizeEndY = parseInt(e.clientY-top);

            var roldData = self.diagramModel[ffid];
            self.stack.execute(new ResizeOperation(self, robj, roldData, dragPointId, this.resizeStartX, this.resizeStartY,resizeEndX,resizeEndY))
        }
    }
    self.dragComponents = [];
    self.dragPoints = [];
    if (this.drag && this.rect.attr("id") == "Y-selectBox") {
        var rects = self.diagramModel;
        $.each(rects, function(k, v) {
            if (k != "0") {
                if (v.x != undefined) {
                    var x = v.x;
                    var y = v.y;
                    var type = v.type;
                    var id = v.id;
                    if (Snap.path.isPointInsideBBox(self.box.getBBox(), x, y)) {
                        self.selectedComponents.push(id);
                        //self.objectPool.get(type).selected($("#" + id))
                        var obj = self.objectPool.get(type);
                        var data = self.diagramModel[id];
                        YFlowUtil.selectedAndShowProp(self,obj,id,data);
                        // if(self.options.selectedStyleFlag==0 || self.options.selectedStyleFlag=="0"){
                        //     $("#"+id).attr("class","Y-Node-Selected");
                        //     var list = $("#"+id).children();
                        //     if(list.length>0){
                        //       for(var i=0;i<list.length;i++){
                        //            var id = list[i].id;
                        //           if(id!=""){
                        //              if($("#"+id).attr("type")=="dragPoint"){
                        //                 $("#"+id).css("display","");
                        //              }
                        //           }
                        //       }
                        //     }
                        // }else{
                        //   self.objectPool.get(type).selected(id);
                        // }
                        //end---
                    }
                }
            }
        });
        self.box = null;
        $("#Y-selectBox").remove()
    }
    this.drag = false
};
SelectionHandler.prototype.mousemove = function(e, self) {
    if (this.X != e.clientX) {
        var top = $("#Y-Paper").offset().top;
        var left = $("#Y-Paper").offset().left;
        self.endX = parseInt(e.clientX - left);
        self.endY = parseInt(e.clientY - top);
        if ((e.target.id == "Y-Paper" || e.target.id == "Y-selectBox") && this.drag && parseInt(e.clientX - this.X) != 0 && self.box != null) {
            if (self.endX <= self.startX && self.endY <= self.startY) {
                self.box = YFlowUtil.drawSelectBox(self.paper, self.endX, self.endY, (self.startX - self.endX), (self.startY - self.endY))
            }
            if (self.endX >= self.startX && self.endY >= self.startY) {
                self.box = YFlowUtil.drawSelectBox(self.paper, self.startX, self.startY, (self.endX - self.startX), (self.endY - self.startY))
            }
            if (self.endX >= self.startX && self.endY <= self.startY) {
                self.box = YFlowUtil.drawSelectBox(self.paper, self.startX, self.endY, (self.endX - self.startX), (self.startY - self.endY))
            }
            if (self.endX <= self.startX && self.endY >= self.startY) {
                self.box = YFlowUtil.drawSelectBox(self.paper, self.endX, self.startY, (self.startX - self.endX), (self.endY - self.startY))
            }
        }
        if (self.dragComponents.length == 1) {
            var ids = self.dragComponents[0];
            var oldData = self.diagramModel[ids];
            oldData.x = parseInt(e.clientX - left);
            oldData.y = parseInt(e.clientY - top);
            var type = self.diagramModel[ids]["type"];
            var oobj = self.objectPool.get(type);
            $("#" + ids).remove();
            var group = YFlowUtil.drawGroup(self.paper,ids);
            oobj.display(group,oldData);
            YFlowUtil.handleLines(ids, self)
        }
        if (self.dragPoints.length == 1) {
            var dragPointId = self.dragPoints[0];
            var ffid = $("#"+dragPointId).parent("g").attr("id");
            var type = self.diagramModel[ffid]["type"];
            var robj = self.objectPool.get(type);

            var roldData = self.diagramModel[ffid];
            var x1 = roldData.x;
            var y1 = roldData.y;
            var x2 = parseInt(e.clientX-left);
            var y2 = parseInt(e.clientY-top);
            var resizeDx = parseInt(x2-x1);
            var resizeDy = parseInt(y2-y1);
            var ooData = self.diagramModel[ffid];
            var returnData = robj.resize(roldData, dragPointId, x1,y1 ,x2,y2);
            $("#"+ffid).remove();
            var group = YFlowUtil.drawGroup(self.paper,returnData.id);
            robj.display(group,returnData);
            YFlowUtil.handleLines(ffid, self)

        }
    }
};
