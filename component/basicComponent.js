;
Component_Circle = function(paper) {
    this.paper = paper;

}
Component_Circle.prototype.display = function(g,attr) {

   point1 = this.paper.circle(attr.x, parseInt(attr.y)-parseInt(attr.r), 4).attr("fill", "white");
   point1.attr("type", CONNECT_POINT);
   point1.attr("class", attr.id);
   point1.attr("id", attr.id + "connPoint-1");
   point1.attr("display", "none");
   point1.attr("stroke", "purple");
   point1.attr("stroke-width", "2");

   point2 = this.paper.circle(parseInt(attr.x)+parseInt(attr.r),attr.y, 4).attr("fill", "white");
   point2.attr("type", CONNECT_POINT);
   point2.attr("class", attr.id);
   point2.attr("id", attr.id + "connPoint-2");
   point2.attr("display", "none");
   point2.attr("stroke-width", "2");
   point2.attr("fill", "white");
   point2.attr("stroke", "purple");

   point3 = this.paper.circle(parseInt(attr.x)-parseInt(attr.r), parseInt(attr.y), 4).attr("fill", "blue");
   point3.attr("type", CONNECT_POINT);
   point3.attr("class", attr.id);
   point3.attr("id", attr.id + "connPoint-3");
   point3.attr("display", "none");
   point3.attr("stroke-width", "2");
   point3.attr("fill", "white");
   point3.attr("stroke", "purple");

   point4 = this.paper.circle(attr.x, parseInt(attr.y)+parseInt(attr.r), 4).attr("fill", "blue");
   point4.attr("type", CONNECT_POINT);
   point4.attr("class", attr.id);
   point4.attr("id", attr.id + "connPoint-4");
   point4.attr("display", "none");
   point4.attr("stroke-width", "2");
   point4.attr("fill", "white");
   point4.attr("stroke", "purple");



    text = this.paper.text(attr.x, attr.y, attr.text);
    text.attr("text-anchor","middle");
    circle = this.paper.circle(attr.x, attr.y, attr.r);

    circle.attr("fill", "green");
    circle.attr("stroke-width", "2");
    g.add(circle, point1,point2,point3,point4, text);

}

Component_Circle.prototype.creatData = function(json) {
    json.r = 40;
    json.opt1 = "opt-1",
    json.opt2 = "ABCDEFGHINCEELFADLFJFLAJDSL",
    json.text = "圆",
    json.opt3 ="",
    json.opt4 =""
    return json;
}

Component_Circle.prototype.deselect = function(id) {

    $("#"+id).attr("stroke", "");
}

Component_Circle.prototype.selected = function(id) {

    $("#"+id).attr("stroke", "red");
}

Component_Circle.prototype.getPropForm = function(obj) {
    var optArry = {
        data: [{
            text: "请选择",
            id: "opt-0"
        },
        {
            text: "选项1",
            id: "opt-1"
        },
        {
            text: "选项2",
            id: "opt-2"
        }]
    };
    var radioArry = {
        data: [{
            text: "同意",
            id: "opt-1"
        },
        {
            text: "不同意",
            id: "opt-2"
        }]
    };
    var checkboxArry = {
        data: [{
            text: "条件1",
            id: "opt-1"
        },
        {
            text: "条件2",
            id: "opt-2"
        }]
    };
    var json = [
    {
        id: "p-1",
        label:"编号",
        inputType: "text",
        name: "id",
        class: "Prop-input",
        method: "",
        value: "",
        readonly:"true"
    },
    {
        id: "p-2",
        inputType: "text",
        name: "type",
        label:"组件类型",
        class: "Prop-input",
        method: "",
        value: "",
        readonly:"true"
    },
    {
        id: "p-3",
        inputType: "text",
        name: "group",
        label:"组件分组",
        class: "Prop-input",
        method: "",
        value: "",
        readonly:"true"
    },
    {
        id: "p-4",
        inputType: "text",
        name: "x",
        label:"横轴",
        class: "Prop-input",
        value: ""
    },
    {
        id: "p-5",
        inputType: "text",
        name: "y",
        label:"纵轴",
        class: "Prop-input",
        value: ""
    },
    {
        id: "p-11",
        inputType: "text",
        name: "r",
        label:"半径",
        value: ""
    },
    {
        id: "p-6",
        inputType: "text",
        name: "text",
        label:"文本",
        method:"YY",
        class: "Prop-input",
        value: ""
    },
    {
        id: "p-7",
        inputType: "select",
        name: "opt1",
        label:"条件1",
        class: "Prop-input",
        option: optArry.data,
        value: ""
    },
    {
        id: "p-8",
        inputType: "textArea",
        name: "opt2",
        label:"条件2",
        method:"BB",
        class: "Prop-input",
        value: ""
    },
    {
        id: "p-9",
        inputType: "radio",
        name: "opt3",
        label:"条件3",
        class: "Prop-radio",
        option: radioArry.data,
        value: ""
    },
    {
        id: "p-10",
        inputType: "checkbox",
        name: "opt4",
        label:"条件4",
        option: checkboxArry.data,
        class: "Prop-checkbox",
        value: ""
    }];

    return json;
}

function YY(args) {
  this.value = "333";
  return this.value;
}

function BB(args){
  this.value="BBBB";
  return this.value;
}

Component_Rect = function(paper) {
    this.paper = paper;
}
Component_Rect.prototype.display = function(g,attr) {
    rect = this.paper.rect(attr.x, attr.y, attr.width, attr.height);
    rect.attr("fill", "orange");
    rect.attr("stroke-width", "2");

    point = this.paper.circle(parseInt(attr.x)+parseInt(attr.width) , parseInt(attr.y)+parseInt(attr.height) , 4).attr("fill", "blue");
    point.attr("type", RESIZE_POINT);
    point.attr("class", attr.id);
    point.attr("id", attr.id + "dragPoint-1");
    point.attr("fill", "blue");
    point.attr("display", "none");

    point2 = this.paper.circle(attr.x, parseInt(attr.y)+parseInt(attr.height/2), 4).attr("fill", "white");
    point2.attr("type", CONNECT_POINT);
    point2.attr("class", attr.id);
    point2.attr("id", attr.id + "connPoint-1");
    point2.attr("display", "none");
    point2.attr("stroke", "purple");
    point2.attr("stroke-width", "2");

    point4 = this.paper.circle(parseInt(attr.x)+parseInt(attr.width/2),attr.y, 4).attr("fill", "white");
    point4.attr("type", CONNECT_POINT);
    point4.attr("class", attr.id);
    point4.attr("id", attr.id + "connPoint-2");
    point4.attr("display", "none");
    point4.attr("stroke-width", "2");
    point4.attr("fill", "white");
    point4.attr("stroke", "purple");

    point3 = this.paper.circle(parseInt(attr.x)+parseInt(attr.width), parseInt(attr.y)+parseInt(attr.height/2), 4).attr("fill", "blue");
    point3.attr("type", CONNECT_POINT);
    point3.attr("class", attr.id);
    point3.attr("id", attr.id + "connPoint-3");
    point3.attr("display", "none");
    point3.attr("stroke-width", "2");
    point3.attr("fill", "white");
    point3.attr("stroke", "purple");

    point5 = this.paper.circle(parseInt(attr.x)+parseInt(attr.width/2), parseInt(attr.y)+parseInt(attr.height), 4).attr("fill", "blue");
    point5.attr("type", CONNECT_POINT);
    point5.attr("class", attr.id);
    point5.attr("id", attr.id + "connPoint-4");
    point5.attr("display", "none");
    point5.attr("stroke-width", "2");
    point5.attr("fill", "white");
    point5.attr("stroke", "purple");

    text = this.paper.text(parseInt(attr.x)+parseInt(attr.width/2), parseInt(attr.y)+parseInt(attr.height/2), attr.text);
    text.attr("text-anchor","middle");
    g.add(rect, text, point, point2,point3,point4,point5);
}
Component_Rect.prototype.resize = function(oldData, dragPointId, X1, Y1,X2,Y2) {

    oldData.width = parseInt(X2-X1);
    oldData.height =parseInt(Y2-Y1);
    return oldData;

}
Component_Rect.prototype.creatData = function(json) {
    json.width = 80;
    json.height = 40;
    json.text = "矩形"
    return json;
}

Component_Rect.prototype.deselect = function(id) {
    $("#"+id).attr("stroke", "");

}

Component_Rect.prototype.selected = function(id) {
    $("#"+id).attr("stroke", "yellow");
}

Component_Rect.prototype.getPropForm = function(obj) {
    var json = [{
        id: "p-1",
        inputType: "text",
        name: "id",
        label:"编号",
        method: "",
        value: ""
    },
    {
        id: "p-2",
        inputType: "text",
        name: "type",
        label:"类型",
        method: "",
        value: ""
    },
    {
        id: "p-3",
        inputType: "text",
        name: "group",
        label:"分组",
        method: "",
        value: ""
    },
    {
        id: "p-4",
        inputType: "text",
        name: "x",
        label:"横轴",
        method: "",
        value: ""
    },
    {
        id: "p-5",
        inputType: "text",
        name: "y",
        label:"纵轴",
        method: "",
        value: ""
    },
    {
        id: "p-6",
        inputType: "text",
        name: "text",
        label:"文本",
        value: ""
    }
  ];

    return json;
}

//三角形
Component_Trangle = function(paper) {
    this.paper = paper;
}
Component_Trangle.prototype.display = function(attr) {
   var trangle = this.paper.image("images/三角形_triangle23.svg",attr.x,attr.y,attr.width,attr.height);
   trangle.attr("id",attr.id);
   trangle.attr("fill","");
   var g = this.paper.g(trangle);
}
Component_Trangle.prototype.resize = function(oldData, dragPointId, dx, dy) {

}
Component_Trangle.prototype.creatData = function(id, x, y) {
    var json = {};
    json.id = id;
    json.type = "Component_Trangle";
    json.group = "shape";
    json.x = x-50;
    json.y = y-50;
    json.width = 100;
    json.height =100;
    json.text = "三角形"
    return json;
}

Component_Trangle.prototype.deselect = function(obj) {

}
Component_Trangle.prototype.selected = function(obj) {

}
Component_Trangle.prototype.getPropForm = function(obj) {
    var json = [{
        id: "p-1",
        inputType: "text",
        name: "id",
        method: "",
        value: ""
    },
    {
        id: "p-2",
        inputType: "text",
        name: "type",
        method: "",
        value: ""
    },
    {
        id: "p-3",
        inputType: "text",
        name: "group",
        method: "",
        value: ""
    },
    {
        id: "p-4",
        inputType: "text",
        name: "x",
        method: "",
        value: ""
    },
    {
        id: "p-5",
        inputType: "text",
        name: "y",
        method: "",
        value: ""
    },
    {
        id: "p-6",
        inputType: "text",
        name: "text",
        method: "YY(this)",
        value: ""
    }];

    return json;
}



//正方形
Component_Square = function(paper) {
    this.paper = paper;
}
Component_Square.prototype.display = function(attr) {

}

Component_Square.prototype.move = function(data, dx, dy) {
    data.x = dx-50;
    data.y = dy-50;
    return data;
}

Component_Square.prototype.resize = function(oldData, dragPointId, dx, dy) {

}
Component_Square.prototype.mouseover = function(obj) {
}

Component_Square.prototype.mouseout = function(obj) {
}

Component_Square.prototype.creatData = function(id, x, y) {
    var json = {};
    json.id = id;
    json.type = "Component_Square";
    json.group = "shape";
    json.x = x;
    json.y = y;
    json.width = 100;
    json.height =100;
    json.text = "正方形"
    return json;
}

Component_Square.prototype.updateData = function(oldData) {
}

Component_Square.prototype.deselect = function(obj) {

}
Component_Square.prototype.selected = function(obj) {

}

Component_Square.prototype.getPropForm = function(obj) {
     var optArry = {
        data: [{
            text: "请选择",
            id: "opt-0"
        },
        {
            text: "选项1",
            id: "opt-1"
        },
        {
            text: "选项2",
            id: "opt-2"
        }]
    };
    var radioArry = {
        data: [{
            text: "同意",
            id: "opt-1"
        },
        {
            text: "不同意",
            id: "opt-2"
        }]
    };
    var checkboxArry = {
        data: [{
            text: "条件1",
            id: "opt-1"
        },
        {
            text: "条件2",
            id: "opt-2"
        }]
    };
    var json = [{
        id: "p-1",
        inputType: "text",
        name: "id",
        method: "",
        value: ""
    }];

    return json;
}

//连线
Component_Line = function(paper) {
    this.paper = paper;
}
Component_Line.prototype.display = function(g,data) {
    var lineTemp = data.pointArry;
    var id = data.id;

    if (lineTemp.length == 2) {
        var x1 = $("#" + lineTemp[0].id).attr("cx");
        var x2 = $("#" + lineTemp[1].id).attr("cx");
        var y1 = $("#" + lineTemp[0].id).attr("cy");
        var y2 = $("#" + lineTemp[1].id).attr("cy");

        line = this.paper.line(x1, y1, x2, y2);
        line.attr("stroke-width","2px");
        line.attr("class","Y-Node-Deselected");
        line.attr("id","line_"+id);
        $("#line_"+id).css("marker-end","url(#Y-markerArrow-3)");
        g.add(line);
    }
}

Component_Line.prototype.helpLine = function(id,lineTemp, x, y) {
    if(lineTemp.length=1){
       var x1 = $("#" + lineTemp[0].id).attr("cx");
       var y1 = $("#" + lineTemp[0].id).attr("cy");

       helpLine = this.paper.line(x1,y1,x-5,y-5);
       helpLine.attr("id",id);
       helpLine.attr({
        stroke: "black",
        "stroke-width": "2px",
        "stroke-dasharray":6
       });
    }

}

Component_Line.prototype.validatePoint = function(lineArry, points) {
    if (lineArry.length == 0) {

        return true;
    } else if (lineArry.length == 1) {
        if (lineArry[0].id == points.attr("id")) {

            return false;
        } else {

            return true;
        }
        // }else if(lineArry.length == 2){
        //      return false;
    }

}

Component_Line.prototype.isCompleted = function(lineArry) {

    if (lineArry.length == 2) {
        return true;
    } else {
        return false;
    }

}

Component_Line.prototype.creatData = function(json) {
    json.text = "连线";
    return json;
}

Component_Line.prototype.deselect = function(id) {
    $("#line_"+id).css("stroke", "black");
    //obj.attr("stroke", "black");
}
Component_Line.prototype.selected = function(id) {
     $("#line_"+id).css("stroke", "red");
    //obj.attr("stroke", "red");
}

Component_Line.prototype.getPropForm = function(obj) {
    var json = [{
        id: "p-1",
        inputType: "text",
        name: "id",
        label:"编号",
        method: "",
        value: ""
    },
    {
        id: "p-2",
        inputType: "text",
        name: "type",
        label:"类型",
        method: "",
        value: ""
    },
    {
        id: "p-3",
        inputType: "text",
        name: "group",
        label:"分组",
        method: "",
        value: ""
    },
    {
        id: "p-4",
        inputType: "text",
        name: "text",
        label:"文本",
        method: "",
        value: ""
    }
   ];

    return json;
}

//连线
Component_Line2 = function(paper) {
    this.paper = paper;
}
Component_Line2.prototype.display = function(g,data) {
    var lineTemp = data.pointArry;
    var id = data.id;

    if (lineTemp.length == 2) {
        var x1 = $("#" + lineTemp[0].id).attr("cx");
        var x2 = $("#" + lineTemp[1].id).attr("cx");
        var y1 = $("#" + lineTemp[0].id).attr("cy");
        var y2 = $("#" + lineTemp[1].id).attr("cy");

        line = this.paper.line(x1, y1, x2, y2);
        line.attr("stroke-width","2px");
        line.attr("stroke-dasharray","6");
        line.attr("class","Y-Node-Deselected");
        line.attr("id","line_"+id);
        $("#line_"+id).css("marker-end","url(#Y-markerArrow-3)");
        g.add(line);
    }
}

Component_Line2.prototype.helpLine = function(id,lineTemp, x, y) {
    if(lineTemp.length=1){
       var x1 = $("#" + lineTemp[0].id).attr("cx");
       var y1 = $("#" + lineTemp[0].id).attr("cy");

       helpLine = this.paper.line(x1,y1,x-5,y-5);
       helpLine.attr("id",id);
       helpLine.attr({
        stroke: "black",
        "stroke-width": "2px",
        "stroke-dasharray":6
       });
    }

}

Component_Line2.prototype.validatePoint = function(lineArry, points) {
    if (lineArry.length == 0) {

        return true;
    } else if (lineArry.length == 1) {
        if (lineArry[0].id == points.attr("id")) {

            return false;
        } else {

            return true;
        }
        // }else if(lineArry.length == 2){
        //      return false;
    }

}

Component_Line2.prototype.isCompleted = function(lineArry) {

    if (lineArry.length == 2) {
        return true;
    } else {
        return false;
    }

}

Component_Line2.prototype.creatData = function(json) {
    json.text = "连线";
    return json;
}


Component_Line2.prototype.deselect = function(id) {
    $("#line_"+id).css("stroke", "black");
    //obj.attr("stroke", "black");
}

Component_Line2.prototype.selected = function(id) {
     $("#line_"+id).css("stroke", "red");
    //obj.attr("stroke", "red");
}

Component_Line2.prototype.getPropForm = function(obj) {
    var json = [{
        id: "p-1",
        inputType: "text",
        name: "id",
        label:"编号",
        method: "",
        value: ""
    },
    {
        id: "p-2",
        inputType: "text",
        name: "type",
        label:"类型",
        method: "",
        value: ""
    },
    {
        id: "p-3",
        inputType: "text",
        name: "group",
        label:"分组",
        method: "",
        value: ""
    },
    {
        id: "p-4",
        inputType: "text",
        name: "text",
        label:"文本",
        method: "",
        value: ""
    }
   ];

    return json;
}
