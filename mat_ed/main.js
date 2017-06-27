/*
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
*/

/*

1. 	Get file(s) from user's local computer
2. 	Parse files and call 'add_material' method
3. 	add_material method sets current_material_id session
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
		Session.set('show_remote_files',false);
	});
	
	$(document).on('click','.editor_type',function(){		// set selected_editor session
		$('.editor_type').removeClass('selected_editor');
		$(this).addClass('selected_editor');
		Session.set('selected_editor', this.innerHTML);
		
	});
	
	$(document).on('click','*', function(e){
		/* 	Hide import_remote_dialog template if it is open and the user clicks elsewhere;
		 	Achieved by removing event bubbling and adding class 'remote_dialog_element' to
			all elements relevant to import_remote_dialog (including import_remote button
			in import_menu template)		*/
		
		e.stopPropagation();
		if ( ! $(this).hasClass('remote_dialog_element') && Session.get('show_remote_files') != false){
			Session.set('show_remote_files',false);
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
	//	TEMPLATE : VISUAL_EDITOR
	//----------------------
	Template.visual_editor.helpers({
		
	});	
	
	Template.menu.events({
		'click .editor_type': function(){
		}
	});
	
	
	
	
	Template.molecular_viewer.helpers({
		'material_content' : function(){
		}
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
	
	
	Template.test.events({
		'click #test_button' : function(){
			m = Session.get('glmol');
			con(m);
		}
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
		/*	Add material to 'mats' collection, uploaded from user's local filesystem. */
		
		var mat_id = mats.insert( material );	//removed {} from around material		
		return mat_id;
		
	}
	
});






