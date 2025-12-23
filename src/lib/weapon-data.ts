export interface WeaponMode {
  name: string;
  mode: string;
  damage: string;
  burst: string;
  ammo: string;
  saving: string;
  savingNum: string;
  traits: string[];
  distance: {
    short: { max: number; mod: string };
    med: { max: number; mod: string };
    long: { max: number; mod: string };
    max: { max: number; mod: string };
  };
}

export const WEAPON_DATA: Record<number, WeaponMode[]> = {
  "1": [
    {
      "name": "Akrylat-Kanone",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "PARA",
      "saving": "PH-6",
      "savingNum": "1",
      "traits": [
        "Disposable (2)",
        "State: IMM-A",
        "Non-lethal"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "2": [
    {
      "name": "Heavy Machine Gun",
      "mode": "Standard",
      "damage": "5",
      "burst": "4",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "3": [
    {
      "name": "AP Heavy Machine Gun",
      "mode": "Standard",
      "damage": "5",
      "burst": "4",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "4": [
    {
      "name": "MULTI Heavy Machine Gun",
      "mode": "Anti-materiel Mode",
      "damage": "5",
      "burst": "1",
      "ammo": "Exp",
      "saving": "ARM",
      "savingNum": "3",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    },
    {
      "name": "MULTI Heavy Machine Gun",
      "mode": "AP Mode",
      "damage": "5",
      "burst": "4",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    },
    {
      "name": "MULTI Heavy Machine Gun",
      "mode": "Shock Mode",
      "damage": "5",
      "burst": "4",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "5": [
    {
      "name": "CC Weapon",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "CC"
      ],
      "distance": null
    }
  ],
  "6": [
    {
      "name": "AP CC Weapon",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "CC"
      ],
      "distance": null
    }
  ],
  "7": [
    {
      "name": "E/M CC Weapon",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "N+E/M",
      "saving": "BTS/2",
      "savingNum": "2",
      "traits": [
        "CC",
        "[**]"
      ],
      "distance": null
    }
  ],
  "8": [
    {
      "name": "EXP CC Weapon",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "Exp",
      "saving": "ARM",
      "savingNum": "3",
      "traits": [
        "Anti-materiel",
        "CC"
      ],
      "distance": null
    }
  ],
  "9": [
    {
      "name": "Monofilament CC Weapon",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "N",
      "saving": "ARM=0",
      "savingNum": "1",
      "traits": [
        "CC",
        "State: Dead"
      ],
      "distance": null
    }
  ],
  "10": [
    {
      "name": "Shock CC Weapon",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "CC"
      ],
      "distance": null
    }
  ],
  "11": [
    {
      "name": "DA CC Weapon",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "DA",
      "saving": "ARM",
      "savingNum": "2",
      "traits": [
        "Anti-materiel",
        "CC"
      ],
      "distance": null
    }
  ],
  "13": [
    {
      "name": "Viral CC Weapon",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "CC",
        "Bioweapon (DA+SHOCK)"
      ],
      "distance": null
    }
  ],
  "14": [
    {
      "name": "Blitzen",
      "mode": "Standard",
      "damage": "6",
      "burst": "1",
      "ammo": "E/M",
      "saving": "BTS/2",
      "savingNum": "2",
      "traits": [
        "Disposable (2)",
        "Non-lethal",
        "[**]"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "15": [
    {
      "name": "Hyper-Rapid Magnetic Cannon",
      "mode": "Anti-Materiel Mode",
      "damage": "5",
      "burst": "1",
      "ammo": "DA",
      "saving": "ARM",
      "savingNum": "2",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "0"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    },
    {
      "name": "Hyper-Rapid Magnetic Cannon",
      "mode": "AP Mode",
      "damage": "5",
      "burst": "5",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "0"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    },
    {
      "name": "Hyper-Rapid Magnetic Cannon",
      "mode": "Shock Mode",
      "damage": "5",
      "burst": "5",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "0"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "16": [
    {
      "name": "Portable Autocannon",
      "mode": "Standard",
      "damage": "5",
      "burst": "2",
      "ammo": "AP+Exp",
      "saving": "ARM/2",
      "savingNum": "3",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "17": [
    {
      "name": "D-Charges",
      "mode": "CC Mode",
      "damage": "6",
      "burst": "1",
      "ammo": "AP+Exp",
      "saving": "ARM/2",
      "savingNum": "3",
      "traits": [
        "Anti-materiel",
        "CC",
        "Disposable (3)",
        "Improvised",
        "[*]"
      ],
      "distance": null
    },
    {
      "name": "D-Charges",
      "mode": "Demolition Mode",
      "damage": "6",
      "burst": "1",
      "ammo": "AP+Exp",
      "saving": "ARM/2",
      "savingNum": "3",
      "traits": [
        "Anti-materiel",
        "Disposable (3)",
        "[*]"
      ],
      "distance": null
    }
  ],
  "18": [
    {
      "name": "Chain Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Direct Template (Large Teardrop)"
      ],
      "distance": null
    }
  ],
  "19": [
    {
      "name": "Contender",
      "mode": "Standard",
      "damage": "7",
      "burst": "2",
      "ammo": "T2",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "short": {
          "max": 20,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "0"
        }
      }
    }
  ],
  "20": [
    {
      "name": "Crazykoala",
      "mode": "Standard",
      "damage": "5",
      "burst": "1",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Disposable (2)",
        "Boost",
        "Perimeter",
        "Deployable",
        "[*]"
      ],
      "distance": null
    }
  ],
  "23": [
    {
      "name": "E/Marat",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "E/M",
      "saving": "BTS/2",
      "savingNum": "2",
      "traits": [
        "Intuitive Attack",
        "Non-lethal",
        "Direct Template (Large Teardrop)",
        "[**]"
      ],
      "distance": null
    }
  ],
  "25": [
    {
      "name": "E/Mitter",
      "mode": "Standard",
      "damage": "7",
      "burst": "2",
      "ammo": "E/M",
      "saving": "BTS/2",
      "savingNum": "2",
      "traits": [
        "Non-lethal",
        "[**]"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "0"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "26": [
    {
      "name": "Boarding Shotgun",
      "mode": "Standard",
      "damage": "6",
      "burst": "2",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+6"
        },
        "long": {
          "max": 60,
          "mod": "-3"
        }
      }
    }
  ],
  "27": [
    {
      "name": "T2 Boarding Shotgun",
      "mode": "Standard",
      "damage": "6",
      "burst": "2",
      "ammo": "T2",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "+6"
        },
        "max": null,
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 60,
          "mod": "-3"
        }
      }
    }
  ],
  "28": [
    {
      "name": "Light Shotgun",
      "mode": "Standard",
      "damage": "7",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+6"
        },
        "long": {
          "max": 60,
          "mod": "-3"
        }
      }
    }
  ],
  "29": [
    {
      "name": "Heavy Shotgun",
      "mode": "Standard",
      "damage": "5",
      "burst": "2",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+6"
        },
        "long": {
          "max": 60,
          "mod": "-3"
        }
      }
    }
  ],
  "30": [
    {
      "name": "Feuerbach",
      "mode": "Burst Mode",
      "damage": "6",
      "burst": "2",
      "ammo": "AP+DA",
      "saving": "ARM/2",
      "savingNum": "2",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "0"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    },
    {
      "name": "Feuerbach",
      "mode": "Explosive Mode",
      "damage": "6",
      "burst": "1",
      "ammo": "Exp",
      "saving": "ARM",
      "savingNum": "3",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "0"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "31": [
    {
      "name": "Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "32": [
    {
      "name": "AP Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "33": [
    {
      "name": "Combi Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "med": {
          "max": 80,
          "mod": "-3"
        },
        "short": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 120,
          "mod": "-6"
        }
      }
    }
  ],
  "34": [
    {
      "name": "Sniper Rifle",
      "mode": "Standard",
      "damage": "5",
      "burst": "2",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 240,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 120,
          "mod": "+3"
        }
      }
    }
  ],
  "35": [
    {
      "name": "AP Sniper Rifle",
      "mode": "Standard",
      "damage": "5",
      "burst": "2",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 240,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 120,
          "mod": "+3"
        }
      }
    }
  ],
  "36": [
    {
      "name": "MULTI Sniper Rifle",
      "mode": "Anti-Materiel Mode",
      "damage": "5",
      "burst": "2",
      "ammo": "DA",
      "saving": "ARM",
      "savingNum": "2",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 240,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 120,
          "mod": "+3"
        }
      }
    },
    {
      "name": "MULTI Sniper Rifle",
      "mode": "AP Mode",
      "damage": "5",
      "burst": "2",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 240,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 120,
          "mod": "+3"
        }
      }
    },
    {
      "name": "MULTI Sniper Rifle",
      "mode": "Shock Mode",
      "damage": "5",
      "burst": "2",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 240,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 120,
          "mod": "+3"
        }
      }
    }
  ],
  "38": [
    {
      "name": "T2 Sniper Rifle",
      "mode": "Standard",
      "damage": "5",
      "burst": "2",
      "ammo": "T2",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 240,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 120,
          "mod": "+3"
        }
      }
    }
  ],
  "39": [
    {
      "name": "VIRAL Sniper Rifle",
      "mode": "Standard",
      "damage": "5",
      "burst": "2",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "Bioweapon (DA+SHOCK)"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 240,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 120,
          "mod": "+3"
        }
      }
    }
  ],
  "40": [
    {
      "name": "Plasma Rifle",
      "mode": "Blast Mode",
      "damage": "7",
      "burst": "3",
      "ammo": "N",
      "saving": "ARM and BTS",
      "savingNum": "1 and 1",
      "traits": [
        "Suppressive Fire",
        "Impact Template (Circular)"
      ],
      "distance": {
        "med": {
          "max": 80,
          "mod": "-3"
        },
        "short": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 120,
          "mod": "-6"
        }
      }
    },
    {
      "name": "Plasma Rifle",
      "mode": "Hit Mode",
      "damage": "6",
      "burst": "3",
      "ammo": "N",
      "saving": "ARM and BTS",
      "savingNum": "1 and 1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "med": {
          "max": 80,
          "mod": "-3"
        },
        "short": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 120,
          "mod": "-6"
        }
      }
    }
  ],
  "41": [
    {
      "name": "MULTI Rifle",
      "mode": "Anti-Materiel Mode",
      "damage": "7",
      "burst": "1",
      "ammo": "DA",
      "saving": "ARM",
      "savingNum": "2",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "med": {
          "max": 80,
          "mod": "-3"
        },
        "short": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 120,
          "mod": "-6"
        }
      }
    },
    {
      "name": "MULTI Rifle",
      "mode": "AP Mode",
      "damage": "7",
      "burst": "3",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "med": {
          "max": 80,
          "mod": "-3"
        },
        "short": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 120,
          "mod": "-6"
        }
      }
    },
    {
      "name": "MULTI Rifle",
      "mode": "Shock Mode",
      "damage": "7",
      "burst": "3",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "med": {
          "max": 80,
          "mod": "-3"
        },
        "short": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 120,
          "mod": "-6"
        }
      }
    }
  ],
  "42": [
    {
      "name": "T2 Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "T2",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Anti-materiel",
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "43": [
    {
      "name": "Viral Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "Bioweapon (DA+SHOCK)",
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "44": [
    {
      "name": "Grenades",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Speculative Attack",
        "BS Weapon (PH)",
        "Impact Template (Circular)"
      ],
      "distance": {
        "med": {
          "max": 40,
          "mod": "-3"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        }
      }
    }
  ],
  "45": [
    {
      "name": "Smoke Grenades",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "Smoke",
      "saving": "-",
      "savingNum": "-",
      "traits": [
        "Speculative Attack",
        "BS Weapon (PH)",
        "Impact Template (Circular)",
        "Non-lethal",
        "Targetless",
        "[**]"
      ],
      "distance": {
        "med": {
          "max": 40,
          "mod": "-3"
        },
        "short": {
          "max": 20,
          "mod": "0"
        }
      }
    }
  ],
  "46": [
    {
      "name": "Eclipse Grenades",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "Eclipse",
      "saving": "-",
      "savingNum": "-",
      "traits": [
        "Speculative Attack",
        "BS Weapon (PH)",
        "Impact Template (Circular)",
        "Non-lethal",
        "Reflective",
        "Targetless",
        "[**]"
      ],
      "distance": {
        "med": {
          "max": 40,
          "mod": "-3"
        },
        "short": {
          "max": 20,
          "mod": "0"
        }
      }
    }
  ],
  "47": [
    {
      "name": "E/M Grenades",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "E/M",
      "saving": "BTS/2",
      "savingNum": "2",
      "traits": [
        "Speculative Attack",
        "BS Weapon (PH)",
        "Impact Template (Circular)",
        "Non-lethal",
        "[**]"
      ],
      "distance": {
        "med": {
          "max": 40,
          "mod": "-3"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        }
      }
    }
  ],
  "49": [
    {
      "name": "Katyusha MRL",
      "mode": "Standard",
      "damage": "6",
      "burst": "1",
      "ammo": "DA",
      "saving": "ARM",
      "savingNum": "2",
      "traits": [
        "Anti-materiel",
        "Speculative Attack",
        "Impact Template (Circular)"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "0"
        }
      }
    }
  ],
  "56": [
    {
      "name": "Light Flamethrower",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Direct Template (Small Teardrop)",
        "Continous Damage"
      ],
      "distance": null
    }
  ],
  "57": [
    {
      "name": "Heavy Flamethrower",
      "mode": "Standard",
      "damage": "6",
      "burst": "1",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Direct Template (Large Teardrop)",
        "Continous Damage"
      ],
      "distance": null
    }
  ],
  "58": [
    {
      "name": "Missile Launcher",
      "mode": "Blast Mode",
      "damage": "6",
      "burst": "1",
      "ammo": "Exp",
      "saving": "ARM",
      "savingNum": "3",
      "traits": [
        "Anti-materiel",
        "Impact Template (Circular)"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 240,
          "mod": "-3"
        },
        "med": {
          "max": 60,
          "mod": "0"
        },
        "long": {
          "max": 100,
          "mod": "+3"
        }
      }
    },
    {
      "name": "Missile Launcher",
      "mode": "Hit Mode",
      "damage": "6",
      "burst": "1",
      "ammo": "AP+Exp",
      "saving": "ARM/2",
      "savingNum": "3",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 240,
          "mod": "-3"
        },
        "med": {
          "max": 60,
          "mod": "0"
        },
        "long": {
          "max": 100,
          "mod": "+3"
        }
      }
    }
  ],
  "59": [
    {
      "name": "Forward Observer",
      "mode": "Standard",
      "damage": "-",
      "burst": "2",
      "ammo": "N",
      "saving": "",
      "savingNum": "1",
      "traits": [
        "BS Weapon (WIP)",
        "Non-lethal",
        "State: Targeted",
        "[***]"
      ],
      "distance": {
        "short": null,
        "max": {
          "max": 240,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "0"
        },
        "long": {
          "max": 120,
          "mod": "-3"
        }
      }
    }
  ],
  "62": [
    {
      "name": "Monofilament Mine",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "N",
      "saving": "ARM=0",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Concealed",
        "Disposable (3)",
        "Direct Template (Small Teardrop)",
        "Deployable",
        "State: Dead",
        "[*]"
      ],
      "distance": null
    }
  ],
  "63": [
    {
      "name": "Viral Mine",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Bioweapon (DA+SHOCK)",
        "Concealed",
        "Disposable (3)",
        "Direct Template (Small Teardrop)",
        "Deployable",
        "[*]"
      ],
      "distance": null
    }
  ],
  "64": [
    {
      "name": "Mk12",
      "mode": "Standard",
      "damage": "5",
      "burst": "3",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "65": [
    {
      "name": "Nanopulser",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "Direct Template (Small Teardrop)"
      ],
      "distance": null
    }
  ],
  "67": [
    {
      "name": "Ohotnik",
      "mode": "Standard",
      "damage": "6",
      "burst": "2",
      "ammo": "T2",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "xlong": {
          "max": 120,
          "mod": "-3"
        },
        "max": {
          "max": 240,
          "mod": "-6"
        },
        "med": {
          "max": 80,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "0"
        }
      }
    }
  ],
  "68": [
    {
      "name": "Panzerfaust",
      "mode": "Standard",
      "damage": "6",
      "burst": "1",
      "ammo": "AP+Exp",
      "saving": "ARM/2",
      "savingNum": "3",
      "traits": [
        "Anti-materiel",
        "Disposable (2)"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "69": [
    {
      "name": "Pistol",
      "mode": "Standard",
      "damage": "9",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    }
  ],
  "70": [
    {
      "name": "Assault Pistol",
      "mode": "Standard",
      "damage": "7",
      "burst": "4",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    }
  ],
  "71": [
    {
      "name": "PARA CC Weapon",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "PARA",
      "saving": "PH-6",
      "savingNum": "1",
      "traits": [
        "CC",
        "Non-lethal",
        "State: IMM-A"
      ],
      "distance": null
    }
  ],
  "72": [
    {
      "name": "Flash Pulse",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "Stun",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "BS Weapon (WIP)",
        "State: Stunned",
        "Non-lethal"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 240,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 120,
          "mod": "-3"
        }
      }
    }
  ],
  "73": [
    {
      "name": "Sepsitor",
      "mode": "Standard",
      "damage": "4",
      "burst": "1",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Disposable (2)",
        "State: Sepsitorized",
        "Direct Template (Large Teardrop)",
        "[*]"
      ],
      "distance": null
    }
  ],
  "74": [
    {
      "name": "Spitfire",
      "mode": "Standard",
      "damage": "6",
      "burst": "4",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "75": [
    {
      "name": "Uragan MRL",
      "mode": "Blast Mode",
      "damage": "6",
      "burst": "3",
      "ammo": "AP+Shock",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Speculative Attack",
        "Impact Template (Circular)",
        "Burst: Single Target"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "0"
        }
      }
    },
    {
      "name": "Uragan MRL",
      "mode": "Hit Mode",
      "damage": "5",
      "burst": "3",
      "ammo": "AP+Shock",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Burst: Single Target"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "0"
        }
      }
    }
  ],
  "76": [
    {
      "name": "Eclipse Grenade Launcher",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "Eclipse",
      "saving": "-",
      "savingNum": "1",
      "traits": [
        "Speculative Attack",
        "Non-lethal",
        "Impact Template (Circular)",
        "Reflective",
        "Targetless",
        "[**]"
      ],
      "distance": {
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "77": [
    {
      "name": "Submachine Gun",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "max": {
          "max": 80,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 60,
          "mod": "-3"
        }
      }
    }
  ],
  "78": [
    {
      "name": "AP + DA CC Weapon",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "AP+DA",
      "saving": "ARM/2",
      "savingNum": "2",
      "traits": [
        "Anti-materiel",
        "CC"
      ],
      "distance": null
    }
  ],
  "80": [
    {
      "name": "Chain-colt",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Direct Template (Small Teardrop)"
      ],
      "distance": null
    }
  ],
  "81": [
    {
      "name": "Vulkan Shotgun",
      "mode": "Standard",
      "damage": "6",
      "burst": "2",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Continous Damage"
      ],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+6"
        },
        "long": {
          "max": 60,
          "mod": "-3"
        }
      }
    }
  ],
  "82": [
    {
      "name": "Flammenspeer",
      "mode": "Blast Mode",
      "damage": "6",
      "burst": "1",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Continous Damage",
        "Disposable (2)",
        "Impact Template (Circular)"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    },
    {
      "name": "Flammenspeer",
      "mode": "Hit Mode",
      "damage": "6",
      "burst": "1",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Continous Damage",
        "Disposable (2)"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "83": [
    {
      "name": "Viral Combi Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "Bioweapon (DA+SHOCK)",
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 40,
          "mod": "+3"
        },
        "max": null,
        "med": {
          "max": 80,
          "mod": "-3"
        },
        "long": {
          "max": 120,
          "mod": "-6"
        }
      }
    }
  ],
  "84": [
    {
      "name": "Marksman Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    }
  ],
  "85": [
    {
      "name": "AP Marksman Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    }
  ],
  "87": [
    {
      "name": "Jammer",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "BS Weapon (WIP)",
        "Comms. Attack",
        "Intuitive Attack",
        "Disposable (2)",
        "State: Isolated",
        "Non-lethal",
        "No LoF",
        "Zone of Control"
      ],
      "distance": null
    }
  ],
  "88": [
    {
      "name": "Light Rocket Launcher",
      "mode": "Blast Mode",
      "damage": "7",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Continous Damage",
        "Impact Template (Circular)"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    },
    {
      "name": "Light Rocket Launcher",
      "mode": "Hit Mode",
      "damage": "6",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Continous Damage"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "89": [
    {
      "name": "Heavy Rocket Launcher",
      "mode": "Blast Mode",
      "damage": "6",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Continous Damage",
        "Impact Template (Circular)"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    },
    {
      "name": "Heavy Rocket Launcher",
      "mode": "Hit Mode",
      "damage": "5",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Continous Damage"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "92": [
    {
      "name": "Stun Pistol",
      "mode": "Standard",
      "damage": "8",
      "burst": "2",
      "ammo": "Stun",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "State: Stunned",
        "Non-lethal"
      ],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    }
  ],
  "95": [
    {
      "name": "K1 Combi Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "N",
      "saving": "ARM=0",
      "savingNum": "1",
      "traits": [
        "Anti-materiel",
        "Suppressive Fire"
      ],
      "distance": {
        "med": {
          "max": 80,
          "mod": "-3"
        },
        "short": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 120,
          "mod": "-6"
        }
      }
    }
  ],
  "96": [
    {
      "name": "Drop Bears",
      "mode": "BS Mode",
      "damage": "-",
      "burst": "1",
      "ammo": "N",
      "saving": "-",
      "savingNum": "1",
      "traits": [
        "BS Weapon (PH)",
        "Throwing Weapon",
        "Speculative Attack",
        "Disposable (3)",
        "Targetless",
        "[*]"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "max": null,
        "med": {
          "max": 40,
          "mod": "-3"
        },
        "long": null
      }
    },
    {
      "name": "Drop Bears",
      "mode": "Deployable Mode",
      "damage": "7",
      "burst": "1",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Disposable (3)",
        "Direct Template (Small Teardrop)",
        "Deployable",
        "[*]"
      ],
      "distance": null
    }
  ],
  "98": [
    {
      "name": "Breaker Pistol",
      "mode": "Standard",
      "damage": "8",
      "burst": "2",
      "ammo": "AP",
      "saving": "BTS/2",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    }
  ],
  "100": [
    {
      "name": "AP Heavy Pistol",
      "mode": "Standard",
      "damage": "6",
      "burst": "2",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "max": null,
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    }
  ],
  "103": [
    {
      "name": "Breaker Combi Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "AP",
      "saving": "BTS/2",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "med": {
          "max": 80,
          "mod": "-3"
        },
        "short": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 120,
          "mod": "-6"
        }
      }
    }
  ],
  "106": [
    {
      "name": "MediKit",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "N",
      "saving": "",
      "savingNum": "-",
      "traits": [
        "Non-lethal",
        "[***]"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "max": null,
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    }
  ],
  "107": [
    {
      "name": "Heavy Pistol",
      "mode": "Standard",
      "damage": "6",
      "burst": "2",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "max": null,
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    }
  ],
  "109": [
    {
      "name": "Breaker Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "AP",
      "saving": "BTS/2",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "110": [
    {
      "name": "K1 Sniper Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM=0",
      "savingNum": "1",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 240,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 120,
          "mod": "+3"
        }
      }
    }
  ],
  "111": [
    {
      "name": "Deployable Repeater",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "N",
      "saving": "",
      "savingNum": "-",
      "traits": [
        "Disposable (3)",
        "Deployable"
      ],
      "distance": null
    },
    {
      "name": "Plasma Carbine",
      "mode": "Blast Mode",
      "damage": "7",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM and BTS",
      "savingNum": "1 and 1",
      "traits": [
        "Impact Template (Circular)"
      ],
      "distance": {
        "med": {
          "max": 80,
          "mod": "-3"
        },
        "short": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-6"
        }
      }
    },
    {
      "name": "Plasma Carbine",
      "mode": "Hit Mode",
      "damage": "6",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM and BTS",
      "savingNum": "1 and 1",
      "traits": [],
      "distance": {
        "med": {
          "max": 80,
          "mod": "-3"
        },
        "short": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-6"
        }
      }
    }
  ],
  "113": [
    {
      "name": "Plasma Sniper Rifle",
      "mode": "Blast Mode",
      "damage": "6",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM and BTS",
      "savingNum": "1 and 1",
      "traits": [
        "Impact Template (Circular)"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 240,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 120,
          "mod": "+3"
        }
      }
    },
    {
      "name": "Plasma Sniper Rifle",
      "mode": "Hit Mode",
      "damage": "5",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM and BTS",
      "savingNum": "1 and 1",
      "traits": [],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 240,
          "mod": "-3"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 120,
          "mod": "+3"
        }
      }
    }
  ],
  "114": [
    {
      "name": "Sepsitor Plus",
      "mode": "Standard",
      "damage": "3",
      "burst": "1",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "State: Sepsitorized",
        "Direct Template (Large Teardrop)"
      ],
      "distance": null
    }
  ],
  "127": [
    {
      "name": "Suppressive Fire Mode Weapon",
      "mode": "Standard",
      "damage": "*",
      "burst": "3",
      "ammo": "N",
      "saving": "*",
      "savingNum": "*",
      "traits": [
        "[***]"
      ],
      "distance": {
        "med": {
          "max": 60,
          "mod": "-3"
        },
        "short": {
          "max": 40,
          "mod": "0"
        }
      }
    }
  ],
  "131": [
    {
      "name": "Discover",
      "mode": "Standard",
      "damage": "-",
      "burst": "-",
      "ammo": "N",
      "saving": "",
      "savingNum": "-",
      "traits": [
        "[***]"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "max": {
          "max": 240,
          "mod": "-6"
        },
        "med": {
          "max": 80,
          "mod": "0"
        },
        "long": {
          "max": 120,
          "mod": "-3"
        }
      }
    }
  ],
  "145": [
    {
      "name": "Pulzar",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Direct Template (Large Teardrop)"
      ],
      "distance": null
    }
  ],
  "147": [
    {
      "name": "Chest Mine",
      "mode": "BS Mode",
      "damage": "7",
      "burst": "1",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Disposable (2)",
        "Direct Template (Small Teardrop)",
        "Double Shot",
        "[*]"
      ],
      "distance": null
    },
    {
      "name": "Chest Mine",
      "mode": "CC Mode",
      "damage": "7",
      "burst": "1",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "CC Attack (+3)",
        "Disposable (2)",
        "[*]"
      ],
      "distance": null
    }
  ],
  "149": [
    {
      "name": "Vorpal CC Weapon",
      "mode": "BS Mode",
      "damage": "8",
      "burst": "1",
      "ammo": "N",
      "saving": "ARM=0",
      "savingNum": "1",
      "traits": [
        "BS Weapon (PH)",
        "State: Dead",
        "[*]"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "max": null,
        "med": null,
        "long": null
      }
    },
    {
      "name": "Vorpal CC Weapon",
      "mode": "CC Mode",
      "damage": "8",
      "burst": "1",
      "ammo": "N",
      "saving": "ARM=0",
      "savingNum": "1",
      "traits": [
        "CC",
        "State: Dead",
        "[*]"
      ],
      "distance": null
    }
  ],
  "150": [
    {
      "name": "Madtraps",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "PARA",
      "saving": "PH-6",
      "savingNum": "1",
      "traits": [
        "Disposable (2)",
        "Boost",
        "Non-lethal",
        "Perimeter",
        "Deployable",
        "[*]"
      ],
      "distance": null
    }
  ],
  "152": [
    {
      "name": "Red Fury",
      "mode": "Standard",
      "damage": "7",
      "burst": "4",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    }
  ],
  "153": [
    {
      "name": "T2 CC Weapon",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "T2",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Anti-materiel",
        "CC"
      ],
      "distance": null
    }
  ],
  "154": [
    {
      "name": "Pitcher",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "N",
      "saving": "-",
      "savingNum": "-",
      "traits": [
        "Speculative Attack",
        "Disposable (2)",
        "Indiscriminate",
        "Non-lethal",
        "Targetless",
        "[*]"
      ],
      "distance": {
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "short": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 60,
          "mod": "-3"
        }
      }
    }
  ],
  "155": [
    {
      "name": "Shock Marksman Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    }
  ],
  "156": [
    {
      "name": "Viral Pistol",
      "mode": "Standard",
      "damage": "8",
      "burst": "2",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "Bioweapon (DA+SHOCK)"
      ],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    }
  ],
  "157": [
    {
      "name": "AP Spitfire",
      "mode": "Standard",
      "damage": "6",
      "burst": "4",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "169": [
    {
      "name": "MULTI Marksman Rifle",
      "mode": "Anti-Material Mode",
      "damage": "7",
      "burst": "1",
      "ammo": "DA",
      "saving": "ARM",
      "savingNum": "2",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    },
    {
      "name": "MULTI Marksman Rifle",
      "mode": "AP Mode",
      "damage": "7",
      "burst": "3",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    },
    {
      "name": "MULTI Marksman Rifle",
      "mode": "Shock Mode",
      "damage": "7",
      "burst": "3",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    }
  ],
  "172": [
    {
      "name": "AP + Shock CC Weapon",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "AP+Shock",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "CC"
      ],
      "distance": null
    }
  ],
  "174": [
    {
      "name": "Cybermine",
      "mode": "Standard",
      "damage": "5",
      "burst": "1",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "2",
      "traits": [
        "Comms. Attack",
        "Intuitive Attack",
        "Concealed",
        "Disposable (3)",
        "Non-lethal",
        "Direct Template (Small Teardrop)",
        "Deployable",
        "State: Stunned / Immbolized-B",
        "[*]"
      ],
      "distance": null
    }
  ],
  "175": [
    {
      "name": "Zapper",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "E/M",
      "saving": "BTS/2",
      "savingNum": "2",
      "traits": [
        "Intuitive Attack",
        "Non-lethal",
        "Direct Template (Small Teardrop)",
        "[**]"
      ],
      "distance": null
    }
  ],
  "176": [
    {
      "name": "Mine Dispenser",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "N",
      "saving": "-",
      "savingNum": "1",
      "traits": [
        "Double Shot",
        "Speculative Attack",
        "Disposable (2)",
        "Targetless",
        "[*]"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-3"
        }
      }
    }
  ],
  "177": [
    {
      "name": "Trench-Hammer",
      "mode": "BS Mode",
      "damage": "6",
      "burst": "1",
      "ammo": "DA",
      "saving": "ARM",
      "savingNum": "2",
      "traits": [
        "Anti-materiel",
        "BS Weapon (PH)",
        "Disposable (3)",
        "[*]"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": null,
        "med": null,
        "long": null
      }
    },
    {
      "name": "Trench-Hammer",
      "mode": "CC Mode",
      "damage": "6",
      "burst": "1",
      "ammo": "DA",
      "saving": "ARM",
      "savingNum": "2",
      "traits": [
        "Anti-materiel",
        "CC",
        "Disposable (3)",
        "[*]"
      ],
      "distance": null
    }
  ],
  "179": [
    {
      "name": "Viral Tactical Bow",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "Bioweapon (DA+SHOCK)",
        "Silent (-6)"
      ],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    }
  ],
  "180": [
    {
      "name": "T2 Marksman Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "T2",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Anti-materiel",
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    }
  ],
  "181": [
    {
      "name": "K1 Marksman Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "N",
      "saving": "ARM=0",
      "savingNum": "1",
      "traits": [
        "Anti-materiel",
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    }
  ],
  "182": [
    {
      "name": "WildParrot",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "E/M",
      "saving": "BTS/2",
      "savingNum": "2",
      "traits": [
        "Intuitive Attack",
        "Disposable (1)",
        "Direct Template (Small Teardrop)",
        "Deployable",
        "Perimeter",
        "[*]"
      ],
      "distance": null
    }
  ],
  "187": [
    {
      "name": "Light Riotstopper",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "PARA",
      "saving": "PH-6",
      "savingNum": "1",
      "traits": [
        "State: IMM-A",
        "Non-lethal",
        "Direct Template (Small Teardrop)"
      ],
      "distance": null
    }
  ],
  "188": [
    {
      "name": "Heavy Riotstopper",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "PARA",
      "saving": "PH-6",
      "savingNum": "1",
      "traits": [
        "State: IMM-A",
        "Non-lethal",
        "Direct Template (Large Teardrop)"
      ],
      "distance": null
    }
  ],
  "189": [
    {
      "name": "MULTI Pistol",
      "mode": "Anti-Material Mode",
      "damage": "7",
      "burst": "1",
      "ammo": "DA",
      "saving": "ARM",
      "savingNum": "2",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    },
    {
      "name": "MULTI Pistol",
      "mode": "AP Mode",
      "damage": "7",
      "burst": "2",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    },
    {
      "name": "MULTI Pistol",
      "mode": "Shock Mode",
      "damage": "7",
      "burst": "2",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    }
  ],
  "193": [
    {
      "name": "Tactical Bow",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "DA",
      "saving": "ARM",
      "savingNum": "2",
      "traits": [
        "Anti-materiel",
        "Silent (-6)"
      ],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    }
  ],
  "194": [
    {
      "name": "Grenade Launcher",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Speculative Attack",
        "Impact Template (Circular)"
      ],
      "distance": {
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "195": [
    {
      "name": "Smoke Grenade Launcher",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "Smoke",
      "saving": "-",
      "savingNum": "-",
      "traits": [
        "Speculative Attack",
        "Non-lethal",
        "Impact Template (Circular)",
        "Targetless",
        "[**]"
      ],
      "distance": {
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "196": [
    {
      "name": "Shock Mine",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Concealed",
        "Disposable (3)",
        "Direct Template (Small Teardrop)",
        "Deployable",
        "[*]"
      ],
      "distance": null
    }
  ],
  "197": [
    {
      "name": "E/M Mine",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "E/M",
      "saving": "BTS/2",
      "savingNum": "2",
      "traits": [
        "Intuitive Attack",
        "Concealed",
        "Disposable (3)",
        "Direct Template (Small Teardrop)",
        "Non-lethal",
        "Deployable",
        "[**]"
      ],
      "distance": null
    }
  ],
  "199": [
    {
      "name": "AP Mine",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Concealed",
        "Disposable (3)",
        "Direct Template (Small Teardrop)",
        "Deployable",
        "[*]"
      ],
      "distance": null
    }
  ],
  "201": [
    {
      "name": "E/M Grenade Launcher",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "E/M",
      "saving": "BTS/2",
      "savingNum": "2",
      "traits": [
        "Speculative Attack",
        "Non-lethal",
        "Impact Template (Circular)",
        "[**]"
      ],
      "distance": {
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "203": [
    {
      "name": "PT: Endgame",
      "mode": "Standard",
      "damage": "7",
      "burst": "1",
      "ammo": "AP",
      "saving": "BTS/2",
      "savingNum": "1",
      "traits": [
        "Technical Weapon",
        "Comms. Attack",
        "Disposable (2)",
        "Target (VITA)",
        "No LoF",
        "Zone of Control"
      ],
      "distance": null
    }
  ],
  "204": [
    {
      "name": "PT: Eraser",
      "mode": "Standard",
      "damage": "6",
      "burst": "2",
      "ammo": "DA",
      "saving": "BTS",
      "savingNum": "2",
      "traits": [
        "Technical Weapon",
        "Comms. Attack",
        "Target (VITA)",
        "State: Isolated",
        "Non-lethal",
        "No LoF",
        "Zone of Control"
      ],
      "distance": null
    }
  ],
  "205": [
    {
      "name": "PT: Mirrorball",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "Eclipse",
      "saving": "-",
      "savingNum": "-",
      "traits": [
        "Technical Weapon",
        "Comms. Attack",
        "Impact Template (Circular)",
        "Non-lethal",
        "Reflective",
        "No LoF",
        "Targetless",
        "Zone of Control"
      ],
      "distance": null
    }
  ],
  "206": [
    {
      "name": "Viral Marksman Rifle",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "N",
      "saving": "BTS",
      "savingNum": "1",
      "traits": [
        "Bioweapon (DA+SHOCK)",
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    }
  ],
  "207": [
    {
      "name": "Thunderbolt",
      "mode": "Standard",
      "damage": "6",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "0"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "208": [
    {
      "name": "Disco Baller",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "N",
      "saving": "-",
      "savingNum": "-",
      "traits": [
        "Speculative Attack",
        "Disposable (2)",
        "Double Shot",
        "Targetless",
        "[*]"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-3"
        }
      }
    },
    {
      "name": "Disco Baller",
      "mode": "Disco Ball",
      "damage": "-",
      "burst": "-",
      "ammo": "N",
      "saving": "-",
      "savingNum": "-",
      "traits": [],
      "distance": null
    }
  ],
  "210": [
    {
      "name": "MULTI Red Fury",
      "mode": "Antimaterial Mode",
      "damage": "7",
      "burst": "1",
      "ammo": "DA",
      "saving": "ARM",
      "savingNum": "2",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    },
    {
      "name": "MULTI Red Fury",
      "mode": "AP Mode",
      "damage": "7",
      "burst": "4",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    },
    {
      "name": "MULTI Red Fury",
      "mode": "Shock Mode",
      "damage": "7",
      "burst": "4",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    }
  ],
  "211": [
    {
      "name": "Silenced Pistol",
      "mode": "Standard",
      "damage": "8",
      "burst": "2",
      "ammo": "AP+Shock",
      "saving": "BTS/2",
      "savingNum": "1",
      "traits": [
        "Silent (-6)"
      ],
      "distance": {
        "max": {
          "max": 60,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        }
      }
    }
  ],
  "212": [
    {
      "name": "Boarding Pistol",
      "mode": "Blast Mode",
      "damage": "7",
      "burst": "1",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Direct Template (Small Teardrop)"
      ],
      "distance": null
    },
    {
      "name": "Boarding Pistol",
      "mode": "Hit Mode",
      "damage": "7",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [],
      "distance": {
        "max": {
          "max": 60,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        }
      }
    }
  ],
  "213": [
    {
      "name": "E/M Carbine",
      "mode": "Standard",
      "damage": "7",
      "burst": "2",
      "ammo": "E/M",
      "saving": "BTS/2",
      "savingNum": "2",
      "traits": [
        "Non-lethal",
        "[**]"
      ],
      "distance": {
        "med": {
          "max": 80,
          "mod": "-3"
        },
        "short": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-6"
        }
      }
    }
  ],
  "214": [
    {
      "name": "AP Submachine Gun",
      "mode": "Standard",
      "damage": "7",
      "burst": "3",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "max": {
          "max": 80,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 60,
          "mod": "-3"
        }
      }
    }
  ],
  "216": [
    {
      "name": "Adhesive Launcher Rifle",
      "mode": "Standard",
      "damage": "-",
      "burst": "2",
      "ammo": "PARA",
      "saving": "PH-6",
      "savingNum": "1",
      "traits": [
        "Non-lethal"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "217": [
    {
      "name": "Spitfire MULTI",
      "mode": "Anti-Material Mode",
      "damage": "6",
      "burst": "1",
      "ammo": "DA",
      "saving": "ARM",
      "savingNum": "2",
      "traits": [
        "Anti-materiel"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    },
    {
      "name": "Spitfire MULTI",
      "mode": "AP Mode",
      "damage": "6",
      "burst": "4",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    },
    {
      "name": "Spitfire MULTI",
      "mode": "Shock Mode",
      "damage": "6",
      "burst": "4",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Suppressive Fire"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    }
  ],
  "220": [
    {
      "name": "PARA Mine",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "PARA",
      "saving": "PH-6",
      "savingNum": "1",
      "traits": [
        "Intuitive Attack",
        "Concealed",
        "Disposable (3)",
        "Direct Template (Small Teardrop)",
        "Non-lethal",
        "Deployable",
        "[**]"
      ],
      "distance": null
    }
  ],
  "221": [
    {
      "name": "Kobra Pistol",
      "mode": "BS Mode",
      "damage": "7",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "[*]"
      ],
      "distance": {
        "med": {
          "max": 40,
          "mod": "0"
        },
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    },
    {
      "name": "Kobra Pistol",
      "mode": "CC Mode",
      "damage": "7",
      "burst": "1",
      "ammo": "Shock",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "CC",
        "[*]"
      ],
      "distance": null
    }
  ],
  "224": [
    {
      "name": "AP + T2 CC Weapon",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "AP+T2",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Anti-materiel",
        "CC"
      ],
      "distance": null
    }
  ],
  "226": [
    {
      "name": "Armed Turret",
      "mode": "Standard",
      "damage": "-",
      "burst": "-",
      "ammo": "N",
      "saving": "-",
      "savingNum": "1",
      "traits": [
        "Disposable (1)",
        "Perimeter",
        "Deployable",
        "Non-Reloadable"
      ],
      "distance": null
    },
    {
      "name": "Armed Turret",
      "mode": "Adhesive Launcher Rifle",
      "damage": "-",
      "burst": "2",
      "ammo": "PARA",
      "saving": "PH-6",
      "savingNum": "1",
      "traits": [
        "Disposable (1)",
        "Perimeter",
        "Deployable",
        "Non-Reloadable"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    },
    {
      "name": "Armed Turret",
      "mode": "AP Rifle",
      "damage": "7",
      "burst": "3",
      "ammo": "AP",
      "saving": "ARM/2",
      "savingNum": "1",
      "traits": [
        "Disposable (1)",
        "Perimeter",
        "Deployable",
        "Non-Reloadable"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    },
    {
      "name": "Armed Turret",
      "mode": "Combi Rifle",
      "damage": "7",
      "burst": "3",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Disposable (1)",
        "Perimeter",
        "Deployable",
        "Non-Reloadable"
      ],
      "distance": {
        "short": {
          "max": 40,
          "mod": "+3"
        },
        "max": null,
        "med": {
          "max": 80,
          "mod": "-3"
        },
        "long": {
          "max": 120,
          "mod": "-6"
        }
      }
    },
    {
      "name": "Armed Turret",
      "mode": "E/Mitter",
      "damage": "7",
      "burst": "2",
      "ammo": "E/M",
      "saving": "BTS/2",
      "savingNum": "1",
      "traits": [
        "Disposable (1)",
        "Perimeter",
        "Deployable",
        "Non-Reloadable"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "0"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    },
    {
      "name": "Armed Turret",
      "mode": "Marksman Rifle",
      "damage": "7",
      "burst": "3",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Disposable (1)",
        "Perimeter",
        "Deployable",
        "Non-Reloadable"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 100,
          "mod": "-3"
        }
      }
    },
    {
      "name": "Armed Turret",
      "mode": "Mk12",
      "damage": "5",
      "burst": "3",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Disposable (1)",
        "Perimeter",
        "Deployable",
        "Non-Reloadable"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 60,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    },
    {
      "name": "Armed Turret",
      "mode": "PARA CC Weapon",
      "damage": "-",
      "burst": "1",
      "ammo": "PARA",
      "saving": "PH-6",
      "savingNum": "1",
      "traits": [
        "Disposable (1)",
        "Perimeter",
        "Deployable",
        "Non-Reloadable"
      ],
      "distance": null
    },
    {
      "name": "Armed Turret",
      "mode": "Rifle",
      "damage": "7",
      "burst": "3",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Disposable (1)",
        "Perimeter",
        "Deployable",
        "Non-Reloadable"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "0"
        },
        "max": {
          "max": 120,
          "mod": "-6"
        },
        "med": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 80,
          "mod": "-3"
        }
      }
    },
    {
      "name": "Armed Turret",
      "mode": "Thunderbolt",
      "damage": "6",
      "burst": "2",
      "ammo": "N",
      "saving": "ARM",
      "savingNum": "1",
      "traits": [
        "Disposable (1)",
        "Perimeter",
        "Deployable",
        "Non-Reloadable"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "-3"
        },
        "max": {
          "max": 120,
          "mod": "0"
        },
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 80,
          "mod": "+3"
        }
      }
    }
  ],
  "227": [
    {
      "name": "AP + EXP CC Weapon",
      "mode": "Standard",
      "damage": "8",
      "burst": "1",
      "ammo": "AP+Exp",
      "saving": "ARM/2",
      "savingNum": "3",
      "traits": [
        "Anti-materiel",
        "CC"
      ],
      "distance": null
    }
  ],
  "237": [
    {
      "name": "GizmoKit",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "N",
      "saving": "",
      "savingNum": "-",
      "traits": [
        "Non-lethal",
        "[***]"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "+3"
        },
        "max": null,
        "med": {
          "max": 40,
          "mod": "0"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    }
  ],
  "238": [
    {
      "name": "Deactivator",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "N",
      "saving": "",
      "savingNum": "-",
      "traits": [
        "BS Weapon (WIP)",
        "[***]"
      ],
      "distance": {
        "short": {
          "max": 20,
          "mod": "+6"
        },
        "max": null,
        "med": {
          "max": 40,
          "mod": "+3"
        },
        "long": {
          "max": 60,
          "mod": "-6"
        }
      }
    }
  ],
  "240": [
    {
      "name": "FastPanda",
      "mode": "Standard",
      "damage": "-",
      "burst": "1",
      "ammo": "N",
      "saving": "",
      "savingNum": "-",
      "traits": [
        "Disposable (1)",
        "Indiscriminate",
        "Perimeter",
        "Deployable",
        "Zone of Control",
        "[***]"
      ],
      "distance": null
    }
  ],
  "243": [
    {
      "name": "Dazer",
      "mode": "Standard",
      "damage": "-",
      "burst": "-",
      "ammo": "N",
      "saving": "",
      "savingNum": "-",
      "traits": [
        "Disposable (3)",
        "Deployable",
        "Zone of Control"
      ],
      "distance": null
    }
  ]
};
