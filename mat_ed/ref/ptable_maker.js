/*
	Programmatically generate periodic table for atom selection when DOM loads; periodic table is hidden at first
*/

if (Meteor.isClient){

		function print(msg){$('#msgbox').append(msg);}	// print to screen
		function con(msg){console.log(msg);} 			// log to console
		
		var periodic_table_slots = ["0,0", "0,17", "1,0", "1,1", "1,12", "1,13", "1,14", "1,15", "1,16", "1,17", "2,0", "2,1", "2,12", "2,13", "2,14", "2,15", "2,16", "2,17", "3,0", "3,1", "3,2", "3,3", "3,4", "3,5", "3,6", "3,7", "3,8", "3,9", "3,10", "3,11", "3,12", "3,13", "3,14", "3,15", "3,16", "3,17", "4,0", "4,1", "4,2", "4,3", "4,4", "4,5", "4,6", "4,7", "4,8", "4,9", "4,10", "4,11", "4,12", "4,13", "4,14", "4,15", "4,16", "4,17", "5,0", "5,1", "5,2", "5,3", "5,4", "5,5", "5,6", "5,7", "5,8", "5,9", "5,10", "5,11", "5,12", "5,13", "5,14", "5,15", "5,16", "5,17", "6,0", "6,1", "6,2", "6,3", "6,4", "6,5", "6,6", "6,7", "6,8", "6,9", "6,10", "6,11", "6,12", "6,13", "6,14", "6,15", "6,16", "6,17"];
		/* 	Periodic_table_slots comes from an earlier version of this same script, 
			where the table is defined by manual element_box selection and then printed as a parsable string
		*/
		
		element_lines = (function(){
			/*	Element_data comes from mass_data_generator.py	
				It is parsed into a list of element_lines. 
				Each array entry of element_lines is an element object with:
					atomic_num
					element
					mw
				The data is called in this way:
					element_lines[3].atomic_num
			*/
			element_data = function(){/*		
				1 H 1.008
				2 He 4.0026
				3 Li 6.9409
				4 Be 9.0122
				5 B 10.811
				6 C 12.011
				7 N 14.0067
				8 O 15.9993
				9 F 18.9984
				10 Ne 20.18
				11 Na 22.991
				12 Mg 24.3051
				13 Al 26.9815
				14 Si 28.0855
				15 P 30.9738
				16 S 32.0644
				17 Cl 35.4527
				18 Ar 39.9477
				19 K 39.0983
				20 Ca 40.078
				21 Sc 44.9559
				22 Ti 47.8784
				23 V 50.9415
				24 Cr 51.9961
				25 Mn 54.938
				26 Fe 55.8468
				27 Co 58.9332
				28 Ni 58.6528
				29 Cu 63.5456
				30 Zn 65.3964
				31 Ga 69.7231
				32 Ge 72.5914
				33 As 73.9239
				34 Se 78.5604
				35 Br 79.9035
				36 Kr 83.8
				37 Rb 85.4678
				38 Sr 87.6166
				39 Y 88.9058
				40 Zr 91.2236
				41 Nb 92.9064
				42 Mo 95.9313
				43 Tc 97.9066
				44 Ru 101.0697
				45 Rh 102.9055
				46 Pd 106.4153
				47 Ag 107.8682
				48 Cd 112.4116
				49 In 114.8179
				50 Sn 118.7109
				51 Sb 121.7568
				52 Te 127.5882
				53 I 126.9045
				54 Xe 131.2931
				55 Cs 133.9067
				56 Ba 137.3269
				57 La 138.9054
				58 Ce 140.1149
				59 Pr 140.9076
				60 Nd 144.2423
				61 Pm 144.9127
				62 Sm 150.3602
				63 Eu 151.9646
				64 Gd 157.2521
				65 Tb 158.9253
				66 Dy 162.4975
				67 Ho 164.9303
				68 Er 167.2557
				69 Tm 168.9342
				70 Yb 173.0342
				71 Lu 174.9667
				72 Hf 178.4864
				73 Ta 180.9479
				74 W 183.8489
				75 Re 186.2067
				76 Os 190.2398
				77 Ir 192.2141
				78 Pt 195.0801
				79 Au 196.9666
				80 Hg 200.6395
				81 Tl 204.3833
				82 Pb 207.2169
				83 Bi 208.9804
				84 Po 208.9822
				85 At 208.9866
				86 Rn 216.5041
				87 Fr 219.0112
				88 Ra 227.0282
				89 Ac 227.0277
				90 Th 230.3676
				91 Pa 230.0345
				92 U 238.0289
				93 Np 237.0482
				94 Pu 241.3072
				95 Am 242.0591
				96 Cm 247.2707
				97 Bk 247.0703
				98 Cf 249.4089
				99 Es 253.0855
				100 Fm 255.0901
				101 Md 256.0936
				102 No 255.0932
				103 Lr 256.0988
				104 Rf 261.1088
				105 Db 262.1142
				106 Sg 266.1219
				107 Bh 264.1247
				108 Hs 269.1341
				109 Mt 268.1388
				110 Xa 271.1461
				111 Xb 272.1535
			*/}.toString().slice(15,-4);
			
			
			
			el_lines = element_data.split('\n');
			con( el_lines );
			element_lines = [];
			for ( i=0; i < el_lines.length; i++ ){
				
				if (el_lines[i].trim().length > 5){
				
					el_split = el_lines[i].trim().split(' ');
				
					atomic_num 	= el_split[0];
					element 	= el_split[1];
					mw			= el_split[2];
				
					element_lines.push({
						atomic_num	: atomic_num,
						element		: element, 
						mw			: mw
					});
				}
			}
			return element_lines;
		})();

		
		function ptable_maker(){
		/*	Iterate over main periodic table as rectangle of boxes (7 rows, 18 columns)
			using nested loops. 
			Create id for each element_box as its coordinates in the grid
			Check each id against pre-tabulated periodic_table_slots (i.e., spaces in the 
			grid that have elements, vs. empty grid spaces)		
		*/
			var c = 0;											// Counter value for iteration over periodic_table_slots 
			var el = 0;											// For iterating over element_list
			
			for (i=0; i < 7; i++){								// Nested for-loop generates rows/columns grid
				for (j=0; j < 18; j++){
				
					if (el == 56) el = 70;						// Skip lanthanides 
					if (el == 88) el = 102;						// Skip actinides
					if (el == element_lines.length) return;		// End loop if no more elements
				
					var id = String(i)+','+String(j);			// id based on grid position
					$('#periodic_table').append(				
						'<div id='+id+' class="ptable element_box"></div>'
					);
					if ( id == periodic_table_slots[c] ){
						$('.element_box').last()
							.addClass('element ')
							.html( element_lines[el].element
								//'<div class="ptable element_text">'+element_lines[el].element+'</div>'
							)
						;
						el++;			
						c++;
					
					}else{
						$('.element_box').last().addClass('non-element');
					}
				
				}
				$('#periodic_table').append('<br>');
				
			}
		
		};
		
		$(document).ready(function(){
			ptable_maker();
		});	
}