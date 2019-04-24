package com.example.TcpSocket;

import org.json.JSONArray;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.net.SocketTimeoutException;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.StandardFeature;
import io.dcloud.common.util.JSUtil;

/**
 * 5+ SDK 扩展插件示例
 * 5+ 扩扎插件在使用时需要以下两个地方进行配置
 *      1  WebApp的mainfest.json文件的permissions节点下添加JS标识
 *      2  assets/data/properties.xml文件添加JS标识和原生类的对应关系
 * 本插件对应的JS文件在 assets/apps/H5Plugin/js/test.js
 * 本插件对应的使用的HTML assest/apps/H5plugin/index.html
 *
 * 更详细说明请参考文档http://ask.dcloud.net.cn/article/66
 * **/
public class TcpSocket extends StandardFeature
{
    private IWebview onMessageWebview;
    private String onMessageCallBackID;

    private IWebview onCloseWebview;
    private String onCloseCallBackID;

    private Socket socket=null;

    private InputStream in;
    private OutputStream out;

    private IWebview connectWebview;
    private String connectCallback;

    private String IP;
    private int Port;
    public void connect( IWebview pWebview,  JSONArray array)
    {
        connectWebview = pWebview;
        connectCallback = array.optString(0);
        IP = array.optString(1);
        Port = array.optInt(2);
//        System.out.println(">>>>>>>>>>>>>>>connect>>>>>>>>>>>>>>>收到消息");
//        System.out.println(">>>>>>>>>>>>>>>connect>>>>>>>>>>>>>>>"+array);
        new Thread(){
            public void run() {
                if(socket==null){
                    try {
                        socket = new Socket(IP,Port);
                        in = socket.getInputStream();
                        out = socket.getOutputStream();
                        JSUtil.execCallback(connectWebview, connectCallback, "连接成功", JSUtil.OK, false);
//                        System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>connect连接成功");
                    } catch (SocketTimeoutException e) {
//                        System.out.println(">>>>>>>>SocketTimeoutException>>>>>>>>>>>>>>>>connect连接失败");
                        socket=null;
                        JSUtil.execCallback(connectWebview,connectCallback , "连接失败", JSUtil.ERROR, false);
                    } catch (IOException e) {
//                        System.out.println(">>>>>>>IOException>>>>>>>>>>>>>>>>>connect连接失败");
                        socket=null;
                        JSUtil.execCallback(connectWebview,connectCallback , "连接失败", JSUtil.ERROR, false);
                    }
                }
            }
        }.start();
    }
    public void send(IWebview pWebview, JSONArray array)
    {
        String CallBackID = array.optString(0);
//        System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>send收到消息");
        if (socket!=null){
            try {
                out.write(array.optString(1).getBytes());
                JSUtil.execCallback(pWebview, CallBackID, "消息已发送", JSUtil.OK, false);
//                System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>send发送成功");
            } catch (IOException e) {
                e.printStackTrace();
//                System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>send发送失败");
                JSUtil.execCallback(pWebview, CallBackID, "消息发送失败，未知原因", JSUtil.OK, false);
            }
        }else {
            JSUtil.execCallback(pWebview, CallBackID, "消息发送失败，未连接", JSUtil.OK, false);
        }
    }
    public void onMessage(IWebview pWebview, JSONArray array)
    {
        onMessageWebview = pWebview;
        onMessageCallBackID =array.optString(0);
//        System.out.println(">>>>>>>>>>onMessage正在运行 callback代码>>>>>>>>>"+onMessageCallBackID);
        new Thread(){
            @Override
            public void run() {
                while(true){
                    String str=null;
                    if(socket!=null) {
                        try {
                            byte[] buf = new byte[1024];
                            int len = 0;
                            len = in.read(buf);
                            str = new String(buf, 0, len);
//                            System.out.println("onMessage收到消息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+str);
                            JSUtil.execCallback(onMessageWebview, onMessageCallBackID, str, JSUtil.OK, true);
                        } catch (IOException e) {
//                            System.out.println("onMessage不知道为啥出错>>>>>>>>>>>>>IOException>>>>>>>>>>>>>>>>>>"+str);
                            e.printStackTrace();
                        }catch (NullPointerException e){
//                            System.out.println("onMessage不知道为啥出错>>>>>>>>>>>>>NullPointerException>>>>>>>>>>>>>>>>>>"+str);
                        }catch (StringIndexOutOfBoundsException e){
//                            System.out.println("onMessage>>>>服务器主动断开连接>>>>>>>>>StringIndexOutOfBoundsException>>>>>>>>>>>>>>>>>>"+str);
                            JSUtil.execCallback(onCloseWebview, onCloseCallBackID, "连接被动断开", JSUtil.OK, true);
                            socket = null;
                        }
                    }
                }
            }
        }.start();
    }
    public void onClose(IWebview pWebview, JSONArray array)
    {
        onCloseWebview = pWebview;
        onCloseCallBackID = array.optString(0);
//        System.out.println(">>>>>>>>>>onMessage正在运行 callback代码>>>>>>>>>"+onMessageCallBackID);
        new Thread(){
            @Override
            public void run() {
//                while(true) {
//                    if(socket!=null) {
//                        JSUtil.execCallback(onCloseWebview, onCloseCallBackID, "连接被动断开", JSUtil.OK, true);
//                        System.out.println(">>>>>onClose>>>>>连接被动断开>>>>>>>>>>>>>>>>>>>");
//                    }
//                }
            }
        }.start();
    }
    public void close(IWebview pWebview, JSONArray array)
    {
//        System.out.println("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<主动断开连接>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        String CallBackID = array.optString(0);
        if(socket!=null)
            try {
                socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        socket=null;
        JSUtil.execCallback(pWebview, CallBackID, "关闭成功", JSUtil.OK, false);
    }
}