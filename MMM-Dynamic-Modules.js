const DynModuleName = "MMM-Dynamic-Modules";


Module.register(DynModuleName,{
	defaults: {
		swapOrientation : false, 
		swapPayload : "",
		LandscapeConfig: "",
		PortraitConfig: ""
	},
	loaded: function(callback) {
		//this.finishLoading();
		Log.log(this.name + ' is loaded!');
		callback();
	},
		getStyles() {
		return ["MMM-Dynamic-Modules.css"];
	},
	start: function() {
		this.config.id = this.identifier;
		this.sendSocketNotification("CONFIG", this.config);
		Log.info("MMM-Dynamic-Modules config:" + this.config.swapOrientation);
	},
	notificationReceived(notification, payload, sender) {
		// Hook to turn off messages about notiofications, clock once a second
		
		if (this.config.swapOrientation && (notification === 'DOM_OBJECTS_CREATED')){
			Log.info("Notification Recieved in MMM-Dynamic-Modules:" + notification);
		//	Log.info("MMM-Dynamic-Modules SCREEN ORIENTATION = " + screen.orientation.type);
			
			if(screen.orientation.type.includes("landscape")){
				if(this.config.debug){
					Log.info("MMM-Dynamic-Modules LANDSCAPE ORIENTATION");
			
					Log.info("Attempting to set positions: " + this.config.LandscapeConfig);
				}
				this.setPositions(JSON.parse(JSON.parse(JSON.stringify(this.config.LandscapeConfig))));	
					
			}
			if(screen.orientation.type.includes("portrait")){
					if(this.config.debug){
					Log.info("MMM-Dynamic-Modules Portrait ORIENTATION");
					Log.info("Attempting to set positions: " + this.config.PortraitConfig);
				}						
			}
		}

		if(notification === 'CHANGE_POSITIONS'){
			this.setPositions(payload);
		}

		if(notification === 'CHANGE_POSITIONS_DEFAULTS'){
			this.setDefaults();
		}
	},
	
	setPositions: function(object) {
		//get data with:
		var modulenames = Object.keys(object);
		var values = Object.values(object);
		if(this.config.debug){
			Log.log(modulenames);
			Log.log(values);
			}
		const mod_config = this.config
		for (var i = 0; i < modulenames.length; i++) {
			
			//We are going to breaak this to return an array!
			let id = this.getid(modulenames[i]);
			
			
			for(var x = 0;x<id.length; x++){
				var selected_module = document.getElementById(id[x]);

				MM.getModules().withClass(modulenames[i]).enumerate(function(module) {
					
					if(mod_config.debug){
						Log.log("Working with " + modulenames[i]);
						Log.log(values[i].visible);
					}
					


					if (values[i].position) {
						Log.log("Moving " + modulenames[i] + " to " + values[i].position);
						
						var split_position = values[i].position.split("_");
						//var selected_module = document.getElementById(id);
						var region = document.querySelector('div.region.' + split_position[0] + '.' + split_position[1] + ' div.container');
						
						// Make sure the region is visible
						//ONLY CHANGE IF EXPLICITLY TOLD TO
						if(values[i].visible==true){
							if (region.style.display === 'none') {
								region.style.display = 'block';
							}
							
						}else if (values[i].visible==false){
							region.style.display = 'none'
						}

						// Move module
						region.appendChild(selected_module);

					}
		
		
					if(mod_config.debug){
						// Set the module visible after moving to trigger css opacity transition animation
							Log.log("Checking " + modulenames[i] + " visibility: " + values[i].visible);
					}
					//ONLY CHANGE IF EXPLICITLY TOLD TO
					if (values[i].visible==true) {
						module.show(1000, function() {});
						region.style.display = 'block';
					}else if (values[i].visible==false){
						module.hide(1000, function() {});
						selected_module.style.display= 'none';
					}
				});
			}
		}
	},

	setDefaults: function() {
		MM.getModules().enumerate(function(module) {
			if (module.data.position) {
				var split_position = module.data.position.split("_");
				var selected_module = document.getElementById(module.identifier);
				var region = document.querySelector('div.region.' + split_position[0] + '.' + split_position[1] + ' div.container');

				// Make sure the region is visible
				if (region.style.display === 'none') {
					region.style.display = 'block';
				}
				
				// Move module to its original position
				region.appendChild(selected_module);
				
				// Show module
				module.show(1000, function() {});
			}
		});
		
	},
	
	getid: function(mname) {
        const id = new Array;
                        
        MM.getModules().enumerate(function(module) {
            if (mname == module.name){
	            id.push(module.identifier);
            }
        });
        
        return id;
    },

});