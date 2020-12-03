// Functions
var addNDVI2 = function(image) {
    var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
    return(image.addBands(ndvi));
}
var addYear = function(image) {
  var doy = image.date().get('year');
  var doyBand = ee.Image.constant(doy).uint16().rename('year')
  doyBand = doyBand.updateMask(image.select('B8').mask())

  return image.addBands(doyBand);
}

var addMonth = function(image) {
  var doy = image.date().get('month');
  var doyBand = ee.Image.constant(doy).uint16().rename('month')
  doyBand = doyBand.updateMask(image.select('B8').mask())

  return image.addBands(doyBand);
}

var addDay = function(image) {
  var doy = image.date().get('day');
  var doyBand = ee.Image.constant(doy).uint16().rename('day')
  doyBand = doyBand.updateMask(image.select('B8').mask())

  return image.addBands(doyBand);
}

var getId = function(obj) {
  var lat = obj.lat
  var lon = obj.lon
  var point = ee.Geometry.Point([lon, lat])
  var date = get_value(greenest, point, 30).get('date')
  date = ee.Date(ee.Number(date).multiply(1000).multiply(3600))
  print(date)
  var img = ee.Image(imageCol[counter-1].filterDate(date, date.advance(1, 'day')).first())
  print('Img id in point ['+lon+","+lat+"] is", img.id())
  print('Gain: ', img.get('REFLECTANCE_MULT_BAND_1'))
  print('Offset: ', img.get('REFLECTANCE_ADD_BAND_1'))
}

var getQABits = function(image, start, end, newName) {
    // Compute the bits we need to extract.
    var pattern = 0;
    for (var i = start; i <= end; i++) {
       pattern += Math.pow(2, i);
    }
    // Return a single band image of the extracted QA bits, giving the band
    // a new name.
    return image.select([0], [newName])
                  .bitwiseAnd(pattern)
                  .rightShift(start);
};

// A function to mask out cloudy pixels.
var cloud_shadows = function(image) {
  // Select the QA band.
  //var QA = image.select(['BQA']);
  var QA = image.select(['pixel_qa']);
  // Get the internal_cloud_algorithm_flag bit.
  //return getQABits(QA, 7,8, 'cloud_shadows').eq(1);
  return getQABits(QA, 3,3, 'cloud_shadows').eq(0);
  // Return an image masking out cloudy areas.
};

// A function to mask out cloudy pixels.
var clouds = function(image) {
  // Select the QA band.
  //var QA = image.select(['BQA']);
  var QA = image.select(['pixel_qa']);
  // Get the internal_cloud_algorithm_flag bit.
  //return getQABits(QA, 4,4, 'Cloud').eq(0);
  return getQABits(QA, 5,5, 'Cloud').eq(0);
  // Return an image masking out cloudy areas.
};

var maskClouds = function(image) {
  var cs = cloud_shadows(image);
  var c = clouds(image);
  image = image.updateMask(cs);
  return image.updateMask(c);
};


/////////////////////////
// Helper functions
/////////////////////////
var importImage = function(sDate, eDate, roi) {
  // Load the Landsat scaled radiance image collection.
  //select l8
  var s2 = ee.ImageCollection("COPERNICUS/S2_SR")
      .filterBounds(roi)
      .filterDate(sDate, eDate)
      //.filter(ee.Filter.lt('CLOUD_COVER', 10))
      //.select(['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'BQA'])
      //.sort('CLOUD_COVER',false)
      .filterMetadata('CLOUDY_PIXEL_PERCENTAGE','less_than',75);

  // Return the big collection to main
  return(s2);
}

var get_value = function(ogImg, geo, scale ) {
  var meanDictionary = ogImg.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: geo,
    scale: scale,
    maxPixels: 1e9
  });
  
  return(meanDictionary)
}

// Dependencies
var base = 2017
var cap = 2020
var start = '-06-01'
var end = '-08-31'
var sDate = base.toString()+start
var eDate = base.toString()+end
var imageCol = {}
var roi = ee.FeatureCollection('users/tonywangs/Envelope_LCC')
var counter = 0

//hi

// landsat 8 
// Fetch images from GEE and store them in their respective collections
startFunc = () => {
    for (var i = base; i <= cap; i++) {
        sDate = i.toString()+start
        eDate = i.toString()+end
        var Sent2Collection = importImage(sDate, eDate, roi)
        
        // Check if aggregated image collection is empty
        if (imageCol[counter] === undefined) {
            imageCol[counter] = Sent2Collection
        }
        else {
        imageCol[counter] = imageCol[counter].merge(Sent2Collection)
        }
        //print(imageCol[counter])
        if ((i-base)%2 === 0) {
            var name3 = (i-1)+'-'+i+'_'+'SENTINEL2'
            print(name3)
            // create an NDVI mask for each collection
            var withNDVI = imageCol[counter]
                .map(addNDVI2)
                //.map(addYear)
                //.map(addMonth)
                //.map(addDay)
                //.map(maskClouds);
            //var onlyNDVI = withNDVI.select(['NDVI'])
            print(withNDVI)
            var greenest = withNDVI.qualityMosaic('NDVI')

            
            // Display the result
            var display = {bands: ['B4', 'B3', 'B2']}
            Map.addLayer(greenest, display, name3)
            
            
            // Export to GDrive
            
            //print('Projection, crs, and crs_transform:', exportedImg.projection());
            //print('Scale in meters:', exportedImg.projection().nominalScale());
            var exportedImg = withNDVI
            Export.image.toDrive({
                image: exportedImg,
                folder: 'LANDSAT 8',
                description: name3+"_MOSAIC",
                fileFormat: 'GeoTIFF',
                region: roi,
                maxPixels: 1116247392, // value set only for exporting true-resolution LANDSAT scene
                crs: 'EPSG:2958'
            })
            /*
            Export.table.toDrive({
                collection: imageCol[i],
                description:  i.toString()+"_META",
                fileFormat: 'CSV'
            })
            */
            counter++
        }
    }
}