document.addEventListener( "plusready",  function()
{
    var _BARCODE = 'tcpSocket',
        B = window.plus.bridge;
    var tcpSocket =
    {
        connect : function (IP, PORT,successCallback, errorCallback )
        {
            var success = typeof successCallback !== 'function' ? null : function(args) 
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code) 
            {
                errorCallback(code);
            };
            callbackID = B.callbackId(success, fail);

            return B.exec(_BARCODE, "connect", [callbackID, IP, PORT]);
        },
        send : function (message,successCallback )
        {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            };
            callbackID = B.callbackId(success, success);
            return B.exec(_BARCODE, "send", [callbackID,message]);
        },
        onMessage : function (successCallback)
        {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            };
            callbackID = B.callbackId(success, null);
            return B.exec(_BARCODE, "onMessage", [callbackID]);
        },
        onClose : function (successCallback)
        {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            };
            callbackID = B.callbackId(success, null);
            return B.exec(_BARCODE, "onClose", [callbackID]);
        },
         close : function (successCallback)
         {
             var success = typeof successCallback !== 'function' ? null : function(args)
             {
                 successCallback(args);
             };
             callbackID = B.callbackId(success, null);
             return B.exec(_BARCODE, "close", [callbackID]);
         },
    };
    window.plus.tcpSocket = tcpSocket;
}, true );