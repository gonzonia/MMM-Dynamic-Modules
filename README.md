Orginal module by Toreke (https://github.com/Toreke/)

# Magic Mirror² Module: MMM-Dynamic-Modules

MMM-Dynamic-Modules moves modules without need to restart Magic Mirror. Module also allows to hide or show modules. Module has method to change configured positions back.
Can also dynamically adjust based on screen orientation and update based on notifications received that aren't sent specifically to the module.  
## Example
These use the same config file and only minimal changes to CSS for landscape. My primary screen that's on all the time is in portrait. The clock and MMM-BMW-PW was shifted from top_bar to upper_third. 
The newsfeed was moved from bottom_left to bottom_bar. MMM-News-QR was moved from bottom_right to bottom_bar. More drastic maneuvirng can be accomplished by incorporating CSS changes like the example posted here https://forum.magicmirror.builders/topic/13197/change-the-regions-positions

PORTRAIT:
![Screenshot portrait](https://github.com/user-attachments/assets/9b0fc219-1092-4e34-8685-342ec2f9726c)

LANDSCAPE:
![Screenshot landscape](https://github.com/user-attachments/assets/90419c13-bf48-43ba-a245-47416667017e)


## Installation


```bash
cd ~/MagicMirror/modules
git clone https://github.com/gonzonia/MMM-Dynamic-Modules.git
```

## Config
The entry in `config.js` can include the following options:

<!-- prettier-ignore-start -->
| Option             | Description
|--------------------|-----------
| `swapOrientation`  | true or false, whether to move modules based on the screen orientation Default: False
| `LandscapeConfig`  | JSON string for moving/hiding when in landscape Default: ""
| `PortraitConfig`   | JSON string for moving/hiding when in portrait Default: ""
| `UpdateNotifications`| List of notifications that will trigger the update based on orientation. Will always include the system, "DOM_OBJECTS_CREATED" Default: "DOM_OBJECTS_CREATED"
| `PauseNotifications`| List of notifications that will pause updates (i.e. some modules used to turn off the screen also end up switching to landscape from portrait) Default: ""
| `ResumeNotifications`| List of notifications that will resume updates (needed if using pause notifications to make sure screen is updated again) Default: ""

```
{
	module: "MMM-Dynamic-Modules",
	classes: 'SceneFamily SceneSam',
	config: {
		swapOrientation: true,
		LandscapeConfig: '{"newsfeed":{"position": "bottom_bar","visible": true},"MMM-News-QR":{"position":"bottom_bar"},"MMM-BMW-PW":{"position":"upper_third"},"clock":{"position": "upper_third"}}',
		UpdateNotifications:"NEWS_FEED_UPDATE"
	},
},
```

## How to use


Module can be used by sending an change notification with a payload:

```
this.sendNotification('CHANGE_POSITIONS', 
	modules = {
		'clock':{
			visible: 'true',
			position: 'top_right',
		},

		'MMM-WeeklySchedule':{
			visible: 'true',
			position: 'top_left',
		},

		'MMM-AirQuality':{
			visible: 'true',
			position: 'bottom_bar',
		}
	}
);
```

Sending a notification to reset to positions according to your config:

```
this.sendNotification(CHANGE_POSITIONS_DEFAULTS);
```

OR move based on orientation the Config passed to LanscapeConfig or PortraitConfig must be valid JSON in a format like the one below. The slightest typo and it won't work. 
```
swapOrientation: true,
LandscapeConfig: '{"newsfeed":{"position": "bottom_bar","visible": true},"MMM-News-QR":{"position":"bottom_bar"},"MMM-BMW-PW":{"position":"upper_third"},"clock":{"position": "upper_third"}}',
```

Order of the modules matters. If there is multiple modules in the same position, first module will be top, second module under it, and so on.
If multiple instances of a module are being used, they will ALL be moved or hidden. 

Tips:
Best when used in conjunction with CSS. 
Use
```
@media (orientation: landscape) { 

}
```
and 
```
@media (orientation: portrait) {

}
```
to create stylesheets for specific screen orientations. 

You can also add 

```
and (max-width: 3840px) 
```
to either one if you want to create something that is for 4K. This would come in handy if say your main mirror is 1080p but you want to have a separate browser somewhere else showing the mirror on a TV or higher resolution monitor. 

