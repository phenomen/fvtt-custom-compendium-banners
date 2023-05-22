const MODULE_ID = "custom-compendium-banners";

const TYPES = [
  "Actor",
  "Adventure",
  "Cards",
  "JournalEntry",
  "Item",
  "Macro",
  "Playlist",
  "RollTable",
  "Scene",
];

Hooks.once("init", async () => {
  game.settings.register(MODULE_ID, "RemoveBanners", {
    name: `Remove All Banners`,
    hint: `All compendium banner images will be removed.`,
    type: Boolean,
    default: false,
    scope: "world",
    config: true,
    restricted: true,
    requiresReload: true,
  });

  game.settings.register(MODULE_ID, "BannerHeight", {
    name: `Banners Height`,
    hint: `Height of compendium items. Use 55px for compact view. Default: 70px`,
    type: Number,
    default: 70,
    scope: "world",
    config: true,
    restricted: true,
    requiresReload: true,
  });

  for (const t of TYPES) {
    game.settings.register(MODULE_ID, t, {
      name: `${t} Banner`,
      hint: `Compendium banner image for ${t} document type.`,
      type: String,
      default: CONFIG[t].compendiumBanner,
      filePicker: "image",
      scope: "world",
      config: true,
      restricted: true,
      requiresReload: true,
    });

    CONFIG[t].compendiumBanner = game.settings.get(MODULE_ID, t);
  }

  if (game.settings.get(MODULE_ID, "RemoveBanners")) {
    for (const t of TYPES) {
      CONFIG[t].compendiumBanner = null;
    }
  }
});

Hooks.once("ready", async () => {
  const compendiumItems = document.querySelectorAll(
    ".compendium-sidebar .directory-item.compendium"
  );

  compendiumItems.forEach((item) => {
    item.style.height = `${game.settings.get(MODULE_ID, "BannerHeight")}px`;
  });
});
