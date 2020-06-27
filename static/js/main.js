var weather = ["晴","晴","晴","晴","多云","晴间多云","晴间多云","大部多云","大部多云",
        "阴","阵雨","雷阵雨","雷阵雨伴有冰雹","小雨","中雨","大雨","暴雨","大暴雨","特大暴雨",
        "冻雨","雨夹雪","阵雪","小雪","中雪","大雪","暴雪","浮沉","扬沙","沙尘暴","强沙尘暴",
        "雾","霾","风","大风","飓风","热带风暴","龙卷风","冷","热"];
    var city = "";
    var dateArray = [];
    var highTemper=[];
    var lowTemper = [];
    var humiArr = [];
    var lng,lat;
    $(function () {
        initDraw("");
                //获取当前位置信息
        $.ajax({
            type: "get",//默认是GET
            url: "http://39.106.172.170:8080/location",
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                $("#address").html(data.data.address);
                lng = data.data.point_x;
                lat = data.data.point_y;
                city = data.data.city;
                initMap();
            }
        });

    });
    window.onload=function () {
        initMenu("");


    };
    function initMenu(address){
        var today = new Date();
        $("#today").html("时间："+today.toDateString());
         $.ajax({
            type: "get",//默认是GET
            url: "http://39.106.172.170:8080/nowWeather?address="+address,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                var code = data.data.weatherCode;
                if (code!=99){
                    $("#weather").html(weather[code]);

                }else {
                    $("#weather").html("未知");
                }
                $("#img").attr("src","../static/img/white/"+code+"@1x.png");
                $("#temper").html(data.data.temperature+"°");
                $("#humi").html(data.data.humidity);

            }
        });
         //获取空气质量
         $.ajax({
            type: "get",//默认是GET
            url: "http://39.106.172.170:8080/airCondition?address="+address,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                $(".hole").addClass('change').attr('data-content',data.data.aqi);
            }
        });


    }
    function initMap() {
      var point = new BMap.Point(lng,lat);
      window.geoc = new BMap.Geocoder();
      var map =  new BMap.Map("map");
      map.centerAndZoom(city,12);
      var myIcon= new BMap.Icon("../static/img/fox.gif",new BMap.Size(200,157));
      var marker = new BMap.Marker(point,{icon:myIcon})
        map.addOverlay(marker);
        map.centerAndZoom(point,12);
        //开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true);
        //定义鼠标双击事件
            map.addEventListener('dblclick', function(e) {
                getAddress(e);
            })

    }

    function getAddress(e) {
        let lng = e.point.lng;
        let lat = e.point.lat;
        let point = new BMap.Point(lng,lat);
        window.geoc.getLocation(point, function (rs) {
            city = rs.addressComponents.city;
            district = rs.addressComponents.district;
            province = rs.addressComponents.province;
            var address = province+city+district;
            $("#address").html(address);
            highTemper.length = 0;
            lowTemper.length = 0;
            dateArray.length = 0;
            humiArr.length = 0;
            initMenu(district);
            initDraw(district);
        })

    }
    function initDraw(address) {
        $.ajax({
            type: "get",//默认是GET
            url: "http://39.106.172.170:8080/dailyWeather?address="+address,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                var info = data.data;
                var len = info.length;
                for (var i=0;i<len;i++){
                    dateArray.push(info[i].date);
                    highTemper.push(parseInt(info[i].high));
                    lowTemper.push(parseInt(info[i].low));
                    humiArr.push(parseInt(info[i].humidity));
                }
                draw1();
            }
        });

    }
    function draw1() {
        //获取湿度和温度变化
        var dom1 = document.getElementById("zhe1");
        var myChart1 = echarts.init(dom1);
        option1 = null;
        option1 = {
            title:{
                text: '湿度预测变化图',
                left: 'center',
                 textStyle: {
                      fontWeight: "normal",
                      color: "#fff",
                    },
            },
            tooltip: {
          //鼠标悬停提示内容
                trigger: 'axis',
                axisPointer: {
                type: "shadow",
                show:true
            },
          },

            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: dateArray,
                axisLine:{
                        lineStyle:{
                            color:'#fff',
                        }
                    }
            },
            yAxis: {
                type: 'value',
                axisLine:{
                        lineStyle:{
                            color:'#fff',
                        }
                    }
            },
            series: [{
                name: "湿度值",
                data: humiArr,
                type: 'line',
            }]
        };
        if (option1 && typeof option1 === "object") {
            myChart1.setOption(option1, true);
        }
        //图2
        var dom2 = document.getElementById("zhe2");
        var myChart = echarts.init(dom2);
        option = null;
        option = {
            title:{
                text: '温度预测变化图',
                left: 'center',
                textStyle: {
                    fontWeight: "normal",
                    color: "#fff",
                 },
            },
            tooltip: {
          //鼠标悬停提示内容
                trigger: 'axis',
                axisPointer: {
                type: "shadow",
                show:true
            },
          },
            legend: {
                x: '260px',
                y: '15px',
                orient: 'vertical',  //垂直显示
                color: "#fff",
                 textStyle: {
                     color: '#fff',
                 },
                data: ['最高温度', '最低温度']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: dateArray,
                axisLine:{
                        lineStyle:{
                            color:'#fff',
                        }
                    }
            },
            yAxis: {
                type: 'value',
                 axisLine:{
                        lineStyle:{
                            color:'#fff',
                        }
                    },
             },
            series: [
                {
                    name: "最高温度",
                    data: highTemper,
                    type: 'line',
                    color: "#FF9900",
                    axisLine:{lineStyle:{color:'#fff',}},
                },
                {
                    name: "最低温度",
                    data: lowTemper,
                    type: 'line',
                    color: "#33CCFF",

            }
            ],

};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}

    }
