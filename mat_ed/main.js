/*
1. 	Get file(s) from user's local computer
2. 	Parse files and call 'add_material' method
3. 	add_material method sets current_material_id session
		(import_remote also sets current_material_id session)
4. 	current_material_id fills code_editor with file data

*/



mats = new Mongo.Collection('materials');

//---------------------------------------

con = function(msg){console.log(msg)};




if (Meteor.isClient){
	
	//----------------------
	//	JQUERY HANDLERS
	//----------------------
	$(document).ready(function(){
		//Session.set('show_remote_files',true);				// show remote files on load for testing
		
	});
	
	$(document).on('click','.editor_type',function(){		// set selected_editor session
		$('.editor_type').removeClass('selected_editor');
		$(this).addClass('selected_editor');
		Session.set('selected_editor', this.innerHTML);
		
	});
	
	$(document).on('click','*', function(e){
		//	Hide popup windows when user clicks outside of them 
		
		e.stopPropagation();	//	eliminate event bubbling for determining clicked DOM element
		/* 	Hide import_remote_dialog template if it is open and the user clicks elsewhere;
		 	Achieved by removing event bubbling and adding class 'remote_dialog_element' to
			all elements relevant to import_remote_dialog (including import_remote button
			in import_menu template)		*/
		
		//	Hide remote_dialog
		if ( ! $(this).hasClass('remote_dialog_element') && Session.get('show_remote_files') != false){
			Session.set('show_remote_files',false);
		}
		
		//	Hide periodic _table
		if ( ! $(this).hasClass('ptable') && ! $(this).hasClass('code_editor_rt_atom') ){
			$('#periodic_table').addClass('hidden');
			$('.code_editor_rt_atom_clicked').removeClass('code_editor_rt_atom_clicked');
			Session.set('code_editor_rt_clicked_atom_index',null);
		}
		
	});
	
	$(document).on('click','.code_editor_rt_atom',function(){
		$('.code_editor_rt_atom_clicked').removeClass('code_editor_rt_atom_clicked');
		$(this).addClass('code_editor_rt_atom_clicked');
		for ( i=0; i < $('.code_editor_rt_atom').length; i++ ){		// get index of clicked atom in atom_list
			if ( $($('.code_editor_rt_atom')[i]).hasClass('code_editor_rt_atom_clicked') ){
				Session.set('code_editor_rt_clicked_atom_index',i);
				break;
			}			
		}
		
	});
	//----------------------END
	
	
	//----------------------
	//	TEMPLATE : CODE_EDITOR
	//----------------------
	Template.code_editor.events({

	});
	
	
	Template.code_editor.helpers({
		'material_content' : function(){
			var mat_id = Session.get('current_material_id');
			if (mat_id){
				$('#code_editor_header').addClass('selected_editor');
				var content = mats.findOne({ _id: mat_id }).file_content;
				return content;
			}	
		}
	});
	//----------------------END
	
	
	
	//----------------------
	//	TEMPLATE : PERIODIC_TABLE
	//----------------------
	Template.periodic_table.events({
		'click .element' : function(e){
		
			var mat_id = Session.get('current_material_id');
			var old_atom_index = Session.get('code_editor_rt_clicked_atom_index');
			var new_atom = e.target.innerHTML;
			
			Meteor.call('update_atom', mat_id, old_atom_index, new_atom, function(err, mat_id){
				if ( ! err ){
					Session.set('current_material_id',mat_id);
					display_material( mat_id );
				}
			});
			
		}
	});
		
	Template.periodic_table.helpers({		
	});
	//----------------------END
	
	
	//----------------------
	//	TEMPLATE : CODE_EDITOR_RT
	//----------------------
	Template.code_editor_rt.events({
		'click .code_editor_rt_atom' : function(e){

			$('#periodic_table')
				.removeClass('hidden')
				.css({ 
					'margin-left'	: e.pageX + 'px', 
					'margin-top'	: e.pageY + 'px'
				})
			;
		}
	});
		
	Template.code_editor_rt.helpers({		
		'atom_list' : function(){
			var mat_id = Session.get('current_material_id');		
			if ( mat_id ){
				//var metadata = mats.findOne({ _id:mat_id }).
				$('#code_editor_header').addClass('selected_editor');
				var atom_list = mats.findOne({ _id:mat_id }).atom_list;
				return atom_list;
			}
		}
	});
	
	$(document).on('click','.code_editor_rt_atom', function(){
		$(this).addClass('.code_editor_rt_atom_clicked');
	});
	//----------------------END
		
	
	//----------------------
	//	TEMPLATE : IMPORT_MENU
	//----------------------
	Template.import_menu.events({
		'click #import_local' : function(){
			/*
				Simulate/transfer input click event to open file dialog
				read_local_files.js monitors changes to #import_local_input
				and responds by parsing data and saving to database 'mats'	
			*/		
			$('#import_local_input').click();	
		},
		
		'click #import_remote' : function(e){
			Session.get('show_remote_files') ? pos = false : pos = {x: e.pageX, y: e.pageY};
			Session.set('show_remote_files', pos);
		}
		
	});
	//----------------------END
	
	
	//----------------------
	//	TEMPLATE : IMPORT_REMOTE_DIALOG
	//----------------------
	Template.import_remote_dialog.events({
		'click #cancel_import_remote' : function(){
			Session.set('show_remote_files',false);
		}, 
		'click .remote_file' : function(){
			Session.set('current_material_id', this._id);
			Session.set('show_remote_files',false);
			
			display_material( this._id );
	
		}
	});
	
	
	Template.import_remote_dialog.helpers({
	 	'remote_files_list' : function(){
	 		var files = mats.find().fetch();
	 		return files;	 		
		},
		'remote_fileslist_coords_x' : function(){
			return Session.get('show_remote_files').x;
		},
		'remote_fileslist_coords_y' : function(){
			return Session.get('show_remote_files').y;
		}
	});
	//----------------------END
		
	
	Template.registerHelper('session', function( value ){
		return Session.get(value);
	});
	
	
	//
	//
	//	DISPLAY MATERIAL : REMOVE CANVAS AND CREATE NEW GLMOL INSTANCE
	//
	//
	
	display_material = function( mat_id ){
		$('canvas').remove();
		var glmol = new GLmol('glmol_viewer');
	}	
}



if (Meteor.isServer){
}


Meteor.methods({
	
	
	'add_material': function( material ){
		/*	Add material to 'mats' collection, uploaded from user's local filesystem. 
			new material is generated in read_local_files.js	*/
		
		var mat_id = mats.insert( material );	//removed {} from around material		
		return mat_id;
		
	},
	'update_atom': function(mat_id, old_atom_index, new_atom){
		/* new atom selection from periodic table popup */
		con(mat_id);
		con(old_atom_index);
		con(new_atom);
		
		var atom_list = mats.findOne({ _id : mat_id }).atom_list; 
		
		
		
		atom_list[old_atom_index].atom = new_atom; 
		

		
		mats.update(
			{ _id : mat_id }, 
			{ '$set' : { 'atom_list' : atom_list } }
		);
		
		return mat_id;
		
	}
	
	
	//		Meteor.call('updateAtom', mat_id, old_atom_index, new_atom);
	
});






