const { restApi } = require('./config');




restApi.listen(restApi.get('port'),'0.0.0.0',function(){
    console.log(`Server Started Running at ${restApi.get('port')}`);
})