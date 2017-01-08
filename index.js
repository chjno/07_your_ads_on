var creds = require('./creds.js');
var twit = require('twit');
var T = new twit(creds);
var fs = require('fs');
var webshot = require('webshot');
// var easyimg = require('easyimage');
// var sizeOf = require('image-size');

// var crop = function(offset, idx, dim){
//   easyimg.crop({
//     src:'bb.png', dst:'bb' + idx + '.png',
//     cropwidth:dim.width, cropheight:1024,
//     x:0, y:offset,
//     gravity: 'North'
//   }).then(
//     function(image) {
//       console.log('Cropped: ' + image.width + ' x ' + image.height);
//     },
//     function (err) {
//       console.log(err);
//     }
//   );
// };

var tweet = function(image){
  console.log('tweet: start');

  var b64content = fs.readFileSync(image, { encoding: 'base64' });
  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    var mediaIdStr = data.media_id_string;
    var meta_params = { media_id: mediaIdStr};

    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        var params = {
          // status: text,
          media_ids: [mediaIdStr]
        };

        T.post('statuses/update', params, function (){
          console.log('tweeted');
        });
      }
    });
  });
};

var shoot = function(){

  var options = {
    windowSize: {
      width: 1024
    },
    shotSize: {
      width: 'all',
      // height: 'all'
      height: 1024
    }
    // renderDelay: 15000
  };

  webshot('www.breitbart.com', 'bb.png', options, function(err) {
      if (err){
        console.log('error');
        console.log(err);
      } else {
        console.log('shot');

        tweet('bb.png');

        // var y = 0;
        // var index = 0;
        // var dims = sizeOf('bb.png');
        // console.log(dims.height);

        // while (y + 1024 < dims.height){
        //   crop(y, index, dims);
        //   y += 1024;
        //   index++;
        // }
      }
    }
  );
};

shoot();
setInterval(shoot, 3600000);
