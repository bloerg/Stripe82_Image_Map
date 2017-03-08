# deepS82
A sky map of deep SDSS Stripe 82 imagery

## About
This software provides an interactive skymap of SDSS stripe 82 based on [leafletjs](http://leafletjs.com/) and [fitsjs](https://github.com/astrojs/fitsjs). See [https://deepS82.aspect-ui.de](https://deepS82.aspect-ui.de) for a running setup.

## Features
* panning in the map
* go to celestial coordinates (RA, DEC decimal) by the coordinate search on the left (magnifier symbol on the right)
* jump to coordinates by URL-Parameters: e. g. [http://deeps82.aspect-ui.de/map.html?ra=333.7997&dec=-0.7638]
* set minima and maxima values for plotting from the original fits files (contrast symbol on the right)
* click into the map and get popup showing RA, DEC and Links to SDSS Explorer/Navigator for the clicked coordinates
* extracting regions as fits files by the use of the selection tool (rectangle under the still unfunctional +/- buttons in the upper right)

## Planned features (in no particular order)
* change plot limits by mouse click and move similar to what DS9 profides
* user defined base for log plotting
* more plot scales (linear, quadratic, ...)
* more intuitive limit definition for inverse plotting
* automatic horizontal or vertical panning with user defined speed
* export selection with click to center and definition of cutting radius by mouse movement

## Setup
The software only provides the interface. The image data has to be generated. The setup at [https://deepS82.aspect-ui.de](https://deepS82.aspect-ui.de) is based on the the data of (http://www.iac.es/proyecto/stripe82/).

This data consists of 1100 FITS files of size 4553x4553 pixels the namim scheme of which is described in section 3.1 in the paper (http://www.iac.es/proyecto/stripe82/media/2016MNRAS.456.1359F.pdf). These FITS files are way too large to be downloaded and rendered by a browser. To this end each of the FITS files was cut into 29 by 29 cutouts measuring 157 by 157 pixels. DeepS82 expects these files in a directory structure named according to 

/tiles/FIELD/X-Y.fits

where FIELD has to be replaced by the FIELD identifier as described in the mentioned paper and X and Y are the coordinates of the cutouts within the field. X and Y each range from 0 to 28.

