const DynModuleName = "MMM-Dynamic-Modules";
const ScreenActive = true;

Module.register(DynModuleName,{
	defaults: {
		swapOrientation : false, 
		LandscapeConfig: "",
		PortraitConfig: "",
		UpdateNotifications: "DOM_OBJECTS_CREATED",
		PauseNotifications: "",
		ResumeNotifications:""
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
		
		if (ResumeNotifications.includes(notification)){
				ScreenActive = true;
			}
		if (PauseNotifications.includes(notification)){
				ScreenActive= false;
			}

		this.config.UpdateNotifications = this.config.UpdateNotifications + ",DOM_OBJECTS_CREATED"
		
		//Only process when not paused
		if(ScreenActive){
			if (this.config.swapOrientation && (this.config.UpdateNotifications.includes(notification))){
				Log.info("Notification Recieved in MMM-Dynamic-Modules:" + notification);
				
				Log.info("MMM-Dynamic-Modules SCREEN ORIENTATION = " + screen.orientation.type);
				Log.info("MMM-Dynamic-Modules SCREEN VISIBLE = " + document.visibilityState);
				
				if(screen.orientation.type.includes("landscape") && ScreenActive == true){
					if(this.config.debug){
						Log.info("MMM-Dynamic-Modules LANDSCAPE ORIENTATION");
				
						Log.info("Attempting to set positions: " + this.config.LandscapeConfig);
					}
					
					this.setPositions(JSON.parse(this.config.LandscapeConfig));	
						
				}
			
				if(screen.orientation.type.includes("portrait") && ScreenActive == true){
						if(this.config.debug){
							Log.info("MMM-Dynamic-Modules Portrait ORIENTATION");
							Log.info("Attempting to set positions: " + this.config.PortraitConfig);
						}	
					this.setPositions(JSON.parse(JSON.stringify(this.config.PortraitConfig)));						
				}
			}
	
			if(notification === 'CHANGE_POSITIONS'){
				this.setPositions(payload);
			}
	
			if(notification === 'CHANGE_POSITIONS_DEFAULTS'){
				this.setDefaults();
			}
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
						if(mod_config.debug){
							Log.log(split_position[0] + ";" + split_position[1]);
						}

						var region = document.querySelector('div.region.' + split_position[0] + '.' + split_position[1] + ' div.container');
						
						if(mod_config.debug){
							Log.log(region);
						}
						
						// Make sure the region is visible, so we can append
						if (region.style.display === 'none') {
								region.style.display = 'block';
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