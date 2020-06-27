# WeatherUI
B测作业前端

****

2020-06-27

**修复一些小bug**

1. 请求时出现<font color=red>map.Ka() is not a function</font>,这是请求百度地图api接口时出现的错误，具体原因不知道，在百度地图申请key时设置白名单为*即可。ps:不改问题也不大，就是打开浏览器控制台看着别扭。
2. 地图时而正常显示，时而显示出错，控制台没有报错，查看代码后发现终究还是异步请求惹的祸，


```javascript
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
            }
        });

    });
    window.onload=function () {
        initMenu("");
        initMap();

    };

```
initMap()方法依赖于ajax请求获得的city的值，所以地图是否初始化成功取决于ajax获取city数据的快慢，解决方案很多，这里直接把initMap()移动到ajax success函数里。