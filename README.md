# virtual pad-App

这是一个虚拟摇杆App，方便开发者使用手机当遥控器 


目前可以使用websocket和socket通信
> socket只能上传摇杆数据和按键数据，格式和websocket一样


> websocket可以接受视频和其他数据，同时可以上传摇杆数据和按键数据

> 暂时没有蓝牙功能

# 在websocket下可以接收视频数据和两个简单的数据tp 和 hm，如下图

 ![image](https://github.com/TuShen121/virtualjoystick-App/blob/master/img/Screenshot_2019-04-28-16-19-09.png)
 
将图片的base64编码直接传到App就可以显示，
两个数据用` 0,x,x `格式，两个x就是要传的数据
二者放到不同的send()里
# 在websocket下，App上传的数据为两个摇杆数据和两个按键的值

 ![image](https://github.com/TuShen121/virtualjoystick-App/blob/master/img/QQ%E6%88%AA%E5%9B%BE20190428163549.jpg)
 
 # 以下是Python的代码，传输电脑摄像头的数据，你也可以传输树莓派的数据
 ```
 from simple_websocket_server import WebSocketServer, WebSocket
import cv2 as cv
import _thread
import base64


videocapture = cv.VideoCapture(0)   #打开摄像头

# 为线程定义一个函数
def print_time( threadName, client):
   while(True):
       ret, frame = videocapture.read()  # 读取一张图片
       cv.imshow("hh", frame)  # 显示图片
       cv.waitKey(100)
       try:
           frame=cv.resize(frame,(320,240))
           image = cv.imencode('.jpg', frame)[1]
           image_code = str(base64.b64encode(image))[2:-1]
           client.send_message('0,123,456')
           client.send_message(image_code)
       except:
           print()


class SimpleChat(WebSocket):
    def handle(self):
        print(self.data)


    def connected(self):
        print(self.address, 'connected')
        # 创建线程
        try:
            _thread.start_new_thread(print_time, ("Thread-1", self,))
        except:
            print("Error: 无法启动线程")

    def handle_close(self):
        print(self.address, 'closed')


# 服务器监听开始
server = WebSocketServer('', 8000, SimpleChat)
server.serve_forever()

 ```

