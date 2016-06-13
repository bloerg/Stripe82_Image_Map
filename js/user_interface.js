      $(function() {
        $( "#user_selection_layers" ).accordion({
          collapsible: false,
          header: "> div > h3"
        });
      });
      


    $("#set_spectrum_foreground_color_button").click(function() {
        var color_to_set = $("#foreground_color_input_field").val()
        if (color_to_set == "" ) {
            spec_foreground_color=$("#foreground_color_input_field").attr("placeholder");
        }
        else {
            spec_foreground_color=color_to_set;
        }
    }); 
    $("#set_spectrum_background_color_button").click(function() {
        var color_to_set = $("#background_color_input_field").val()
        if (color_to_set == "" ) {
            spec_background_color=$("#background_color_input_field").attr("placeholder");
        }
        else {
            spec_background_color=color_to_set;
        }
    });
    
    $("#goto_map_coordinate_button").click(function() {
        //map.setView(new L.LatLng(tile2lat(123,11), tile2long(456,11)), 11);
        var xy_array=Papa.parse( $( "#goto_map_coordinate_input" ).val() );
        if (xy_array.data.length == 0) {
            xy_array = Papa.parse( $( "#goto_map_coordinate_input" ).attr("placeholder") );
            map.panTo( new L.LatLng( tile2lat(xy_array.data[0][1],12), tile2long(xy_array.data[0][0],12) ) );
        }
        else if(xy_array.data[0] && xy_array.data[0].length == 2) {
            map.panTo( new L.LatLng( tile2lat(xy_array.data[0][1],12), tile2long(xy_array.data[0][0],12) ) );
        }
    });

    $( "#goto_map_coordinate_input" ).keypress(function( event ) {
        if ( event.which == 13 ) {
            var xy_array=Papa.parse( $( "#goto_map_coordinate_input" ).val() );
            if (xy_array.data.length == 0) {
                xy_array=Papa.parse( $( "#goto_map_coordinate_input" ).attr("placeholder") );
                map.panTo( new L.LatLng( tile2lat(xy_array.data[0][1],11), tile2long(xy_array.data[0][0],11) ) );
            }
            else if(xy_array.data[0] && xy_array.data[0].length == 2) {
                map.panTo( new L.LatLng( tile2lat(xy_array.data[0][1],11), tile2long(xy_array.data[0][0],11) ) );
            }        
        }
    });

    $("#csv_import_button").click(function() {
        var layer_name = $("#add_new_layer_name").val()
        var csv_import = Papa.parse( $("#csv_import_textarea").val(), {
            header: true, 
            dynamicTyping: true, 
            skipEmptyLines: true
        });
        console.log(csv_import.meta.fields)
        if ((csv_import.data && csv_import.data.length > 0) 
            && (csv_import.meta.fields[0] == "som_x" || csv_import.meta.fields[1] == "som_x") 
            && (csv_import.meta.fields[0] == "som_y" || csv_import.meta.fields[1] == "som_y")
        )
        {
            
            $.ajax({
                url: "cgi-bin/adduserdefinedselection.cgi",
                type: "POST",
                data: {som_keys:JSON.stringify(csv_import.data), tag: layer_name},
                dataType: "json",
                success: function(data) {
                    console.log(data)

                },
                error: function(status) {
                    console.log(status);
                }
            });
            
        }
        if ((csv_import.data && csv_import.data.length > 0) 
            && (csv_import.meta.fields[0] == "mjd" || csv_import.meta.fields[1] == "mjd" || csv_import.meta.fields[2] == "mjd")
            && (csv_import.meta.fields[0] == "plateid" || csv_import.meta.fields[1] == "plateid" || csv_import.meta.fields[2] == "plateid")
            && (csv_import.meta.fields[0] == "fiberid" || csv_import.meta.fields[1] == "fiberid" || csv_import.meta.fields[2] == "fiberid")
        )
        {
            $.ajax({
                url: "cgi-bin/adduserdefinedselection.cgi",
                type: "POST",
                data: {spec_ids:JSON.stringify(csv_import.data), tag: layer_name},
                dataType: "json",
                success: function(data) {
                    console.log(data)

                },
                error: function(status) {
                    console.log(status);
                }
            });            
            
        }
    });    
