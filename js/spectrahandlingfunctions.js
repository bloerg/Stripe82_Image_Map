var F_AverageSpectrumBins = function(inputspectrum, newbinsize, normalizedoutput) {
    
    //make sure newbinsize is an integer and spectrum is an array
    newbinsize=Math.floor(newbinsize)
    if (typeof(newbinsize) == "number" 
        && Object.prototype.toString.call( inputspectrum ) === "[object Array]"
        && typeof(normalizedoutput) == "boolean")
    {
        
        //consider 1 = 0 and return the input spectrum
        if (newbinsize < 1) {
            return(inputspectrum);
        }
        
        //average over the given number of input bins
        else {
            var outputspectrum = [];
            var outputspectrumcount = 0;
            var outputspecmax=-9999;
            var outputspecmin=9999                        

            if (newbinsize > 1) {
                for (var inputspecbin = 0; inputspecbin < inputspectrum.length; inputspecbin=inputspecbin+newbinsize) {
                    var tempspecbinsum = 0;
                    var tempspecbinmembers = 0;
                    for (var tempspecbincount = 0; tempspecbincount < newbinsize; tempspecbincount++) {
                        
                        //ignore NaNs and not possibly not existing bins at the end of the spectrum
                        if (inputspectrum[inputspecbin + tempspecbincount] && 
                            typeof(inputspectrum[inputspecbin + tempspecbincount]) == "number")
                        {
                            tempspecbinsum = tempspecbinsum + inputspectrum[inputspecbin + tempspecbincount];
                            tempspecbinmembers++;
                        }

                        
                    }
                    if (tempspecbinmembers > 0 ) {
                        outputspectrum[outputspectrumcount]= tempspecbinsum / tempspecbinmembers;
                        outputspecmax=Math.max(outputspecmax, outputspectrum[outputspectrumcount]);
                        outputspecmin=Math.min(outputspecmin, outputspectrum[outputspectrumcount]);
                        outputspectrumcount++;
                    }                                
                }
                
            }
            //do normalization only
            if (newbinsize == 1) {
                for (var tempspecbincount = 0; tempspecbincount < inputspectrum.length ; tempspecbincount++) {
                    
                    //ignore NaNs and not possibly not existing bins at the end of the spectrum
                    if (inputspectrum[tempspecbincount] && 
                        typeof(inputspectrum[tempspecbincount]) == "number")
                    {
                        outputspectrum.push(inputspectrum[tempspecbincount]);
                        outputspecmax=Math.max(outputspecmax, outputspectrum[outputspectrum.length-1]);
                        outputspecmin=Math.min(outputspecmin, outputspectrum[outputspectrum.length-1]);

                    }

                    
                }                
            }
            if (normalizedoutput == true) {
                var outputspecheight = outputspecmax - outputspecmin;
                for (var count=0; count<outputspectrum.length; count++) {
                    outputspectrum[count] = Math.floor(256-256/outputspecheight*(outputspectrum[count]-outputspecmin));
                    
                }
            }
            return(outputspectrum)
        }
    }
    //fixme
    //else return error or inputspectrum??
}

var F_Normalize_Spectrum_To_Tile_Height = function(tile_size, zoom, input_spectrum) {
    var outputspectrum = [];
    //512k should be enough for everybody
    var outputspecmax = -9999;
    var outputspecmin = 9999;
    for (var count = 0; count< input_spectrum.length; count++) {
        //ignore NaNs and not possibly not existing bins at the end of the spectrum
        if (input_spectrum[count] && 
            typeof(input_spectrum[count]) == "number")
        {
            outputspectrum.push(input_spectrum[count]);
            outputspecmax=Math.max(outputspecmax, input_spectrum[count]);
            outputspecmin=Math.min(outputspecmin, input_spectrum[count]);            
        }
    }
    
    var outputspecheight = Math.ceil(outputspecmax - outputspecmin);
    for (var count = 0; count < outputspectrum.length; count++) {
 
        outputspectrum[count] = Math.floor(tile_size/Math.pow(2,12-zoom) - 1 - (tile_size/Math.pow(2,12-zoom) / outputspecheight * (outputspectrum[count]-outputspecmin)));
    }
    return (outputspectrum);
}
