/*

Read in file(s) from user's local machine via "input type='file'" 
on html form located in import_menu template of main.html. 
Parse file contents and add new_material to 'mats' (Mongo materials
Collection). 	

*/


if (Meteor.isClient){

	function parse_and_save(material){
		//	Parse raw data content from user-specified file and 
		// 	add atom attributes to 'material' object via atom_list.
		//	Call meteor method to save data to 'mats' database
		// 	and set session 'current_material' to new material
		
		var content_lines = material.file_content.split('\n');
		switch ( material.file_ext ){
			case 'xyz':
				material.atom_count = content_lines[0].trim();
				material.name = content_lines[1].trim();
				material.atom_list = [];
			
				for ( i=2; i<content_lines.length; i++ ){
				
					if ( content_lines[i].length < 2 ){								// ignore extraneous lines in data
						continue;
					}
				
					line_array = $.map( content_lines[i].split(' '), function(j){	// extract array from multi-spaced line
						if ( j.trim().length > 0 ){
							return j.trim();
						}
					});
				
					material.atom_list.push({										// populate atom_list with atom identity & coordinates
						atom: line_array[0],
						x	: line_array[1].substring(0,1) == '-' ? line_array[1] : '+'+line_array[1], 
						y	: line_array[2].substring(0,1) == '-' ? line_array[2] : '+'+line_array[2], 
						z	: line_array[3].substring(0,1) == '-' ? line_array[3] : '+'+line_array[3] 
					});
				}
		
			default:				

				Meteor.call( 'add_material', material, function(err, mat_id){				
					if ( ! err ){
						
						Session.set('current_material_id', mat_id);
						display_material(mat_id);
	
					}
				});
				
		}
	}


	function read_local_files(evt) {	
		// 	Retrieve content from user-selected file 
		//	(or process multiple files iteratively)
		 
		var files = evt.target.files;
	
		if (files){
			for (var i=0, f; f=files[i]; i++){
				var r = new FileReader();
				r.onload = (function(f){
						return function(e){
							var content = e.target.result;
							var new_material = {
								file_name		: f.name,
								file_ext		: f.name.split('.').pop(),
								file_type 		: f.type,
								file_size 		: f.size,
								file_content	: content
							}
							parse_and_save(new_material);
						};
				})(f);
				r.readAsText(f);
			}
		}
		else{
			con('File not present');
		}
	}
					
					
	

	//Open filesystem browser from custom button

	$(document).on('change', '#import_local_input', function(event){
		read_local_files(event);
	});

}