// Dependables
import ee from '@google/earthengine'
import React from 'react';
import './Home.css';
import TextField from '@material-ui/core/TextField';

class Home extends React.Component {  
    constructor(props) {
        super(props);
        this.state = {
            runState: false,
            Sdate: 'he',
            Edate: 'he',
            Email: 'x',
            Reason: 'd'
        }
    }
    startGenerate = () => {
        this.setState({ runState: true })
        var test = function() {
            ee.initialize();
            // Run an Earth Engine script.
            // Load a landsat image and select three bands.
            var landsat = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_123032_20140515')
                .select(['B4', 'B3', 'B2']);

            // Create a geometry representing an export region.
            var geometry = ee.Geometry.Rectangle([116.2621, 39.8412, 116.4849, 40.01236]);

            // Export the image, specifying scale and region.
            console.log(landsat)
            
          };
          
          
          // Authenticate using an OAuth pop-up.
          ee.data.authenticateViaOauth(
              "541524487645-20rdntv0cn6sh309q2vqmjeipri8tbr0.apps.googleusercontent.com", 
              test, function(e) {
            console.error('Authentication error: ' + e);
          }, null, function() {
            ee.data.authenticateViaPopup(test);
          });
        
        
    }
    render() {
        return (
            <div>
                <form noValidate autoComplete="off">
                    <TextField id="standard-basic" label="Standard" />
                    <TextField id="filled-basic" label="Filled" variant="filled" />
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                </form>
                <button onClick={this.startGenerate}>
                    Generate Mosaic(s)</button>
            </div>
        )
    }
}

export default Home;
