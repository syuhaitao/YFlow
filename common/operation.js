;
/*移动操作*/
MoveOperation = Undo.Command.extend({
    constructor: function(self, obj, data, sx, sy, ex, ey) {
        this.obj = obj;
        this.data = data;
        this.sx = sx;
        this.sy = sy;
        this.ex = ex;
        this.ey = ey;
        this.self = self;
    },
    execute: function() {

    },
    undo: function() {
        this.data.x = this.sx;
        this.data.y = this.sy;
        //var newData = this.obj.move(this.data, this.sx, this.sy);
        var newData = this.data;
        $("#" + this.data.id).remove();
        //$("#"+this.data.id).parent("g").remove();
        this.self.diagramModel[this.data.id] = newData;

        var group = YFlowUtil.drawGroup(this.self.paper,this.data.id);
        this.obj.display(group,newData);

        YFlowUtil.handleLines(this.data.id, this.self);
    },

    redo: function() {
        //var newData = this.obj.move(this.data, this.ex, this.ey);
        this.data.x = this.ex;
        this.data.y = this.ey;
        var newData = this.data;
        $("#" + this.data.id).remove();
        //$("#"+this.data.id).parent("g").remove();
        this.self.diagramModel[this.data.id] = newData;

        var group = YFlowUtil.drawGroup(this.self.paper,this.data.id);
        this.obj.display(group,newData);

        YFlowUtil.handleLines(this.data.id, this.self);
    }
});
/*添加操作*/
AddOperation = Undo.Command.extend({
    constructor: function(self, obj, data) {
        this.obj = obj;
        this.data = data;
        this.self = self;
    },
    execute: function() {
        var group = YFlowUtil.drawGroup(this.self.paper,this.data.id);
        this.obj.display(group,this.data);

        this.self.diagramModel[this.data.id] = this.data;
    },
    redo: function() {
      var group = YFlowUtil.drawGroup(this.self.paper,this.data.id);
      this.obj.display(group,this.data);
      this.self.diagramModel[this.data.id] = this.data;
    },

    undo: function() {
        $("#" + this.data.id).remove();
        //$("#"+this.data.id).parent("g").remove();
        delete this.self.diagramModel[this.data.id];
    }
});
/*连线操作*/
ConnectOperation = Undo.Command.extend({
    constructor: function(self, obj, data) {
        this.obj = obj;
        this.data = data;
        this.self = self;

    },
    execute: function() {
        this.self.lineModel.push(this.data);
        var group = YFlowUtil.drawGroup(this.self.paper,this.data.id);
        this.obj.display(group,this.data);
    },
    redo: function() {
        this.self.diagramModel[this.data.id] = this.data;
        var group = YFlowUtil.drawGroup(this.self.paper,this.data.id);
        this.obj.display(group,this.data);
        if (this.self.lineModel.length > 0) {
            for (var i = 0; i < this.self.lineModel.length; i++) {
                if (this.data.id == this.self.lineModel[i].id) {
                    this.self.lineModel.splice(i, 1);
                }
            }
        }
        this.self.lineModel.push(this.data);

    },

    undo: function() {
        delete this.self.diagramModel[this.data.id];
        $("#" + this.data.id).remove();
        //$("#"+this.data.id).parent("g").remove();
        if (this.self.lineModel.length > 0) {
            for (var i = 0; i < this.self.lineModel.length; i++) {
                if (this.data.id == this.self.lineModel[i].id) {
                    this.self.lineModel.splice(i, 1);
                }
            }
        }
    }
});
/*删除操作*/
DeleteOperation = Undo.Command.extend({
    constructor: function(self, components) {
        this.self = self;
        this.cons = components;

    },
    execute: function() {
        for (var i = 0; i < this.cons.length; i++) {
            var id = this.cons[i].id;
            delete this.self.diagramModel[id];
            //$("#" + id).parent("g").remove();
            $("#" + id).remove();
        }
    },
    redo: function() {
        for (var i = 0; i < this.cons.length; i++) {
            var id = this.cons[i].id;
            delete this.self.diagramModel[id];
            //$("#" + id).parent("g").remove();
            $("#" + id).remove();
        }
    },

    undo: function() {
        for (var i = 0; i < this.cons.length; i++) {
            var id = this.cons[i].id;
            var obj = this.cons[i].obj;
            var data = this.cons[i].data;
            this.self.diagramModel[id] = data;
            //$("#" + id).parent("g").remove();
            $("#" + id).remove();
            var group = YFlowUtil.drawGroup(this.self.paper,id);
            obj.display(group,data);

        }
    }
});
/*改变大小操作*/
ResizeOperation = Undo.Command.extend({
    constructor: function(self, obj, roldData, dragPointId, startX, startY,endX,endY) {
        this.obj = obj;
        this.dragPointId = dragPointId;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.self = self;
        this.roldData = roldData;

    },
    execute: function() {
       var returnData = this.obj.resize(this.roldData, this.dragPointId, this.roldData.x, this.roldData.y,this.endX,this.endY);
      // $("#" + this.roldData.id).parent("g").remove();
       this.self.diagramModel[this.roldData.id] = returnData;
      // this.obj.display(returnData);
      // YFlowUtil.handleLines(this.roldData.id, this.self);
    },
    redo: function() {
        var returnData = this.obj.resize(this.roldData, this.dragPointId, this.roldData.x, this.roldData.y,this.endX,this.endY);
        //$("#" + this.roldData.id).parent("g").remove();
        $("#" + this.roldData.id).remove();
        this.self.diagramModel[this.roldData.id] = returnData;

        var group = YFlowUtil.drawGroup(this.self.paper,this.roldData.id);
        this.obj.display(group,returnData);

        YFlowUtil.handleLines(this.roldData.id, this.self);

    },

    undo: function() {
        var returnData = this.obj.resize(this.roldData, this.dragPointId, this.roldData.x, this.roldData.y,this.startX,this.startY);
        //$("#" + this.roldData.id).parent("g").remove();
        $("#" + this.roldData.id).remove();
        this.self.diagramModel[this.roldData.id] = returnData;

        var group = YFlowUtil.drawGroup(this.self.paper,this.roldData.id);
        this.obj.display(group,returnData);

        YFlowUtil.handleLines(this.roldData.id, this.self);
    }
});
/*修改属性操作*/
UpdatePropOperation = Undo.Command.extend({
    constructor: function(self, obj, oldData, newData) {
        this.self = self;
        this.obj = obj;
        this.oldData = oldData;
        this.newData = newData;
    },
    execute: function() {

        //$("#" + this.newData.id).parent("g").remove();
        $("#" + this.newData.id).remove();
        this.self.diagramModel[this.newData.id] = this.newData;

        var group = YFlowUtil.drawGroup(this.self.paper,this.newData.id);
        this.obj.display(group,this.newData);

        YFlowUtil.handleLines(this.newData.id, this.self);

    },
    redo: function() {
        //$("#" + this.newData.id).parent("g").remove();
        $("#" + this.newData.id).remove();
        this.self.diagramModel[this.newData.id] = this.newData;
        var group = YFlowUtil.drawGroup(this.self.paper,this.newData.id);
        this.obj.display(group,this.newData);
        YFlowUtil.handleLines(this.newData.id, this.self);

    },

    undo: function() {
        //$("#" + this.newData.id).parent("g").remove();
        $("#" + this.newData.id).remove();
        this.self.diagramModel[this.oldData.id] = this.oldData;
        var group = YFlowUtil.drawGroup(this.self.paper,this.oldData.id);
        this.obj.display(group,this.oldData);
        YFlowUtil.handleLines(this.oldData.id, this.self);
    }
});
