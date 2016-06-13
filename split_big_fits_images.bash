
# filenames are f[vertical][horizontal]_rdeep.fits
# for example f2104_rdeep.fits

# the input fits files have 4553x4553 pixels
# 4553 / 29 = 157
# this is why the fits files are devided into 29 pieces 
# with with x height = 157 x 157


source_dir="./Stripe82Coadds"
dest_dir="./splitfits3"

for v in {1..5} ; do
    for h in {1..220}; do
        #leftpad with 0
        horizontal=$((1000 + h))
        horizontal=${horizontal:1:4}
        vertical=$v
        mkdir -p "$dest_dir/$horizontal$vertical"
        for local_y in {0..28} ; do 
            for local_x in {0..28} ; do 
#                global_x=$(( (h-1) * 29 + local_x))
 #               global_y=$(( 29 * (v - 1) + ( 28 - local_y) ))                    
                #python fitscrop.py -i ./f"$horizontal""$vertical"_rdeep.fits -o ./splitfits3/$global_x-$global_y.fits -B $((0+$x*157)) $((156+$x*157)) $((156+$y*157)) $((0+$y*157))
                # y-coordinates have to be swapped because y=0 is the bottom of images in FITS
                # wheras y=0 is the top in the slippymap
                if [[ ! -f $dest_dir/$horizontal$vertical/$local_x-$((28 -local_y)).fits ]] ; then
                    python fitscrop.py -i $source_dir/f"$horizontal""$vertical"_rdeep.fits -o $dest_dir/$horizontal$vertical/$local_x-$((28 -local_y)).fits -B $((0+$local_x*157)) $((156+$local_x*157)) $((156+$local_y*157)) $((0+$local_y*157))
                    echo python fitscrop.py -i $source_dir/f"$horizontal""$vertical"_rdeep.fits -o $dest_dir/$horizontal$vertical/$local_x-$((28 -local_y)).fits -B $((0+$local_x*157)) $((156+$local_x*157)) $((156+$local_y*157)) $((0+$local_y*157))
                fi
            done
        done
    done
done



cd "$dest_dir"
mkdir -p "map"
cd "map"

for v in {1..5} ; do
    for h in {1..220}; do
        #leftpad with 0
        horizontal=$((1000 + h))
        horizontal=${horizontal:1:4}
        vertical=$((5-v))

        for x in {0..28}; do 
            for y in {0..28}; do 
                # make and cd dir for y coordinate
                mkdir -p $(( y + 29*vertical ))
                cd $(( y + 29*vertical ))
                # y coordinates are swapped in the process of fitscropping (see above)
                # no need to swap them again!
                ln -s ../../$horizontal$v/$x-$y.fits $(( x+29*(220-h) ))-$(( y + 29*vertical )).fits 
                cd ..
            done
        done
    done
done
