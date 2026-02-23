var Config = {
  // Tool options (from scene/toolHandler)
  tool: { source: 'toolHandler.currentTool' },
  grid: { source: 'toolHandler.options.grid' },
  snap: { source: 'toolHandler.options.snap' },
  object: { source: 'toolHandler.options.object' },
  lineType: { source: 'toolHandler.options.lineType' },
  objectMode: { source: 'toolHandler.options.objectMode' },
  vehicle: { source: 'vehicle' },

  // Straightline

  // Curve
  curveSegmentLength: { source: 'toolHandler.tools.curve.options.segmentLength' },

  // Circle
  circleSegmentLength: { source: 'toolHandler.tools.circle.options.segmentLength' },
  ellipse: { gs: 'ellipse', invertFalse: true },

  // Brush
  brushSettings: {
    computed: function () { return JSON.stringify(GameSettings.brush || {}); }
  },

  // Pattern
  patterns: {
    computed: function (scene) {
      var patternTool = scene.toolHandler.tools.pattern;
      if (!patternTool) return [];
      return patternTool.patterns.map(function (p) {
        return {
          name: p.name,
          width: p.width,
          height: p.height
        };
      });
    },
    compareJson: true
  },
  currentPattern: {
    computed: function (scene) {
      var patternTool = scene.toolHandler.tools.pattern;
      return patternTool ? patternTool.currentPattern : 0;
    }
  },
  patternBrushSize: {
    computed: function (scene) {
      var tool = scene.toolHandler.tools.pattern;
      return tool ? tool.size : 100;
    }
  },
  patternBrush: {
    computed: function (scene) {
      var tool = scene.toolHandler.tools.pattern;
      return tool ? tool.currentBrush : 1;
    }
  },
  patternGlobalGrid: { gs: 'pattern.globalGrid', default: true },
  patternExperimentalSpeedups: { gs: 'pattern.experimentalSpeedups', default: false },
  patternExperimentalStabilization: { gs: 'pattern.experimentalStabilization', default: false },

  // Eraser
  eraserRadius: { source: 'toolHandler.tools.eraser.options.radius' },
  lineTrim: { gs: 'lineTrim', default: false },

  // Powerups
  selectedPowerup: { source: 'toolHandler.tools.powerup.options.selected', default: 'goal' },
  selectedVehiclePowerup: { source: 'toolHandler.tools.vehiclepowerup.options.selected', default: 'helicopter' },
  vehiclePowerupTime: { source: 'toolHandler.tools.vehiclepowerup.options.time', default: 10 },

  // Select
  rotateFactor: { gs: 'rotateFactor', default: 15 },
  scaleFactor: { gs: 'scaleFactor', default: 1 },
  offsetFactor: { gs: 'offsetFactor', default: 1 },
  copy: { gs: 'copy', default: false },
  scaleLock: { gs: 'scaleLock', invertFalse: true },

  selectState: {
    computed: function (scene) {
      var tool = scene.toolHandler.tools.select;
      if (!tool || !tool.selected || !tool.selected.length) return 0;
      return tool.selected.length + '|' + tool.actionPointer + '|' + JSON.stringify(tool.getTransformState());
    }
  },

  // Camera settings
  cameraSpeed: { gs: 'cameraSpeed', default: 3 },
  cameraSensitivity: { gs: 'cameraSensitivity', default: 0.05 },
  cameraLocked: { gs: 'toolHandler.cameraLocked', invertFalse: true },
  zoomPercentage: { source: 'camera.zoomPercentage' },
  cameraMovement: {
    computed: function () {
      var v = GameSettings.cameraMovementVertical;
      var h = GameSettings.cameraMovementHorizontal;
      return v && h ? 'normal' : (v ? 'vertical' : (h ? 'horizontal' : 'none'));
    }
  },

  // Grid settings
  gridSize: { gs: 'toolHandler.gridSize', default: 10 },
  isometricGrid: { gs: 'toolHandler.isometricGrid', default: false },
  visibleGrid: { gs: 'toolHandler.visibleGrid', default: true },
  snapGrid: { gs: 'toolHandler.snapGrid', default: true },

  // Snap settings
  snapDistance: { gs: 'snapDistance', default: 10 },
  snapNear: { gs: 'snapNear' },
  snapClick: { gs: 'snapClick' },
  snapCursor: { gs: 'snapCursor' },
  snapLocked: { gs: 'toolHandler.snapLocked', default: false },

  // Object info
  objectName: { source: 'objectName', default: '' },

  // Object names for tracking changes
  objectNames: {
    computed: function (scene) {
      return Object.keys(scene.objects || {}).sort().join('|');
    }
  },

  // Object transforms
  objectRotate: { gs: 'objectRotate', default: 0 },
  objectScale: { gs: 'objectScale', default: 1 },
  objectStretchX: { gs: 'objectStretchX', default: 1 },
  objectStretchY: { gs: 'objectStretchY', default: 1 },
  objectOffsetX: { gs: 'objectOffsetX', default: 0 },
  objectOffsetY: { gs: 'objectOffsetY', default: 0 },
  objectFlipX: { gs: 'objectFlipX', default: false },
  objectFlipY: { gs: 'objectFlipY', default: false },
  objectInvert: { gs: 'objectInvert', default: false },
  objectInvertFlat: { gs: 'objectInvertFlat', default: false },

  // Object sensitivities
  rotateSensitivity: { gs: 'rotateSensitivity', default: 15 },
  scaleSensitivity: { gs: 'scaleSensitivity', default: 0.1 },
  offsetSensitivity: { gs: 'offsetSensitivity', default: 10 },

  // Layer data
  layerIndex: { source: 'track.layerIndex' },
  layerCount: { source: 'track.layers.length' },

  // Layers data (needs JSON comparison)
  layersData: {
    computed: function (scene) {
      return scene.track.layers.map(function (l) {
        return {
          name: l.name,
          visible: l.show !== false,
          locked: l.locked || false,
          physicsColor: l.physicsLineColor || '#000000',
          sceneryColor: l.sceneryLineColor || '#aaaaaa'
        };
      });
    },
    compareJson: true
  },
  layerName: {
    computed: function (scene) {
      return scene.track.currentLayer ? scene.track.currentLayer.name : 'Default';
    }
  },
  layerVisible: {
    computed: function (scene) {
      return scene.track.currentLayer ? scene.track.currentLayer.show : true;
    }
  },
  layerNames: {
    computed: function (scene) {
      return scene.track.layers.map(function (l) { return l.name; }).join('|');
    }
  },
  layerVisibilities: {
    computed: function (scene) {
      return scene.track.layers.map(function (l) { return l.show !== false ? '1' : '0'; }).join('|');
    }
  },

  // Menu hide for play mode
  hideMenus: {
    computed: function (scene) {
      return scene.game.mod.getVar("play") || scene.game.mod.getVar("mobile");
    }
  },
};

// Settings to persist (user preferences only)
var PersistentSettings = [
  'snapDistance',
  'snapNear',
  'snapClick',
  'snapCursor',
  'snapLocked',
  'gridSize',
  'isometricGrid',
  'visibleGrid',
  'snapGrid',
  'cameraSpeed',
  'cameraSensitivity',
  'cameraLocked',
  'cameraMovement',
  'lineTrim',
  'ellipse',
  'copy',
  'scaleLock',
  'rotateSensitivity',
  'scaleSensitivity',
  'offsetSensitivity',
  'brushSettings',
  'rotateFactor',
  'scaleFactor',
  'offsetFactor',
  'patternBrushSize',
  'patternBrush',
  'patternGlobalGrid',
  'patternExperimentalSpeedups',
  'patternExperimentalStabilization'
];

var ModPersistentSettings = [
  'blackHat', 'invincibility', 'noClip', 'invisibleRider',
  'mini', 'propeller', 'crouch', 'slowmo', 'rewind',
  'oldTimer', 'frontBrake', 'bikeData', 'gameData',
  'inputDisplay', 'hitboxes', 'accurateEraser', 'snap15',
  'pointDataAlways', 'mobile', 'play', 'keepDeadRiders',
  'fadedVehiclePowerups', 'pixelSnapEverything', /*'lineShadow',*/
  'customColors', 'invertColors', 'darkenColors', 'grayscale',
  'crHead', 'crBmx', 'crMtb', 'crHeli', 'crRagdoll',
  'crPowerups', 'seeGhost', 'mario',
  'vehicleColor', 'riderColor', 'lineColor',
  'sceneryColor', 'backgroundColor', 'hatColor'
];

// Helper to get nested property
getNestedProp = function (obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce(function (o, k) {
    return o && o[k] !== undefined ? o[k] : undefined;
  }, obj);
};

// Helper to set nested property
setNestedProp = function (obj, path, value) {
  var keys = path.split('.');
  var current = obj;
  for (var i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
};

// Generate state from config
generateState = function (scene, config) {
  var state = {};

  for (var key in config) {
    var cfg = config[key];
    var value;

    if (cfg.computed) {
      value = cfg.computed(scene);
    } else if (cfg.source) {
      value = getNestedProp(scene, cfg.source);
    } else if (cfg.gs) {
      value = getNestedProp(GameSettings, cfg.gs);
    }

    if (value === undefined || value === null) {
      value = cfg.default;
    }

    if (cfg.invertFalse) {
      value = value !== false;
    }

    state[key] = value;
  }

  return state;
};

// Check if state changed based on config
hasStateChanged = function (prevData, currData, config) {
  prevData = prevData || {};
  currData = currData || {};

  for (var key in config) {
    var cfg = config[key];

    if (cfg.compareJson) {
      if (JSON.stringify(prevData[key]) !== JSON.stringify(currData[key])) {
        return true;
      }
    } else if (prevData[key] !== currData[key]) {
      return true;
    }
  }
  return false;
};

// Save settings to localStorage
var saveSettingsTimeout = null;

saveSettings = function (debounce) {
  if (debounce) {
    clearTimeout(saveSettingsTimeout);
    saveSettingsTimeout = setTimeout(saveSettings, 500);
    return;
  }

  if (typeof GameSettings === 'undefined') return;

  var settings = {};

  PersistentSettings.forEach(function (key) {
    var cfg = Config[key];
    if (!cfg) return;

    var value;

    if (cfg.computed) {
      try { value = cfg.computed(); } catch (e) { }
    } else if (cfg.gs) {
      value = getNestedProp(GameSettings, cfg.gs);
    }

    if (value !== undefined) {
      settings[key] = value;
    }
  });

  var mod = (typeof GameManager !== 'undefined' &&
    GameManager.game && GameManager.game.mod)
    ? GameManager.game.mod : null;

  if (mod) {
    settings._mod = {};
    ModPersistentSettings.forEach(function (key) {
      var value = mod.getVar(key);
      if (value !== undefined) {
        settings._mod[key] = value;
      }
    });
  } else {
    var existing = localStorage.getItem('editorSettings');
    if (existing) {
      try {
        var parsed = JSON.parse(existing);
        if (parsed._mod) {
          settings._mod = parsed._mod;
        }
      } catch (e) { }
    }
  }

  localStorage.setItem('editorSettings', JSON.stringify(settings));
};

// Load settings from localStorage
loadSettings = function () {
  if (typeof GameSettings === 'undefined') return;

  var saved = localStorage.getItem('editorSettings');
  if (!saved) return;

  try {
    var settings = JSON.parse(saved);

    // Snap settings
    if (settings.snapDistance !== undefined) GameSettings.snapDistance = settings.snapDistance;
    if (settings.snapNear !== undefined) GameSettings.snapNear = settings.snapNear;
    if (settings.snapClick !== undefined) GameSettings.snapClick = settings.snapClick;
    if (settings.snapCursor !== undefined) GameSettings.snapCursor = settings.snapCursor;
    if (settings.snapLocked !== undefined && GameSettings.toolHandler) {
      GameSettings.toolHandler.snapLocked = settings.snapLocked;
    }

    // Grid settings
    if (GameSettings.toolHandler) {
      if (settings.gridSize !== undefined) GameSettings.toolHandler.gridSize = settings.gridSize;
      if (settings.isometricGrid !== undefined) GameSettings.toolHandler.isometricGrid = settings.isometricGrid;
      if (settings.visibleGrid !== undefined) GameSettings.toolHandler.visibleGrid = settings.visibleGrid;
      if (settings.snapGrid !== undefined) GameSettings.toolHandler.snapGrid = settings.snapGrid;
    }

    // Camera settings
    if (settings.cameraSpeed !== undefined) GameSettings.cameraSpeed = settings.cameraSpeed;
    if (settings.cameraSensitivity !== undefined) {
      GameSettings.cameraSensitivity = settings.cameraSensitivity;
      GameSettings.cameraZoomMin = settings.cameraSensitivity * 0.5;
    }
    if (settings.cameraLocked !== undefined && GameSettings.toolHandler) {
      GameSettings.toolHandler.cameraLocked = settings.cameraLocked;
    }
    if (settings.cameraMovement !== undefined) {
      var cm = settings.cameraMovement;
      GameSettings.cameraMovementVertical = (cm === 'normal' || cm === 'vertical');
      GameSettings.cameraMovementHorizontal = (cm === 'normal' || cm === 'horizontal');
    }

    // Tool settings
    if (settings.lineTrim !== undefined) GameSettings.lineTrim = settings.lineTrim;
    if (settings.ellipse !== undefined) GameSettings.ellipse = settings.ellipse;
    if (settings.copy !== undefined) GameSettings.copy = settings.copy;
    if (settings.scaleLock !== undefined) GameSettings.scaleLock = settings.scaleLock;

    // Select
    if (settings.rotateFactor !== undefined) GameSettings.rotateFactor = settings.rotateFactor;
    if (settings.scaleFactor !== undefined) GameSettings.scaleFactor = settings.scaleFactor;
    if (settings.offsetFactor !== undefined) GameSettings.offsetFactor = settings.offsetFactor;

    // Sensitivities
    if (settings.rotateSensitivity !== undefined) GameSettings.rotateSensitivity = settings.rotateSensitivity;
    if (settings.scaleSensitivity !== undefined) GameSettings.scaleSensitivity = settings.scaleSensitivity;
    if (settings.offsetSensitivity !== undefined) GameSettings.offsetSensitivity = settings.offsetSensitivity;

    // Brush settings
    if (settings.brushSettings !== undefined) {
      try {
        GameSettings.brush = JSON.parse(settings.brushSettings);
      } catch (e) { }
    }

    // Pattern tool
    if (!GameSettings.pattern) GameSettings.pattern = {};
    if (settings.patternGlobalGrid !== undefined) GameSettings.pattern.globalGrid = settings.patternGlobalGrid;
    if (settings.patternExperimentalSpeedups !== undefined) GameSettings.pattern.experimentalSpeedups = settings.patternExperimentalSpeedups;
    if (settings.patternExperimentalStabilization !== undefined) GameSettings.pattern.experimentalStabilization = settings.patternExperimentalStabilization;

    // For brush size, need to apply after tool is created
    if (settings.patternBrushSize !== undefined) {
      GameSettings.pattern.brushSize = settings.patternBrushSize;
    }
    if (settings.patternBrush !== undefined) {
      GameSettings.pattern.brush = settings.patternBrush;
    }

    if (settings._mod) {
            window._pendingModSettings = settings._mod;
            applyModSettings();
        }

    console.log('Editor settings loaded');
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
};

function applyModSettings() {
    if (!window._pendingModSettings) return;

    var mod = (typeof GameManager !== 'undefined' &&
               GameManager.game && GameManager.game.mod)
              ? GameManager.game.mod : null;

    if (!mod) return; // will retry later

    var modSettings = window._pendingModSettings;
    for (var key in modSettings) {
        mod.setVar(key, modSettings[key]);
    }

    window._pendingModSettings = null;
    console.log('Mod settings loaded');
}

// Clear saved settings
clearSettings = function () {
  localStorage.removeItem('editorSettings');
  console.log('Editor settings cleared');
};