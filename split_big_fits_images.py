#!/usr/bin/python
# -*- coding: utf-8 -*-

from copy import deepcopy
import sys
import os
import argparse
from astropy import wcs
from astropy.io import fits
## or
#import pyfits as fits


def convert_coordinates_to_pix(coordinate_format, fits_header, (left, right, top, bottom)):
    if (coordinate_format == "pixel"):
        return (left, right, top, bottom)
    if (coordinate_format == "degree"):
        w = wcs.WCS(fits_header)
        boundaries = [[left, top], [right, bottom]]
        [[pix_left, pix_top], [pix_right, pix_bottom]] = w.wcs_world2pix([[left, top], [right, bottom]] , 1)
        return (pix_left, pix_right, pix_top, pix_bottom)
        

def fitscrop(fits_image, (left, right, top, bottom)):
    
    if (left < 0.0 or len(fits_image[0]) < right or top < 0.0 or len(fits_image[1]) < bottom):
        sys.stderr.write("Warning: image coordinates out of boundary. Returning empty FITS image.\n")
    return fits_image[int(bottom):int(top +1), int(left):int(right+1)]



if __name__ == '__main__':

    #input parameter parsing
    parser = argparse.ArgumentParser()
    coordinates = parser.add_mutually_exclusive_group(required=True)
    parser.add_argument("-i", "--inputfile", type=str, required=True, help="Path to a FITS file containing an image.")
    parser.add_argument("-o", "--outputfile", type=str, required=True, help="Path to a FITS file which will contain the cropped image.")
    parser.add_argument("-H", "--hdu", type=int, default=0, help="Number of the Header Data Unit containing the image within the input file. The first HDU has the number 0.")
    parser.add_argument("-c", "--coordinate_format", type=str, default="pixel", help="Format of the cropping coordinates (-l, -r, -t -b). One of {pixel, degree}.")
    coordinates.add_argument("-C", "--center", nargs=3, type=float, help="Cropping coordinates (RA in degree or x in pixel, DEC in degree or y in pixel, Radius in arcsec or pixel). Unit depending on the -c flag.")
    coordinates.add_argument("-B", "--boundary", nargs=4, type=float, help="Cropping boundary coordinates (Left, Right, Top, Bottom in degree or pixel. Unit depending on the -c flag.")

    
    #args = parser.parse_args()    

    #~ if ( args.boundary != None ):
        #~ args_left = args.boundary[0]
        #~ args_right = args.boundary[1]
        #~ args_top = args.boundary[2]
        #~ args_bottom = args.boundary[3]
    #~ if ( args.center != None):
        #~ radius_degrees = args.center[2] / 3600.0
        #~ args_left = args.center[0] + radius_degrees
        #~ args_right = args.center[0] - radius_degrees
        #~ args_top = args.center[1] + radius_degrees
        #~ args_bottom = args.center[1] - radius_degrees
    
    source_dir="./Stripe82Coadds"
    dest_dir="./splitfits4"

    for v in xrange(1,6):
        for h in xrange(1,221):
            #leftpad with 0
            horizontal=''.join(('000', str(h)))
            horizontal= horizontal[-3:]
            vertical=str(v)
            try:
                input_file=source_dir + '/f' + horizontal + vertical + '_rdeep.fits'
                ## open input fits file
                f_input = fits.open(input_file)
                if not os.path.exists(dest_dir + '/' + horizontal + vertical):
                    os.makedirs(dest_dir + '/' + horizontal + vertical)
                for local_y in xrange(0,29):
                    for local_x in xrange(0,29):
                        ## stop processing if hdu parameter is out of boundary
                        hdu=0
                        ## read fits header
                        fits_header = f_input[hdu].header
                        fits_output_header = deepcopy(fits_header)
                        ## check if image is two dimensional
                        if (fits_header['naxis'] == 2):
                            #~ ## read fits image
                            fits_image = f_input[hdu].data
                            boundary = (int(0+local_x*157), int(156+local_x*157), int(156+local_y*157), int(0+local_y*157))
                            pixel_coordinates = convert_coordinates_to_pix("pixel", fits_header, boundary)
                            print ("pixel_coordinates", pixel_coordinates)
                            #~ ## correct the header
                            fits_output_header['CRPIX1'] = fits_header['CRPIX1'] - pixel_coordinates[0]
                            fits_output_header['CRPIX2'] = fits_header['CRPIX2'] - pixel_coordinates[3]
                            #~ ## write to output file
                            output_file = dest_dir + '/' + horizontal + vertical + '/' + str(local_x) + '-' + str(28 - local_y) + '.fits'
                            try:
                                #f_output.writeto(output_file)
                                fits.append(output_file, fitscrop(fits_image, pixel_coordinates), header=fits_output_header)
                                print ("ok: " + output_file)
                            except:
                                sys.stderr.write("Error: cannot write to output file.\n")
                ## close input fits file
                f_input.close()
            except IOError:
                sys.stderr.write("Error: cannot open input file. (" + input_file + ") \n")
    
    

