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

const debouncedRender = debounce(() => ui.sidebar?.render(false), 50);

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "RemoveBanners", {
    name: `Remove Banner Images`,
    hint: `All compendium banner images will be removed.`,
    type: Boolean,
    default: false,
    scope: "world",
    config: true,
    restricted: true,
    requiresReload: false,
    onChange: debouncedRender,
  });

  game.settings.register(MODULE_ID, "BannerHeight", {
    name: `Banners Height`,
    hint: `Height of compendium items. Use 55px for compact view. Default: 70px`,
    type: Number,
    range: {
      min: 20,
      max: 100,
      step: 5,
    },
    default: 70,
    scope: "world",
    config: true,
    restricted: true,
    requiresReload: false,
    onChange: debouncedRender,
  });

  game.settings.register(MODULE_ID, "HideSource", {
    name: `Hide Compendium Source`,
    hint: `Compendium source in the bottom left corner will be hidden.`,
    type: Boolean,
    default: false,
    scope: "world",
    config: true,
    restricted: true,
    requiresReload: false,
    onChange: debouncedRender,
  });

  game.settings.register(MODULE_ID, "LabelAlignment", {
    name: `Label Alignment`,
    hint: `The side to which compendium label will be aligned.`,
    type: String,
    choices: { start: "Left", center: "Center", end: "Right" },
    default: "center",
    scope: "world",
    config: true,
    restricted: true,
    requiresReload: false,
    onChange: debouncedRender,
  });

  for (const t of TYPES) {
    game.settings.register(MODULE_ID, t, {
      name: `${t} Banner`,
      hint: `Compendium banner image for ${t} document type.`,
      type: String,
      default: deepClone(CONFIG[t].compendiumBanner),
      filePicker: "image",
      scope: "world",
      config: true,
      restricted: true,
      requiresReload: false,
      onChange: (value) => {
        CONFIG[t].compendiumBanner = value;
        debouncedRender();
      },
    });

    CONFIG[t].compendiumBanner = game.settings.get(MODULE_ID, t);
  }
});

function applyChanges() {
  const compendiumItems = document.querySelectorAll(
    ".compendium-sidebar .directory-item.compendium"
  );

  compendiumItems.forEach((item) => {
    item.style.alignItems = game.settings.get(MODULE_ID, "LabelAlignment");
  });

  compendiumItems.forEach((item) => {
    item.style.height = `${game.settings.get(MODULE_ID, "BannerHeight")}px`;
  });

  if (game.settings.get(MODULE_ID, "HideSource")) {
    const sourceItems = document.querySelectorAll(
      ".compendium-sidebar .directory-item.compendium .compendium-footer"
    );

    sourceItems.forEach((item) => {
      item.style.display = "none";
    });
  }

  if (game.settings.get(MODULE_ID, "RemoveBanners")) {
    const images = document.querySelectorAll(
      ".compendium-sidebar .directory-item.compendium .compendium-banner"
    );

    images.forEach((item) => {
      item.style.display = "none";
    });
  }
}

Hooks.on("renderSidebarTab", (tab) => {
  if (!(tab instanceof CompendiumDirectory)) return;
  applyChanges();
});

Hooks.on("changeSidebarTab", (tab) => {
  if (!(tab instanceof CompendiumDirectory)) return;
  applyChanges();
});
