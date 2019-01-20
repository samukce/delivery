try {
    window.Hammer = require('hammerjs');
}
catch (e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND")
        console.log("Can't load foo!");
    else
        throw e;
}