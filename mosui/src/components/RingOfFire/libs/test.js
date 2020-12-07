var importImage = function(sDate, eDate, roi) {
    // Load the Landsat scaled radiance image collection.
    //select l8
    var s2 = ee.ImageCollection("COPERNICUS/S2_SR")
        .filterBounds(roi)
        .filterDate(sDate, eDate)
        .filterMetadata('CLOUDY_PIXEL_PERCENTAGE','less_than',75);
  
    // Return the big collection to main
    return(s2);
  }

startFunc = () => {
    ee.initialize();

}